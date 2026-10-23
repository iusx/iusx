import{E as q,D as K}from"./kUUhfQIq.js";const Q=`
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Z=`
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
`;async function ee(y,S){if(typeof window>"u")throw new Error("The design stage requires a browser.");const a=await q(()=>import("./DbmfBPKn.js"),[],import.meta.url);if(!y.isConnected)throw new Error("The design stage was removed before it could initialize.");const s=new a.WebGLRenderer({antialias:!1,alpha:!1,depth:!1,stencil:!1,powerPreference:"high-performance"});s.outputColorSpace=a.SRGBColorSpace,s.setClearColor(329222,1);const v=s.domElement;v.setAttribute("aria-hidden","true"),v.style.cssText="display:block;width:100%;height:100%;pointer-events:none;",y.appendChild(v);const w=new a.DataTexture(new Uint8Array([5,6,6,255]),1,1);w.colorSpace=a.SRGBColorSpace,w.needsUpdate=!0;const r={uCurrent:{value:w},uNext:{value:w},uViewport:{value:new a.Vector2(1,1)},uCurrentSize:{value:new a.Vector2(1,1)},uNextSize:{value:new a.Vector2(1,1)},uPointer:{value:new a.Vector2(0,0)},uTime:{value:0},uTransition:{value:0},uTransitionFx:{value:0},uDragX:{value:0},uDirection:{value:1},uHover:{value:0},uReduced:{value:0}},z=new a.ShaderMaterial({uniforms:r,vertexShader:Q,fragmentShader:Z,depthTest:!1,depthWrite:!1,toneMapped:!1}),U=new a.PlaneGeometry(2,2),G=new a.Mesh(U,z),T=new a.Scene,F=new a.OrthographicCamera(-1,1,1,-1,0,2);F.position.z=1,T.add(G);const f=new Map,u=new Map,M=new Set,j=Math.min(s.capabilities.maxTextureSize,4096);let c=!1,p=!0,k,A=0,P=0,V=0;const h=(e,t,o)=>Math.min(o,Math.max(t,e));function E(){for(const[e,t]of u){if(u.size<=5)break;t===r.uCurrent.value||t===r.uNext.value||(u.delete(e),f.delete(e),t.dispose())}}function C(e){for(const[t,o]of u)if(o===e){u.delete(t),u.set(t,e);return}}function X(){if(c)return;const e=y.getBoundingClientRect(),t=Math.max(1,Math.round(e.width)),o=Math.max(1,Math.round(e.height)),l=window.matchMedia("(pointer: coarse)").matches||t<768,i=Math.min(window.devicePixelRatio||1,l?1.5:1.75);t===A&&o===P&&i===V||(A=t,P=o,V=i,s.setDrawingBufferSize(t,o,i),r.uViewport.value.set(t,o),p=!0)}function W(e){if(c||!e)return Promise.resolve(null);const t=f.get(e);if(t){const l=u.get(e);return l&&C(l),t}const o=new Promise(l=>{const i=new Image;i.crossOrigin="anonymous",i.decoding="async";let _=!1,I;const d=n=>{_||(_=!0,window.clearTimeout(I),i.onload=null,i.onerror=null,M.delete(R),l(n))},R=()=>{d(null),i.removeAttribute("src")};M.add(R),I=window.setTimeout(R,8e3),i.onerror=()=>d(null),i.onload=()=>{if(c){d(null);return}let n;try{const x=i.naturalWidth,b=i.naturalHeight;if(!x||!b){d(null);return}let B=i;const D=Math.min(1,j/Math.max(x,b));if(D<1){const g=document.createElement("canvas");g.width=Math.max(1,Math.round(x*D)),g.height=Math.max(1,Math.round(b*D));const L=g.getContext("2d");if(!L){d(null);return}L.drawImage(i,0,0,g.width,g.height),B=g}n=new a.Texture(B),n.colorSpace=a.SRGBColorSpace,n.minFilter=a.LinearMipmapLinearFilter,n.magFilter=a.LinearFilter,n.anisotropy=Math.min(4,s.capabilities.getMaxAnisotropy()),n.needsUpdate=!0,s.initTexture(n),u.set(e,n),E(),d({texture:n,width:x,height:b,background:K(i)})}catch{n==null||n.dispose(),d(null)}},i.src=e});return f.set(e,o),o.then(l=>{!l&&f.get(e)===o&&f.delete(e)}),o}function J(e,t=e){c||(r.uCurrent.value=e.texture,r.uNext.value=t.texture,r.uCurrentSize.value.set(e.width,e.height),r.uNextSize.value.set(t.width,t.height),C(e.texture),C(t.texture),E(),p=!0)}function m(e,t){e.value!==t&&(e.value=t,p=!0)}function O(e){if(c)return;e.transition!==void 0&&m(r.uTransition,h(e.transition,0,1)),e.transitionFx!==void 0&&m(r.uTransitionFx,h(e.transitionFx,0,1)),e.dragX!==void 0&&m(r.uDragX,h(e.dragX,-.6,.6)),e.direction!==void 0&&m(r.uDirection,e.direction<0?-1:1),e.hover!==void 0&&m(r.uHover,h(e.hover,0,1));const t=e.pointerX===void 0?r.uPointer.value.x:h(e.pointerX,-1,1),o=e.pointerY===void 0?r.uPointer.value.y:h(e.pointerY,-1,1);(t!==r.uPointer.value.x||o!==r.uPointer.value.y)&&(r.uPointer.value.set(t,o),p=!0),e.reduced!==void 0&&m(r.uReduced,e.reduced?1:0)}function Y(e){if(c||s.getContext().isContextLost())return;const t=Number.isFinite(e)?e:0,o=Math.floor(Math.fround(t)*16),l=r.uHover.value<.999&&r.uReduced.value===0;!p&&(!l||o===k)||(r.uTime.value=t,s.render(T,F),k=o,p=!1)}function H(){if(!c){c=!0,v.removeEventListener("webglcontextlost",N);for(const e of[...M])e();f.clear();for(const e of u.values())e.dispose();u.clear(),w.dispose(),U.dispose(),z.dispose(),T.clear(),s.dispose(),s.forceContextLoss(),v.remove()}}function N(e){e.preventDefault(),H(),S==null||S()}return v.addEventListener("webglcontextlost",N),X(),{loadImage:W,setImages:J,setMotion:O,render:Y,resize:X,dispose:H}}export{ee as createDesignStage};
