#!/usr/bin/env python3
"""Build the short, airy navigation sound from the unmodified reference MP3.

Uses only Python's standard library plus macOS afconvert and LAME. Example:
  python3 tools/build-transition-audio.py --input-wav /tmp/iusx-reference-sound.wav

No resampling, pitch shifting, modulation, or feedback delay is applied. The
stereo room consists of deterministic, irregular FIR reflections that end after
240 ms. All parameters live below so the asset can be rebuilt or reverted.
"""

import argparse
from array import array
import json
import math
from pathlib import Path
import subprocess
import sys
import tempfile
import wave


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT / "public/audio/page-transition-data-stream.mp3"
DEFAULT_OUTPUT = ROOT / "public/audio/page-transition-data-stream-airy.mp3"
TAIL_SECONDS = 0.240
MAX_SECONDS = 1.250
WET_MIX = 0.20
ATTACK_SECONDS = 0.012
FINAL_FADE_SECONDS = 0.080
HIGHSHELF_DB = -2.8
PEAK_LIMIT = 0.68
RMS_LIMIT_RATIO = 0.98


def rms(channels):
    count = sum(len(channel) for channel in channels)
    return math.sqrt(sum(value * value for channel in channels for value in channel) / max(1, count))


def biquad(samples, rate, kind, hz, gain_db=0.0):
    """RBJ high-pass, low-pass, or gentle S=1 high shelf."""
    omega = 2 * math.pi * hz / rate
    cosine, sine = math.cos(omega), math.sin(omega)
    alpha = sine / math.sqrt(2)
    if kind == "highpass":
        b0, b1, b2 = (1 + cosine) / 2, -(1 + cosine), (1 + cosine) / 2
        a0, a1, a2 = 1 + alpha, -2 * cosine, 1 - alpha
    elif kind == "lowpass":
        b0, b1, b2 = (1 - cosine) / 2, 1 - cosine, (1 - cosine) / 2
        a0, a1, a2 = 1 + alpha, -2 * cosine, 1 - alpha
    else:
        amplitude = 10 ** (gain_db / 40)
        beta = 2 * math.sqrt(amplitude) * alpha
        b0 = amplitude * ((amplitude + 1) + (amplitude - 1) * cosine + beta)
        b1 = -2 * amplitude * ((amplitude - 1) + (amplitude + 1) * cosine)
        b2 = amplitude * ((amplitude + 1) + (amplitude - 1) * cosine - beta)
        a0 = (amplitude + 1) - (amplitude - 1) * cosine + beta
        a1 = 2 * ((amplitude - 1) - (amplitude + 1) * cosine)
        a2 = (amplitude + 1) - (amplitude - 1) * cosine - beta
    b0, b1, b2, a1, a2 = (coefficient / a0 for coefficient in (b0, b1, b2, a1, a2))
    result = array("d")
    x1 = x2 = y1 = y2 = 0.0
    for value in samples:
        output = b0 * value + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2
        result.append(output)
        x2, x1, y2, y1 = x1, value, y1, output
    return result


def soften(channels, rate):
    """Linked stereo soft-knee compression; keep the source's pulse timing."""
    attack = math.exp(-1 / (rate * 0.0015))
    release = math.exp(-1 / (rate * 0.035))
    gain_db = 0.0
    for index in range(len(channels[0])):
        peak = max(abs(channel[index]) for channel in channels)
        level_db = 20 * math.log10(max(peak, 1e-9))
        above = level_db - (-16.0)
        # Ratio 1.8:1; a 6 dB knee avoids an abrupt threshold.
        if above <= -3:
            target_db = 0.0
        elif above >= 3:
            target_db = -(1 - 1 / 1.8) * above
        else:
            target_db = -(1 - 1 / 1.8) * (above + 3) ** 2 / 12
        coefficient = attack if target_db < gain_db else release
        gain_db = coefficient * gain_db + (1 - coefficient) * target_db
        gain = 10 ** (gain_db / 20)
        for channel in channels:
            channel[index] *= gain
    return channels


def room(channels, rate, length):
    """Early reflections plus a 48-tap diffuse, strictly finite stereo room."""
    wet = [array("d", [0.0]) * length for _ in range(2)]
    # Early arrivals are quiet and offset between ears, without chorus/LFO.
    early = [(0.013, 0.36), (0.023, -0.27), (0.037, 0.20), (0.051, 0.14)]
    seed = 73129
    for ear in range(2):
        taps = [(seconds + ear * 0.0037, gain) for seconds, gain in early]
        for tap in range(48):
            seed = (1664525 * seed + 1013904223) & 0xFFFFFFFF
            jitter = (seed / 0x100000000 - 0.5) * 0.0032
            seconds = 0.055 + tap * (0.181 / 47) + jitter
            sign = 1 if seed & 0x10000 else -1
            gain = sign * 0.12 * math.exp(-(seconds - 0.055) / 0.052)
            taps.append((seconds, gain))
        for seconds, gain in taps:
            offset = round(seconds * rate)
            for index in range(min(len(channels[0]), length - offset)):
                # Mostly the matching ear, with quiet cross-feed for width.
                value = channels[ear][index] * 0.78 + channels[1 - ear][index] * 0.22
                wet[ear][index + offset] += value * gain
        wet[ear] = biquad(biquad(wet[ear], rate, "highpass", 700), rate, "lowpass", 7000)
    # Match energy before mixing so 20% means a reproducible wet balance.
    gain = min(3.0, rms(channels) / max(rms(wet), 1e-9))
    return [array("d", (value * gain for value in channel)) for channel in wet]


def read_pcm(path):
    with wave.open(str(path), "rb") as source:
        if source.getsampwidth() != 2 or source.getnchannels() not in (1, 2):
            raise ValueError("Input WAV must be mono/stereo signed 16-bit PCM")
        rate = source.getframerate()
        count = source.getnchannels()
        raw = array("h", source.readframes(source.getnframes()))
    if sys.byteorder != "little":
        raw.byteswap()
    channels = [array("d", (value / 32768 for value in raw[ear::count])) for ear in range(count)]
    if count == 1:
        channels.append(array("d", channels[0]))
    return rate, channels


def write_pcm(path, rate, channels):
    raw = array("h")
    for index in range(len(channels[0])):
        for channel in channels:
            raw.append(max(-32768, min(32767, round(channel[index] * 32767))))
    if sys.byteorder != "little":
        raw.byteswap()
    with wave.open(str(path), "wb") as output:
        output.setparams((2, 2, rate, len(channels[0]), "NONE", "not compressed"))
        output.writeframes(raw.tobytes())


def stats(channels, rate, source_frames=None):
    def section(start, end):
        values = [channel[start:end] for channel in channels]
        return {"rms": round(rms(values), 7), "peak": round(max((abs(value) for channel in values for value in channel), default=0), 7)}
    length = len(channels[0])
    result = {"seconds": round(length / rate, 6), **section(0, length),
              "first_10ms": section(0, round(rate * 0.01)),
              "last_10ms": section(length - round(rate * 0.01), length),
              "first_sample": [round(channel[0], 7) for channel in channels],
              "last_sample": [round(channel[-1], 7) for channel in channels]}
    if source_frames is not None:
        result["added_tail"] = section(source_frames, length)
        result["last_80ms"] = section(length - round(rate * 0.08), length)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--input-wav", type=Path, help="Reuse an already decoded, 16-bit PCM WAV")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--output-wav", type=Path, help="Also retain the processed PCM for inspection")
    args = parser.parse_args()
    with tempfile.TemporaryDirectory(prefix="iusx-transition-") as directory:
        scratch = Path(directory)
        decoded = args.input_wav or scratch / "source.wav"
        if not args.input_wav:
            subprocess.run(["/usr/bin/afconvert", "-f", "WAVE", "-d", "LEI16", str(args.input), str(decoded)], check=True)
        rate, original = read_pcm(decoded)
        source_frames = len(original[0])
        if source_frames / rate + TAIL_SECONDS > MAX_SECONDS:
            raise ValueError("Source plus room tail exceeds 1.25 s; choose a shorter reference without changing its speed")
        dry = soften([biquad(biquad(channel, rate, "highpass", 110), rate, "highshelf", 3500, HIGHSHELF_DB) for channel in original], rate)
        length = source_frames + round(rate * TAIL_SECONDS)
        wet = room(dry, rate, length)
        output = [array("d", ((1 - WET_MIX) * (dry[ear][index] if index < source_frames else 0) + WET_MIX * wet[ear][index] for index in range(length))) for ear in range(2)]
        attack_frames = round(rate * ATTACK_SECONDS)
        release_frames = round(rate * FINAL_FADE_SECONDS)
        for index in range(length):
            attack = math.sin(min(1.0, index / attack_frames) * math.pi / 2) ** 2
            release = math.sin(min(1.0, (length - 1 - index) / release_frames) * math.pi / 2) ** 2
            for channel in output:
                channel[index] *= attack * release
        peak = max(abs(value) for channel in output for value in channel)
        # Reduction only: no make-up gain, and never louder than the reference.
        gain = min(1.0, PEAK_LIMIT / max(peak, 1e-9), rms(original) * RMS_LIMIT_RATIO / max(rms(output), 1e-9))
        output = [array("d", (value * gain for value in channel)) for channel in output]
        pcm = args.output_wav or scratch / "airy.wav"
        write_pcm(pcm, rate, output)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(["/opt/homebrew/bin/lame", "--silent", "--noreplaygain", "-b", "192", str(pcm), str(args.output)], check=True)
        print(json.dumps({"reference": stats(original, rate), "processed_pcm": stats(output, rate, source_frames), "output": str(args.output), "parameters": {"wet_mix": WET_MIX, "room_tail_seconds": TAIL_SECONDS, "highshelf_db": HIGHSHELF_DB, "final_gain": round(gain, 7)}}, indent=2))


if __name__ == "__main__":
    main()
