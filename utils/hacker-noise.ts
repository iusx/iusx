export interface HackerNoiseOptions {
  frame: number
  color: string
  intensity: number
  rows: number
  /** Optional square particles; bounded to 32 per frame. */
  particles?: number
}

/** Draw sparse corruption lines and pixels without clearing or adding text. */
export function drawHackerNoise(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: HackerNoiseOptions,
): void {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return
  const frame = Number.isFinite(options.frame) ? Math.trunc(options.frame) : 0
  const intensity = Number.isFinite(options.intensity) ? Math.max(0, Math.min(1, options.intensity)) : 0
  const count = (value: number | undefined) => Number.isFinite(value)
    ? Math.max(0, Math.min(32, Math.floor(value!))) : 0
  const rows = count(options.rows)
  const particles = count(options.particles)
  if (!intensity || (!rows && !particles)) return

  context.save()
  context.fillStyle = options.color
  context.globalAlpha = intensity
  for (let row = 0; row < rows; row++) {
    const y = ((frame * 43 + row * 179) % Math.max(1, height - 36)) + 18
    const x = (frame * 73 + row * 127) % Math.max(1, width - 240)
    context.fillRect(x, y + 5, 28 + frame % 80, 1)
  }

  const hash = (seed: number) => {
    const value = Math.sin(seed * 127.1) * 43758.5453123
    return value - Math.floor(value)
  }
  for (let particle = 0; particle < particles; particle++) {
    const seed = frame * 97 + particle * 23
    const size = 1 + Math.floor(hash(seed + 3) * 3)
    const x = Math.floor(hash(seed + 7) * Math.max(1, width - size))
    const y = Math.floor(hash(seed + 19) * Math.max(1, height - size))
    context.globalAlpha = intensity * (0.35 + hash(seed + 41) * 0.45)
    context.fillRect(x, y, size, size)
  }
  context.restore()
}
