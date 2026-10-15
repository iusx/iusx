import{E as G,D as j}from"./Cn4-I7cB.js";const J=`
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,O=`
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
`;async function q(w,b){if(typeof window>"u")throw new Error("The design stage requires a browser.");const r=await G(()=>import("./DbmfBPKn.js"),[],import.meta.url);if(!w.isConnected)throw new Error("The design stage was removed before it could initialize.");const n=new r.WebGLRenderer({antialias:!1,alpha:!1,depth:!1,stencil:!1,powerPreference:"high-performance"});n.outputColorSpace=r.SRGBColorSpace,n.setClearColor(329222,1);const d=n.domElement;d.setAttribute("aria-hidden","true"),d.style.cssText="display:block;width:100%;height:100%;pointer-events:none;",w.appendChild(d);const m=new r.DataTexture(new Uint8Array([5,6,6,255]),1,1);m.colorSpace=r.SRGBColorSpace,m.needsUpdate=!0;const o={uCurrent:{value:m},uNext:{value:m},uViewport:{value:new r.Vector2(1,1)},uCurrentSize:{value:new r.Vector2(1,1)},uNextSize:{value:new r.Vector2(1,1)},uPointer:{value:new r.Vector2(0,0)},uTime:{value:0},uTransition:{value:0},uTransitionFx:{value:0},uDragX:{value:0},uDirection:{value:1},uHover:{value:0},uReduced:{value:0}},z=new r.ShaderMaterial({uniforms:o,vertexShader:J,fragmentShader:O,depthTest:!1,depthWrite:!1,toneMapped:!1}),D=new r.PlaneGeometry(2,2),X=new r.Mesh(D,z),S=new r.Scene,R=new r.OrthographicCamera(-1,1,1,-1,0,2);R.position.z=1,S.add(X);const f=new Map,l=new Map,T=new Set,_=Math.min(n.capabilities.maxTextureSize,4096);let u=!1;const p=(e,t,s)=>Math.min(s,Math.max(t,e));function U(){for(const[e,t]of l){if(l.size<=5)break;t===o.uCurrent.value||t===o.uNext.value||(l.delete(e),f.delete(e),t.dispose())}}function y(e){for(const[t,s]of l)if(s===e){l.delete(t),l.set(t,e);return}}function F(){if(u)return;const e=w.getBoundingClientRect(),t=Math.max(1,Math.round(e.width)),s=Math.max(1,Math.round(e.height)),c=window.matchMedia("(pointer: coarse)").matches||t<768;n.setPixelRatio(Math.min(window.devicePixelRatio||1,c?1.5:1.75)),n.setSize(t,s,!1),o.uViewport.value.set(t,s)}function H(e){if(u||!e)return Promise.resolve(null);const t=f.get(e);if(t){const c=l.get(e);return c&&y(c),t}const s=new Promise(c=>{const i=new Image;i.crossOrigin="anonymous",i.decoding="async";let P=!1,V;const v=a=>{P||(P=!0,window.clearTimeout(V),i.onload=null,i.onerror=null,T.delete(M),c(a))},M=()=>{v(null),i.removeAttribute("src")};T.add(M),V=window.setTimeout(M,8e3),i.onerror=()=>v(null),i.onload=()=>{if(u){v(null);return}let a;try{const g=i.naturalWidth,x=i.naturalHeight;if(!g||!x){v(null);return}let E=i;const C=Math.min(1,_/Math.max(g,x));if(C<1){const h=document.createElement("canvas");h.width=Math.max(1,Math.round(g*C)),h.height=Math.max(1,Math.round(x*C));const N=h.getContext("2d");if(!N){v(null);return}N.drawImage(i,0,0,h.width,h.height),E=h}a=new r.Texture(E),a.colorSpace=r.SRGBColorSpace,a.minFilter=r.LinearMipmapLinearFilter,a.magFilter=r.LinearFilter,a.anisotropy=Math.min(4,n.capabilities.getMaxAnisotropy()),a.needsUpdate=!0,n.initTexture(a),l.set(e,a),U(),v({texture:a,width:g,height:x,background:j(i)})}catch{a==null||a.dispose(),v(null)}},i.src=e});return f.set(e,s),s.then(c=>{!c&&f.get(e)===s&&f.delete(e)}),s}function I(e,t=e){u||(o.uCurrent.value=e.texture,o.uNext.value=t.texture,o.uCurrentSize.value.set(e.width,e.height),o.uNextSize.value.set(t.width,t.height),y(e.texture),y(t.texture),U())}function L(e){u||(e.transition!==void 0&&(o.uTransition.value=p(e.transition,0,1)),e.transitionFx!==void 0&&(o.uTransitionFx.value=p(e.transitionFx,0,1)),e.dragX!==void 0&&(o.uDragX.value=p(e.dragX,-.6,.6)),e.direction!==void 0&&(o.uDirection.value=e.direction<0?-1:1),e.hover!==void 0&&(o.uHover.value=p(e.hover,0,1)),e.pointerX!==void 0&&(o.uPointer.value.x=p(e.pointerX,-1,1)),e.pointerY!==void 0&&(o.uPointer.value.y=p(e.pointerY,-1,1)),e.reduced!==void 0&&(o.uReduced.value=e.reduced?1:0))}function B(e){u||n.getContext().isContextLost()||(o.uTime.value=Number.isFinite(e)?e:0,n.render(S,R))}function k(){if(!u){u=!0,d.removeEventListener("webglcontextlost",A);for(const e of[...T])e();f.clear();for(const e of l.values())e.dispose();l.clear(),m.dispose(),D.dispose(),z.dispose(),S.clear(),n.dispose(),n.forceContextLoss(),d.remove()}}function A(e){e.preventDefault(),k(),b==null||b()}return d.addEventListener("webglcontextlost",A),F(),{loadImage:H,setImages:I,setMotion:L,render:B,resize:F,dispose:k}}export{q as createDesignStage};
