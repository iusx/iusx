const SOUND_URL = "/audio/page-transition-data-stream-airy.mp3";
const SOUND_LEVEL = 0.3;
const ATTACK = 0.016;
const RELEASE = 0.09;
const STOP_FADE = 0.035;

type Voice = {
  source: AudioBufferSourceNode;
  gain: GainNode;
  started: number;
  duration: number;
  stopping: boolean;
  cleanupTimer?: ReturnType<typeof setTimeout>;
};

/** Safe to construct during SSR. Audio is created only inside unlock's user gesture. */
export function createTransitionSoundPlayer() {
  let context: AudioContext | undefined;
  let buffer: AudioBuffer | undefined;
  let disposed = false;
  let resumePending: Promise<boolean> | undefined;
  let audioData: ArrayBuffer | undefined;
  let fetchPending: Promise<ArrayBuffer | undefined> | undefined;
  let decodePending: Promise<boolean> | undefined;
  let fetchController: AbortController | undefined;
  const voices = new Set<Voice>();

  function fetchAudio(): Promise<ArrayBuffer | undefined> {
    if (disposed || typeof window === "undefined") return Promise.resolve(undefined);
    if (audioData) return Promise.resolve(audioData);
    if (fetchPending) return fetchPending;
    const controller = new AbortController();
    fetchController = controller;
    const pending: Promise<ArrayBuffer | undefined> = fetch(SOUND_URL, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error("Sound unavailable");
        return response.arrayBuffer();
      })
      .then(data => {
        if (disposed || controller.signal.aborted) return undefined;
        audioData = data;
        return data;
      })
      .catch(() => undefined)
      .finally(() => {
        if (fetchPending === pending) fetchPending = undefined;
        if (fetchController === controller) fetchController = undefined;
      });
    fetchPending = pending;
    return pending;
  }

  function preload(): Promise<boolean> {
    // Pre-fetch the small local asset without opening or resuming an audio device.
    return fetchAudio().then(data => !!data && !disposed);
  }

  function decodeAudio(current: AudioContext): Promise<boolean> {
    if (buffer) return Promise.resolve(true);
    if (decodePending) return decodePending;
    const pending: Promise<boolean> = fetchAudio().then(async data => {
      if (!data || disposed || context !== current || current.state === "closed") return false;
      const decoded = await current.decodeAudioData(data.slice(0));
      if (disposed || context !== current) return false;
      buffer = decoded;
      return true;
    }).catch(() => false).finally(() => {
      if (decodePending === pending) decodePending = undefined;
    });
    decodePending = pending;
    return pending;
  }

  function clean(voice: Voice) {
    if (!voices.delete(voice)) return;
    clearTimeout(voice.cleanupTimer);
    voice.source.onended = null;
    try { voice.source.disconnect(); } catch { /* Already disconnected. */ }
    try { voice.gain.disconnect(); } catch { /* Already disconnected. */ }
  }

  function close(audioContext: AudioContext) {
    if (audioContext.state === "closed") return;
    try { void audioContext.close().catch(() => {}); } catch { /* Audio is optional. */ }
  }

  function unlock(): Promise<boolean> {
    if (disposed || typeof window === "undefined") return Promise.resolve(false);
    try {
      if (!context) {
        const AudioContextClass = window.AudioContext
          ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return Promise.resolve(false);
        context = new AudioContextClass({ latencyHint: "interactive" });
      }
      const current = context;
      if (current.state === "closed") return Promise.resolve(false);
      // Call resume synchronously while the trusted pointer/key gesture is active.
      if (current.state !== "running" && !resumePending) {
        const pending: Promise<boolean> = current.resume().then(() => {
          if (disposed) {
            close(current);
            return false;
          }
          return context === current && current.state === "running";
        }).catch(() => false).finally(() => {
          if (resumePending === pending) resumePending = undefined;
        });
        resumePending = pending;
      }
      return Promise.all([
        resumePending ?? Promise.resolve(current.state === "running"),
        decodeAudio(current),
      ]).then(([ready, decoded]) => ready && decoded && !disposed && context === current);
    } catch {
      // Unsupported or denied audio must never interrupt navigation.
      return Promise.resolve(false);
    }
  }

  function stop() {
    const current = context;
    for (const voice of voices) {
      if (voice.stopping) continue;
      voice.stopping = true;
      if (!current || current.state === "closed") {
        clean(voice);
        continue;
      }
      const now = current.currentTime;
      const elapsed = Math.max(0, now - voice.started);
      const level = SOUND_LEVEL * Math.max(0, Math.min(1, elapsed / ATTACK, (voice.duration - elapsed) / RELEASE));
      try {
        voice.gain.gain.cancelScheduledValues(now);
        voice.gain.gain.setValueAtTime(level, now);
        voice.gain.gain.linearRampToValueAtTime(0, now + STOP_FADE);
        voice.source.stop(now + STOP_FADE);
        // A suspended context may never dispatch ended; still release its nodes.
        voice.cleanupTimer = setTimeout(() => clean(voice), Math.ceil(STOP_FADE * 1000) + 20);
      } catch { clean(voice); }
    }
  }

  function play() {
    stop();
    const current = context;
    // Never resume or queue a delayed sound here: it belongs to this transition.
    if (disposed || !current || current.state !== "running" || !buffer) return;
    let voice: Voice | undefined;
    let source: AudioBufferSourceNode | undefined;
    let gain: GainNode | undefined;
    try {
      source = current.createBufferSource();
      gain = current.createGain();
      const now = current.currentTime;
      source.buffer = buffer;
      source.connect(gain);
      gain.connect(current.destination);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(SOUND_LEVEL, now + ATTACK);
      gain.gain.setValueAtTime(SOUND_LEVEL, now + buffer.duration - RELEASE);
      gain.gain.linearRampToValueAtTime(0, now + buffer.duration);
      voice = { source, gain, started: now, duration: buffer.duration, stopping: false };
      voices.add(voice);
      const startedVoice = voice;
      source.onended = () => clean(startedVoice);
      source.start(now);
    } catch {
      if (voice) clean(voice);
      else {
        try { source?.disconnect(); } catch { /* Audio is optional. */ }
        try { gain?.disconnect(); } catch { /* Audio is optional. */ }
      }
    }
  }

  function dispose() {
    if (disposed) return;
    stop();
    disposed = true;
    fetchController?.abort();
    audioData = undefined;
    const current = context;
    context = undefined;
    buffer = undefined;
    if (!current) return;
    // Allow the brief stop envelope to finish before closing the audio device.
    setTimeout(() => {
      for (const voice of voices) clean(voice);
      close(current);
    }, STOP_FADE * 1000 + 4);
  }

  return { preload, unlock, play, stop, dispose };
}
