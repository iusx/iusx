export type RGB = [number, number, number]

export interface BackgroundPalette {
  rgb: RGB
  background: string
  foreground: string
  accent: string
  isLight: boolean
  /** Fraction of the sampled border belonging to the selected color cluster. */
  confidence: number
}

interface ColorBin {
  red: number
  green: number
  blue: number
  weight: number
  sides: number
}

/**
 * Find the dominant opaque border color instead of averaging the artwork.
 * A narrow border and extra corner weight keep large subjects from tinting
 * an otherwise white or black canvas. Nearby bins merge JPEG/resize noise.
 */
export function detectBackgroundColor(
  pixels: ArrayLike<number>,
  width: number,
  height: number,
): BackgroundPalette | null {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) return null
  if (pixels.length < width * height * 4) return null

  const bins = new Map<number, ColorBin>()
  const border = Math.max(1, Math.ceil(Math.min(width, height) * 0.04))
  const positions = (length: number) => {
    const samples: number[] = []
    const stride = Math.max(1, Math.floor(length / 128))
    for (let position = 0; position < length; position += stride) samples.push(position)
    if (samples[samples.length - 1] !== length - 1) samples.push(length - 1)
    return samples
  }
  const columns = positions(width)
  const rows = positions(height)
  let totalWeight = 0

  for (const y of rows) {
    for (const x of columns) {
      const left = x < border
      const right = x >= width - border
      const top = y < border
      const bottom = y >= height - border
      if (!left && !right && !top && !bottom) continue

      const offset = (y * width + x) * 4
      const alpha = pixels[offset + 3]!
      // Transparent RGB values frequently contain black or export garbage.
      if (alpha < 200) continue
      const red = pixels[offset]!
      const green = pixels[offset + 1]!
      const blue = pixels[offset + 2]!
      if (![red, green, blue, alpha].every(Number.isFinite)) continue
      const weight = (alpha / 255) * ((left || right) && (top || bottom) ? 2 : 1)
      const key = (Math.floor(red / 16) << 8) | (Math.floor(green / 16) << 4) | Math.floor(blue / 16)
      const bin = bins.get(key) ?? { red: 0, green: 0, blue: 0, weight: 0, sides: 0 }
      bin.red += red * weight
      bin.green += green * weight
      bin.blue += blue * weight
      bin.weight += weight
      bin.sides |= (left ? 1 : 0) | (right ? 2 : 0) | (top ? 4 : 0) | (bottom ? 8 : 0)
      bins.set(key, bin)
      totalWeight += weight
    }
  }

  if (!totalWeight) return null
  const colors = [...bins.values()].map(bin => ({
    ...bin,
    red: bin.red / bin.weight,
    green: bin.green / bin.weight,
    blue: bin.blue / bin.weight,
  })).sort((a, b) => b.weight - a.weight)

  let selected: ColorBin | undefined
  let bestScore = -1
  // The largest bins are enough to locate the background, while bounding
  // work for photographic images whose borders contain hundreds of colors.
  for (const seed of colors.slice(0, 32)) {
    const cluster: ColorBin = { red: 0, green: 0, blue: 0, weight: 0, sides: 0 }
    for (const color of colors) {
      if (Math.max(
        Math.abs(seed.red - color.red),
        Math.abs(seed.green - color.green),
        Math.abs(seed.blue - color.blue),
      ) > 28) continue
      cluster.red += color.red * color.weight
      cluster.green += color.green * color.weight
      cluster.blue += color.blue * color.weight
      cluster.weight += color.weight
      cluster.sides |= color.sides
    }
    const sideCount = [1, 2, 4, 8].filter(side => cluster.sides & side).length
    const score = cluster.weight * (1 + sideCount * 0.04)
    if (score <= bestScore) continue
    selected = cluster
    bestScore = score
  }

  if (!selected) return null
  let rgb: RGB = [
    Math.round(selected.red / selected.weight),
    Math.round(selected.green / selected.weight),
    Math.round(selected.blue / selected.weight),
  ]
  const maximum = Math.max(...rgb)
  const minimum = Math.min(...rgb)
  // Make a near-white/near-black exported canvas exactly match page white/
  // black. Preserve warm off-white and other intentionally colored canvases.
  if (minimum >= 242 && maximum - minimum <= 8) rgb = [255, 255, 255]
  else if (maximum <= 18 && maximum - minimum <= 6) rgb = [0, 0, 0]
  return createBackgroundPalette(rgb, selected.weight / totalWeight)
}

/** Recompute readable interface colors while the page background interpolates. */
export function createBackgroundPalette(color: RGB, confidence = 1): BackgroundPalette {
  const rgb = color.map(channel => Math.round(Math.max(0, Math.min(255,
    Number.isFinite(channel) ? channel : 0,
  )))) as RGB
  const luminanceOf = (color: number[]) => {
    const linear = color.map(value => {
      const channel = value / 255
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
    })
    return linear[0]! * 0.2126 + linear[1]! * 0.7152 + linear[2]! * 0.0722
  }
  const toHex = (color: number[]) => `#${color.map(value => value.toString(16).padStart(2, '0')).join('')}`
  const luminance = luminanceOf(rgb)
  const isLight = luminance > 0.179
  const foreground = isLight ? '#000000' : '#ffffff'
  const baseAccent = isLight ? [0, 110, 91] : [56, 231, 205]
  const target = isLight ? 0 : 255
  let accent = baseAccent
  // Darken/lighten the accent only as far as needed for readable controls,
  // including unusually colored or mid-gray artwork backgrounds.
  for (let step = 0; step <= 20; step++) {
    accent = baseAccent.map(channel => Math.round(channel + (target - channel) * step / 20))
    const accentLuminance = luminanceOf(accent)
    const contrast = (Math.max(luminance, accentLuminance) + 0.05)
      / (Math.min(luminance, accentLuminance) + 0.05)
    if (contrast >= 4.5) break
  }
  return {
    rgb,
    background: toHex(rgb),
    foreground,
    accent: toHex(accent),
    isLight,
    confidence: Math.max(0, Math.min(1, confidence)),
  }
}

/** Sample a loaded image once; tainted canvases and unavailable DOM fail safely. */
export function sampleImageBackground(
  image: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
): BackgroundPalette | null {
  if (typeof document === 'undefined') return null
  const sourceWidth = 'naturalWidth' in image ? image.naturalWidth : image.width
  const sourceHeight = 'naturalHeight' in image ? image.naturalHeight : image.height
  if (!sourceWidth || !sourceHeight) return null

  try {
    const scale = Math.min(1, 96 / Math.max(sourceWidth, sourceHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(sourceWidth * scale))
    canvas.height = Math.max(1, Math.round(sourceHeight * scale))
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) return null
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    const sample = context.getImageData(0, 0, canvas.width, canvas.height)
    return detectBackgroundColor(sample.data, canvas.width, canvas.height)
  } catch {
    // Images from a host without CORS headers must still be displayable.
    return null
  }
}
