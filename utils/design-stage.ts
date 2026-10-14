import { sampleImageBackground } from './design-background'
import type { BackgroundPalette } from './design-background'

export interface StageImage {
  texture: import('three').Texture
  width: number
  height: number
  background: BackgroundPalette | null
}

export interface StageMotion {
  transition?: number
  transitionFx?: number
  dragX?: number
  direction?: number
  hover?: number
  pointerX?: number
  pointerY?: number
  reduced?: boolean
}

export interface DesignStage {
  loadImage: (url: string) => Promise<StageImage | null>
  setImages: (current: StageImage, next?: StageImage) => void
  setMotion: (motion: StageMotion) => void
  render: (timeSeconds: number) => void
  resize: () => void
  dispose: () => void
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform sampler2D uCurrent;
  uniform sampler2D uNext;
  uniform vec2 uViewport;
  uniform vec2 uCurrentSize;
  uniform vec2 uNextSize;
  uniform vec2 uPointer;
  uniform float uTime;
  uniform float uTransition;
  uniform float uTransitionFx;
  uniform float uDragX;
  uniform float uDirection;
  uniform float uHover;
  uniform float uReduced;
  varying vec2 vUv;

  float hash(float value) {
    return fract(sin(value * 127.1) * 43758.5453123);
  }

  vec2 coverUv(vec2 uv, vec2 imageSize) {
    float screenAspect = uViewport.x / max(uViewport.y, 1.0);
    float imageAspect = imageSize.x / max(imageSize.y, 1.0);
    vec2 scale = vec2(1.0);
    if (screenAspect > imageAspect) {
      scale.y = imageAspect / screenAspect;
    } else {
      scale.x = screenAspect / imageAspect;
    }
    return (uv - 0.5) * scale + 0.5;
  }

  vec3 imageColor(sampler2D image, vec2 uv, vec2 imageSize, float split) {
    vec2 mapped = coverUv(clamp(uv, 0.001, 0.999), imageSize);
    vec3 color = texture2D(image, mapped).rgb;
    if (split > 0.0) {
      vec2 shift = vec2(split, 0.0);
      color.r = texture2D(image, clamp(mapped + shift, 0.001, 0.999)).r;
      color.b = texture2D(image, clamp(mapped - shift, 0.001, 0.999)).b;
    }
    return color;
  }

  void main() {
    // Hover freezes ambient motion. An explicitly requested transition is a
    // separate, finite effect and may run while inspecting the artwork.
    float motion = (1.0 - step(0.999, uHover)) * (1.0 - uHover) * (1.0 - uReduced);
    float transitionFx = clamp(uTransitionFx, 0.0, 1.0) * (1.0 - uReduced);
    float progress = clamp(uTransition, 0.0, 1.0);
    float blend = smoothstep(0.0, 1.0, progress);
    float envelope = smoothstep(0.0, 0.28, progress) * (1.0 - smoothstep(0.72, 1.0, progress));
    float corruption = envelope * transitionFx;
    float phase = floor(progress * 26.0);
    float frame = floor(uTime * 16.0);
    float burst = step(0.955, hash(frame * 0.217));
    float line = floor(vUv.y * 54.0);
    float stripe = step(0.91, hash(line + frame * 0.31)) * burst;
    float jitter = (hash(frame + 0.7) - 0.5) * 0.002 * burst;
    float tear = (hash(line * 4.7 + frame) - 0.5) * stripe * 0.027;

    // Incoming pixels propagate across staggered rows instead of sliding the
    // artwork vertically. Reveal endpoints are exactly the original cover UVs.
    float travel = uDirection > 0.0 ? vUv.x : 1.0 - vUv.x;
    float blockRow = floor(vUv.y * 38.0);
    float softness = 0.008 + envelope * 0.017;
    float threshold = progress * (1.0 + softness * 2.0) - softness;
    float revealFault = (hash(blockRow * 9.1 + phase * 0.13) - 0.5) * corruption * 0.12;
    float reveal = 1.0 - smoothstep(threshold - softness, threshold + softness, travel + revealFault);
    float edge = 1.0 - smoothstep(0.01, 0.095, abs(travel + revealFault - threshold));
    float damagedRow = step(0.75, hash(blockRow * 5.9 + phase));
    float blockTear = (hash(blockRow * 11.3 + phase * 7.1) - 0.5)
      * damagedRow * corruption * (0.025 + edge * 0.075);
    float screenJitter = (hash(phase + 8.3) - 0.5) * corruption * 0.008
      * step(0.48, hash(phase * 0.71));
    float split = motion * (0.00035 + burst * 0.0013)
      + corruption * (0.0008 + damagedRow * 0.001 + edge * 0.0034);

    vec2 uv = vUv;
    // Direct dragging follows the gesture even during hover. Its proportional
    // overscan disappears with dragX, leaving the unchanged cover crop at zero.
    uv = (uv - 0.5) / (1.0 + motion * 0.018 + abs(uDragX) * 0.11) + 0.5;
    uv.x -= uDragX * 0.045;
    uv += uPointer * motion * 0.003;
    uv.x += (tear + jitter) * motion + screenJitter;
    uv.y += jitter * motion * 0.2 + screenJitter * 0.12;

    vec2 currentUv = uv + vec2(blockTear * uDirection, 0.0);
    vec2 nextUv = uv - vec2(blockTear * uDirection * 0.7, 0.0);

    vec3 current = imageColor(uCurrent, currentUv, uCurrentSize, split);
    vec3 next = imageColor(uNext, nextUv, uNextSize, split);
    vec3 color = mix(current, next, mix(blend, reveal, transitionFx));

    // Thin scanlines and dark fractures keep the image readable without
    // text overlays, full-screen exposure, or white flashes.
    float scanline = 0.5 + 0.5 * sin(vUv.y * uViewport.y * 3.14159265);
    float fracture = 1.0 - smoothstep(0.008, 0.028, abs(fract(vUv.y * 38.0) - 0.5));
    color *= 1.0 - (motion * 0.026 + corruption * 0.018) * scanline;
    color *= 1.0 - fracture * damagedRow * corruption * (0.12 + edge * 0.16);
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`

/** Client-only renderer. Its owner controls the GSAP ticker and image sequence. */
export async function createDesignStage(
  host: HTMLElement,
  onContextLost?: () => void,
): Promise<DesignStage> {
  if (typeof window === 'undefined') {
    throw new Error('The design stage requires a browser.')
  }

  const THREE = await import('three')
  if (!host.isConnected) {
    throw new Error('The design stage was removed before it could initialize.')
  }

  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
  })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setClearColor(0x050606, 1)

  const canvas = renderer.domElement
  canvas.setAttribute('aria-hidden', 'true')
  canvas.style.cssText = 'display:block;width:100%;height:100%;pointer-events:none;'
  host.appendChild(canvas)

  const placeholder = new THREE.DataTexture(new Uint8Array([5, 6, 6, 255]), 1, 1)
  placeholder.colorSpace = THREE.SRGBColorSpace
  placeholder.needsUpdate = true

  const uniforms = {
    uCurrent: { value: placeholder as import('three').Texture },
    uNext: { value: placeholder as import('three').Texture },
    uViewport: { value: new THREE.Vector2(1, 1) },
    uCurrentSize: { value: new THREE.Vector2(1, 1) },
    uNextSize: { value: new THREE.Vector2(1, 1) },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uTime: { value: 0 },
    uTransition: { value: 0 },
    uTransitionFx: { value: 0 },
    uDragX: { value: 0 },
    uDirection: { value: 1 },
    uHover: { value: 0 },
    uReduced: { value: 0 },
  }
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  })
  const geometry = new THREE.PlaneGeometry(2, 2)
  const plane = new THREE.Mesh(geometry, material)
  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2)
  camera.position.z = 1
  scene.add(plane)

  const cache = new Map<string, Promise<StageImage | null>>()
  const textures = new Map<string, import('three').Texture>()
  const pending = new Set<() => void>()
  const maximumTextureSize = Math.min(renderer.capabilities.maxTextureSize, 4096)
  let disposed = false

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

  function trimCache() {
    // Keep only a few slides resident. The two textures in a running transition
    // are always protected, even when requests finish in a different order.
    for (const [url, texture] of textures) {
      if (textures.size <= 5) break
      if (texture === uniforms.uCurrent.value || texture === uniforms.uNext.value) continue
      textures.delete(url)
      cache.delete(url)
      texture.dispose()
    }
  }

  function touchTexture(texture: import('three').Texture) {
    for (const [url, stored] of textures) {
      if (stored !== texture) continue
      textures.delete(url)
      textures.set(url, texture)
      return
    }
  }

  function resize() {
    if (disposed) return
    const bounds = host.getBoundingClientRect()
    const width = Math.max(1, Math.round(bounds.width))
    const height = Math.max(1, Math.round(bounds.height))
    const mobile = window.matchMedia('(pointer: coarse)').matches || width < 768
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75))
    renderer.setSize(width, height, false)
    uniforms.uViewport.value.set(width, height)
  }

  function loadImage(url: string): Promise<StageImage | null> {
    if (disposed || !url) return Promise.resolve(null)
    const existing = cache.get(url)
    if (existing) {
      const texture = textures.get(url)
      if (texture) touchTexture(texture)
      return existing
    }

    const task = new Promise<StageImage | null>((resolve) => {
      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.decoding = 'async'
      let settled = false
      let timeout: number | undefined

      const finish = (result: StageImage | null) => {
        if (settled) return
        settled = true
        window.clearTimeout(timeout)
        image.onload = null
        image.onerror = null
        pending.delete(cancel)
        resolve(result)
      }
      const cancel = () => {
        finish(null)
        image.removeAttribute('src')
      }
      pending.add(cancel)
      timeout = window.setTimeout(cancel, 8000)

      image.onerror = () => finish(null)
      image.onload = () => {
        if (disposed) {
          finish(null)
          return
        }

        let texture: import('three').Texture | undefined
        try {
          const width = image.naturalWidth
          const height = image.naturalHeight
          if (!width || !height) {
            finish(null)
            return
          }

          let source: HTMLImageElement | HTMLCanvasElement = image
          const scale = Math.min(1, maximumTextureSize / Math.max(width, height))
          if (scale < 1) {
            const resized = document.createElement('canvas')
            resized.width = Math.max(1, Math.round(width * scale))
            resized.height = Math.max(1, Math.round(height * scale))
            const context = resized.getContext('2d')
            if (!context) {
              finish(null)
              return
            }
            context.drawImage(image, 0, 0, resized.width, resized.height)
            source = resized
          }

          texture = new THREE.Texture(source)
          texture.colorSpace = THREE.SRGBColorSpace
          texture.minFilter = THREE.LinearMipmapLinearFilter
          texture.magFilter = THREE.LinearFilter
          texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy())
          texture.needsUpdate = true
          renderer.initTexture(texture)
          textures.set(url, texture)
          trimCache()
          finish({ texture, width, height, background: sampleImageBackground(image) })
        } catch {
          texture?.dispose()
          finish(null)
        }
      }
      image.src = url
    })
    cache.set(url, task)
    void task.then((result) => {
      if (!result && cache.get(url) === task) cache.delete(url)
    })
    return task
  }

  function setImages(current: StageImage, next: StageImage = current) {
    if (disposed) return
    uniforms.uCurrent.value = current.texture
    uniforms.uNext.value = next.texture
    uniforms.uCurrentSize.value.set(current.width, current.height)
    uniforms.uNextSize.value.set(next.width, next.height)
    touchTexture(current.texture)
    touchTexture(next.texture)
    trimCache()
  }

  function setMotion(motion: StageMotion) {
    if (disposed) return
    if (motion.transition !== undefined) uniforms.uTransition.value = clamp(motion.transition, 0, 1)
    if (motion.transitionFx !== undefined) uniforms.uTransitionFx.value = clamp(motion.transitionFx, 0, 1)
    if (motion.dragX !== undefined) uniforms.uDragX.value = clamp(motion.dragX, -0.6, 0.6)
    if (motion.direction !== undefined) uniforms.uDirection.value = motion.direction < 0 ? -1 : 1
    if (motion.hover !== undefined) uniforms.uHover.value = clamp(motion.hover, 0, 1)
    if (motion.pointerX !== undefined) uniforms.uPointer.value.x = clamp(motion.pointerX, -1, 1)
    if (motion.pointerY !== undefined) uniforms.uPointer.value.y = clamp(motion.pointerY, -1, 1)
    if (motion.reduced !== undefined) uniforms.uReduced.value = motion.reduced ? 1 : 0
  }

  function render(timeSeconds: number) {
    if (disposed || renderer.getContext().isContextLost()) return
    uniforms.uTime.value = Number.isFinite(timeSeconds) ? timeSeconds : 0
    renderer.render(scene, camera)
  }

  function dispose() {
    if (disposed) return
    disposed = true
    canvas.removeEventListener('webglcontextlost', handleContextLost)
    for (const cancel of [...pending]) cancel()
    cache.clear()
    for (const texture of textures.values()) texture.dispose()
    textures.clear()
    placeholder.dispose()
    geometry.dispose()
    material.dispose()
    scene.clear()
    renderer.dispose()
    renderer.forceContextLoss()
    canvas.remove()
  }

  function handleContextLost(event: Event) {
    event.preventDefault()
    dispose()
    onContextLost?.()
  }

  canvas.addEventListener('webglcontextlost', handleContextLost)
  resize()

  return { loadImage, setImages, setMotion, render, resize, dispose }
}
