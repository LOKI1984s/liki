/*
 * 홈 인트로 — WebGL 3D 씬
 * - ∞ 모양 중심선 위에 반 바퀴 꼬인 띠(뫼비우스 인피니티)
 * - 띠 표면을 따라 끝없이 흐르는 GPU 파티클 + 하나로 이어진 네온 가장자리
 * - 커서 반발, 클릭 시 충격파
 * - 첫 진입: 한 점(0)에서 터져 ∞로 자리 잡음 / 메뉴에 반응 / 페이지 이동 시 다시 0으로 빨려 들어감
 * 수정 후 `npm run build` → js/intro.bundle.js 생성
 */
import {
  WebGLRenderer, Scene, PerspectiveCamera, ShaderMaterial, Mesh, BufferGeometry, BufferAttribute,
  Points, AdditiveBlending, DoubleSide, Vector2, Vector3, Color, Clock, Raycaster, Plane, Group,
  TubeGeometry, CatmullRomCurve3,
} from "three";

// Ashima 3D simplex noise (MIT)
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const canvas = document.getElementById("gl");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

function supported() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch { return false; }
}


// ∞ 중심선과 꼬인 띠 — GLSL/JS 공용 수식
const SIZE = 2.35;   // ∞ 가로 반폭
const DEPTH = 0.42;  // 교차점에서 띠가 서로 뚫지 않게 주는 앞뒤 간격
const WIDTH = 0.5;   // 띠 반폭

const MOBIUS = /* glsl */ `
const float SIZE = ${SIZE.toFixed(3)};
const float DEPTH = ${DEPTH.toFixed(3)};
vec3 centerline(float t){
  float s = sin(t), c = cos(t), k = 1.0 / (1.0 + s * s);
  return vec3(SIZE * c * k, SIZE * s * c * k * 1.25, DEPTH * s);
}
// 반 바퀴 꼬인 띠 위의 점: t(0..4π 한 바퀴=2π), v(-1..1 폭 방향)
vec3 ribbon(float t, float v, float w, out vec3 nrm){
  vec3 p = centerline(t);
  vec3 T = normalize(centerline(t + 0.01) - centerline(t - 0.01));
  vec3 N = normalize(vec3(0.0, 0.0, 1.0) - T * T.z);
  vec3 B = cross(T, N);
  float h = 0.5 * t;
  vec3 D = cos(h) * N + sin(h) * B;
  nrm = -sin(h) * N + cos(h) * B;
  return p + D * v * w;
}`;

function centerlineJS(t) {
  const s = Math.sin(t), c = Math.cos(t), k = 1 / (1 + s * s);
  return new Vector3(SIZE * c * k, SIZE * s * c * k * 1.25, DEPTH * s);
}
function ribbonJS(t, v) {
  const p = centerlineJS(t);
  const T = centerlineJS(t + 0.01).sub(centerlineJS(t - 0.01)).normalize();
  const N = new Vector3(0, 0, 1).addScaledVector(T, -T.z).normalize();
  const B = new Vector3().crossVectors(T, N);
  const h = 0.5 * t;
  const D = N.multiplyScalar(Math.cos(h)).addScaledVector(B, Math.sin(h));
  return p.addScaledVector(D, v * WIDTH);
}

function init() {
  const css = getComputedStyle(document.documentElement);
  const A = new Color(css.getPropertyValue("--accent").trim() || "#c6f432");
  const B = new Color(css.getPropertyValue("--accent-2").trim() || "#5ee0c1");
  const mobile = innerWidth < 720;

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new Scene();
  const camera = new PerspectiveCamera(40, 1, 0.1, 100);
  const world = new Group();   // 위치·마우스 기울기
  const shape = new Group();   // 모양 자체의 느린 회전
  world.add(shape);
  scene.add(world);

  const U = {
    uTime: { value: 0 },
    uFlow: { value: 0 },     // 흐름 누적값 (메뉴에 따라 속도 변함)
    uRunT: { value: 0 },     // 가장자리 빛 흐름 누적값
    uIntro: { value: 1 },    // 0 → 1: 한 점에서 ∞로
    uOut: { value: 0 },      // 0 → 1: ∞에서 한 점으로 (페이지 이동)
    uShow: { value: 1 },     // 네온·표면·먼지 가시도
    uSpread: { value: 0 }, uBright: { value: 0 }, uHue: { value: 0 },
    uPulse: { value: -10 },
    uMouse: { value: new Vector3(99, 99, 0) },
    uA: { value: A }, uB: { value: B },
    uPx: { value: renderer.getPixelRatio() },
    uW: { value: WIDTH },
  };

  // 공통: 커서 반발 + 클릭 충격파 (월드 좌표)
  const DISTORT = /* glsl */ `
    uniform float uTime, uPulse; uniform vec3 uMouse;
    vec3 distort(vec3 wp, out float glow){
      vec3 dir = wp - uMouse; float dm = length(dir);
      float push = exp(-dm * dm * 1.6);
      wp += normalize(dir + 1e-4) * 0.7 * push;
      float k = uTime - uPulse;
      float wave = exp(-pow(length(wp) - k * 5.0, 2.0) * 3.0) * exp(-k * 0.9) * step(0.0, k);
      wp += normalize(wp + 1e-4) * wave * 0.6;
      glow = wave + push * 0.8;
      return wp;
    }`;

  /* ---- 1. 흐르는 파티클 띠 ---- */
  const N = mobile ? 9000 : 18000;
  const aT = new Float32Array(N), aV = new Float32Array(N), aS = new Float32Array(N), aR = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    aT[i] = Math.random() * Math.PI * 4;
    const e = Math.random();
    // 가장자리 쪽이 더 촘촘하게 (샘플의 반짝이는 테두리 느낌)
    const v = e < 0.45 ? (Math.random() * 2 - 1) : Math.sign(Math.random() - 0.5) * (1 - Math.pow(Math.random(), 2.2) * 0.35);
    aV[i] = v;
    aS[i] = 0.12 + Math.random() * 0.22;
    aR[i] = Math.random();
  }
  const pg = new BufferGeometry();
  pg.setAttribute("position", new BufferAttribute(new Float32Array(N * 3), 3)); // 셰이더에서 계산
  pg.setAttribute("aT", new BufferAttribute(aT, 1));
  pg.setAttribute("aV", new BufferAttribute(aV, 1));
  pg.setAttribute("aS", new BufferAttribute(aS, 1));
  pg.setAttribute("aR", new BufferAttribute(aR, 1));
  const flowMat = new ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: AdditiveBlending,
    vertexShader: NOISE + MOBIUS + DISTORT + /* glsl */ `
      uniform float uPx, uW, uFlow, uIntro, uOut, uSpread;
      attribute float aT, aV, aS, aR;
      varying float vR, vG, vH, vTw;
      void main(){
        float t = mod(aT + uFlow * aS, 12.566371);
        vec3 nrm;
        vec3 p = ribbon(t, aV, uW, nrm);
        // 띠 표면에서 살짝 흩어지는 가루
        float n = snoise(vec3(t * 2.0, aV * 3.0, uTime * 0.3 + aR * 10.0));
        p += nrm * n * 0.05 + nrm * (aR - 0.5) * 0.06 * step(0.85, aR);
        p += nrm * (aR - 0.5) * uSpread + nrm * n * uSpread * 0.4;

        // 0 → ∞ : 한 점에서 터져 나와 제자리로
        vec3 rd = normalize(vec3(sin(aR * 78.233 + aT * 12.9898), cos(aR * 45.164 + aT * 3.7), sin(aR * 91.7 + aT * 7.1)) + 1e-4);
        float k = clamp(uIntro * 1.6 - aR * 0.6, 0.0, 1.0);
        float e = 1.0 - pow(1.0 - k, 3.0);
        float burst = sin(k * 3.14159);
        p = mix(rd * 0.03, p, e) + rd * burst * (0.8 + aR * 1.2);

        // ∞ → 0 : 소용돌이치며 한 점으로
        float o = clamp(uOut * 1.35 - aR * 0.35, 0.0, 1.0);
        float oe = o * o;
        float sw = oe * 4.0;
        p.xy = mat2(cos(sw), -sin(sw), sin(sw), cos(sw)) * p.xy;
        p = mix(p, vec3(0.0), oe);

        vec4 wp = modelMatrix * vec4(p, 1.0);
        float g;
        wp.xyz = distort(wp.xyz, g);
        vG = g + burst * 0.5 + oe * 0.6; vR = aR;
        vH = 0.5 + 0.5 * sin(t);                         // 루프 따라 색 그라데이션
        vTw = 0.55 + 0.45 * sin(uTime * (2.0 + aR * 5.0) + aR * 60.0); // 반짝임
        vec4 mv = viewMatrix * wp;
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (0.8 + aR * 1.8 + g * 2.5) * uPx * (7.0 / -mv.z);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uA, uB; uniform float uBright, uHue;
      varying float vR, vG, vH, vTw;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        float m = smoothstep(0.5, 0.05, d);
        vec3 c = mix(mix(uB, uA, vH), uB, uHue * 0.85);
        c = mix(c, vec3(1.0), step(0.96, vR) * 0.8 + vG * 0.4 + uBright * 0.25);
        gl_FragColor = vec4(c, (m * (0.25 + 0.55 * vTw) + vG * 0.4) * (1.0 + uBright * 0.9));
      }`,
  });
  shape.add(new Points(pg, flowMat));

  /* ---- 2. 네온 가장자리 (뫼비우스라 가장자리가 하나로 이어짐: t 0..4π) ---- */
  const edgePts = [];
  for (let i = 0; i < 480; i++) edgePts.push(ribbonJS((i / 480) * Math.PI * 4, 1));
  const edgeCurve = new CatmullRomCurve3(edgePts, true);
  const neon = (radius, alpha, core) => new ShaderMaterial({
    uniforms: { ...U, uAlpha: { value: alpha }, uCore: { value: core } },
    transparent: true, depthWrite: false, blending: AdditiveBlending,
    vertexShader: /* glsl */ `
      varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){
        vUv = uv;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uA, uB; uniform float uRunT, uAlpha, uCore, uShow, uHue, uBright;
      varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){
        float t = vUv.x * 12.566371;
        vec3 c = mix(mix(uB, uA, 0.5 + 0.5 * sin(t)), uB, uHue * 0.85);
        float facing = abs(dot(normalize(vN), vV));
        float body = mix(pow(1.0 - facing, 1.5), pow(facing, 2.0), uCore);
        // 가장자리를 따라 흐르는 빛
        float run = pow(0.5 + 0.5 * sin(vUv.x * 62.83 - uRunT * 2.2), 8.0);
        vec3 col = mix(c, vec3(1.0), uCore * 0.35 + run * 0.35);
        gl_FragColor = vec4(col, (body * (0.7 + run * 0.8)) * uAlpha * uShow * (1.0 + uBright * 0.6));
      }`,
  });
  shape.add(new Mesh(new TubeGeometry(edgeCurve, 960, 0.011, 6, true), neon(0.011, 1.0, 1.0)));  // 심
  shape.add(new Mesh(new TubeGeometry(edgeCurve, 480, 0.055, 8, true), neon(0.055, 0.35, 0.0))); // 번짐

  /* ---- 3. 띠 표면 (아주 옅게, 형태만) ---- */
  {
    const SU = 400, SV = 8, pos = [], idx = [], uv = [];
    for (let i = 0; i <= SU; i++) for (let j = 0; j <= SV; j++) {
      const t = (i / SU) * Math.PI * 2, v = (j / SV) * 2 - 1;
      const p = ribbonJS(t, v);
      pos.push(p.x, p.y, p.z); uv.push(i / SU, j / SV);
    }
    for (let i = 0; i < SU; i++) for (let j = 0; j < SV; j++) {
      const a = i * (SV + 1) + j, b = a + SV + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute("uv", new BufferAttribute(new Float32Array(uv), 2));
    g.setIndex(idx); g.computeVertexNormals();
    shape.add(new Mesh(g, new ShaderMaterial({
      uniforms: U, transparent: true, depthWrite: false, blending: AdditiveBlending, side: DoubleSide,
      vertexShader: /* glsl */ `
        varying vec3 vN; varying vec3 vV; varying vec2 vUv;
        void main(){
          vUv = uv;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uA, uB; uniform float uRunT, uShow, uHue;
        varying vec3 vN; varying vec3 vV; varying vec2 vUv;
        void main(){
          float f = pow(1.0 - abs(dot(normalize(vN), vV)), 2.0);
          vec3 c = mix(mix(uB, uA, 0.5 + 0.5 * sin(vUv.x * 6.2831)), uB, uHue * 0.85);
          float lines = smoothstep(0.92, 1.0, sin(vUv.x * 400.0 - uRunT * 3.0) * 0.5 + 0.5) * 0.5;
          gl_FragColor = vec4(c, (0.035 + f * 0.12 + lines * 0.05) * uShow);
        }`,
    })));
  }

  /* ---- 4. 배경 먼지 ---- */
  {
    const M = mobile ? 900 : 1800, p = new Float32Array(M * 3), r = new Float32Array(M);
    for (let i = 0; i < M; i++) {
      p.set([(Math.random() - 0.5) * 16, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 8 - 1], i * 3);
      r[i] = Math.random();
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(p, 3));
    g.setAttribute("aR", new BufferAttribute(r, 1));
    world.add(new Points(g, new ShaderMaterial({
      uniforms: U, transparent: true, depthWrite: false, blending: AdditiveBlending,
      vertexShader: /* glsl */ `
        uniform float uTime, uPx; attribute float aR; varying float vR;
        void main(){
          vec3 p = position; p.y += sin(uTime * 0.2 + aR * 20.0) * 0.15;
          vR = aR;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (0.6 + aR * 1.2) * uPx * (6.0 / -mv.z);
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uA, uB; uniform float uShow; varying float vR;
        void main(){
          float m = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));
          gl_FragColor = vec4(mix(uB, uA, vR), m * 0.35 * (0.25 + 0.75 * uShow));
        }`,
    })));
  }

  /* ---- Interaction ---- */
  const mouse = new Vector2(0, 0), target = new Vector2(0, 0);
  const ray = new Raycaster(), plane = new Plane(new Vector3(0, 0, 1), 0), hit = new Vector3();
  let hasMouse = false;
  addEventListener("pointermove", (e) => {
    target.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    hasMouse = true;
  }, { passive: true });
  addEventListener("pointerleave", () => { hasMouse = false; });
  addEventListener("pointerdown", (e) => {
    if (e.target.closest("a,button")) return;
    U.uPulse.value = U.uTime.value;
  });

  /* ---- 메뉴 반응 ---- */
  const BASE = { speed: 1, spread: 0, run: 0, bright: 0, hue: 0 };
  const MODES = {
    models: { bright: 1, speed: 1.6 },         // 밝아짐
    history: { speed: 0.3, spread: 0.35 },     // 느려지며 흩어짐
    partners: { hue: 1, speed: 0.8 },          // 민트로 물듦
    skills: { speed: 2.8 },                    // 빨라짐
    contact: { run: 1, speed: 1.3 },           // 가장자리 빛이 빠르게 흐름
  };
  const cur = { ...BASE };
  let goal = { ...BASE };
  const setMode = (key) => { goal = { ...BASE, ...(MODES[key] || {}) }; };
  const keyOf = (a) => a.dataset.key || "";
  document.querySelectorAll("a[data-key]").forEach((a) => {
    a.addEventListener("pointerenter", () => setMode(keyOf(a)));
    a.addEventListener("focus", () => setMode(keyOf(a)));
    a.addEventListener("pointerleave", () => setMode(null));
    a.addEventListener("blur", () => setMode(null));
  });

  /* ---- 0 → ∞ 첫 진입 (세션당 한 번) ---- */
  let introStart = -1;
  let seen = false;
  try { seen = sessionStorage.getItem("zi-intro") === "1"; sessionStorage.setItem("zi-intro", "1"); } catch {}
  if (!reduce && !seen) { U.uIntro.value = 0; introStart = 0; }

  /* ---- ∞ → 0 페이지 이동 ---- */
  let outStart = -1;
  addEventListener("zi:leave", (e) => {
    setMode(e.detail?.key);
    outStart = U.uTime.value;
  });
  addEventListener("pageshow", (e) => {
    if (!e.persisted) return;
    outStart = -1; U.uOut.value = 0; setMode(null);
  });

  /* ---- Layout ---- */
  let wide = true;
  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    wide = w > 900;
    camera.position.set(0, 0, wide ? 9 : 12.5);
    camera.updateProjectionMatrix();
    place();
  }
  function place() {
    const w = innerWidth, h = innerHeight;
    if (wide) {
      world.position.set(3.0, 0, 0);
      world.scale.setScalar(0.86);
    } else {
      // 좁은 화면: 실제 제목(.intro-name) 오른쪽 빈칸에 가로 ∞를 맞춰 넣는다
      const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
      const upp = (2 * halfH) / h; // 화면 1px당 월드 단위
      const t = document.querySelector(".intro-name");
      const r = t?.getBoundingClientRect();
      // 제목 칸은 가로 전체라서, 글자 자체의 오른쪽 끝을 Range로 잰다
      let textR = w * 0.45;
      if (t) {
        const rg = document.createRange();
        const ends = [];
        const walk = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
        for (let n = walk.nextNode(); n; n = walk.nextNode()) { rg.selectNodeContents(n); ends.push(rg.getBoundingClientRect().right); }
        if (ends.length) textR = Math.max(...ends);
      }
      // 태블릿처럼 글 영역 오른쪽이 넉넉하면 그 빈 공간 전체에, 휴대폰은 제목 오른쪽에 넣는다
      const col = document.querySelector(".intro-text")?.getBoundingClientRect();
      const side = col && w - col.right - 32 >= 200;
      const left = side ? col.right + 24 : textR + 20, right = w - 16;
      const cx = (left + right) / 2;
      const cy = side ? col.top + col.height * 0.42 : r ? r.top + r.height / 2 : h * 0.22;
      const EXT_W = SIZE + WIDTH + 0.2, EXT_H = 1.7; // 회전 · 띠 폭을 감안한 ∞ 반폭 · 반높이 (월드 단위)
      const maxHpx = side ? col.height * 0.85 : Math.min(r ? r.height * 1.35 : 120, 150);
      // 옆 공간(세로로 긴 영역)은 8자로 세우고, 제목 옆(가로로 긴 영역)은 눕힌다
      const [ew, eh] = side ? [EXT_H, EXT_W] : [EXT_W, EXT_H];
      const s = Math.min(((right - left) / 2) * upp / ew, (maxHpx / 2) * upp / eh);
      world.position.set((cx - w / 2) * upp, -(cy - h / 2) * upp, 0);
      world.scale.setScalar(Math.max(s, 0.12));
      world.rotation.z = side ? Math.PI / 2 : 0;
      return;
    }
    world.rotation.z = 0;
  }
  addEventListener("resize", resize);
  resize();
  // 글꼴 로딩 · 제목 스크램블이 끝나면 제목 폭이 확정되므로 다시 맞춘다
  document.fonts?.ready.then(resize);
  setTimeout(resize, 1800);
  // 스크롤해도 제목을 따라가도록 (좁은 화면은 인트로가 화면보다 길 수 있음)
  addEventListener("scroll", () => { if (!wide) place(); }, { passive: true });

  /* ---- Loop ---- */
  const clock = new Clock();
  let running = true, fpsT = 0, frames = 0;
  const fpsEl = document.getElementById("hud-fps");
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) { clock.getDelta(); requestAnimationFrame(tick); }
  });

  function tick() {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const T = (U.uTime.value += reduce ? dt * 0.15 : dt);
    mouse.lerp(target, 0.06);

    const ease = 1 - Math.exp(-dt * 4);
    for (const k in cur) cur[k] += (goal[k] - cur[k]) * ease;
    const slow = reduce ? 0.15 : 1;
    U.uFlow.value += dt * cur.speed * slow;
    U.uRunT.value += dt * (1 + cur.run * 2.5) * slow;
    U.uSpread.value = cur.spread; U.uBright.value = cur.bright; U.uHue.value = cur.hue;

    if (introStart >= 0) U.uIntro.value = Math.min(1, (T - introStart) / 2.6);
    if (outStart >= 0) U.uOut.value = Math.min(1, (T - outStart) / 0.65);
    const sIn = Math.min(1, Math.max(0, (U.uIntro.value - 0.55) / 0.45));
    U.uShow.value = sIn * sIn * (3 - 2 * sIn) * (1 - U.uOut.value);

    ray.setFromCamera(mouse, camera);
    if (hasMouse && ray.ray.intersectPlane(plane, hit)) U.uMouse.value.lerp(hit, 0.2);
    else U.uMouse.value.set(99, 99, 0);

    // 천천히 흔들리며 돌아 ∞ ↔ 8 ↔ 꼬임이 번갈아 보이게
    shape.rotation.y = Math.sin(T * 0.13) * 0.55 + mouse.x * 0.3;
    shape.rotation.x = 0.32 + Math.sin(T * 0.09) * 0.22 - mouse.y * 0.25;
    camera.position.x = mouse.x * 0.35;
    camera.position.y = mouse.y * 0.25;
    if (wide) camera.lookAt(world.position.x * 0.5, world.position.y * 0.5, 0);
    else camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);

    frames++; fpsT += dt;
    if (fpsEl && fpsT > 0.5) { fpsEl.textContent = Math.round(frames / fpsT); frames = 0; fpsT = 0; }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  document.body.classList.add("gl-ready");
  const pc = document.getElementById("hud-n");
  if (pc) pc.textContent = N.toLocaleString("en-US");
}

if (canvas && supported()) init();
else document.body.classList.add("no-gl");
