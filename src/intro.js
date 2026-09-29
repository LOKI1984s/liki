/*
 * 홈 인트로 — WebGL 3D 씬
 * - 노이즈로 일렁이는 코어(GLSL 버텍스 변위 + 프레넬 림)
 * - 궤도를 도는 GPU 파티클 필드: 커서 반발, 클릭 시 충격파
 * 수정 후 `npm run build` → js/intro.bundle.js 생성
 */
import {
  WebGLRenderer, Scene, PerspectiveCamera, IcosahedronGeometry, ShaderMaterial, Mesh,
  BufferGeometry, BufferAttribute, Points, AdditiveBlending, Vector2, Vector3, Color, Clock,
  Raycaster, Plane, Group, LineSegments, EdgesGeometry, LineBasicMaterial,
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

if (canvas && supported()) init();
else document.body.classList.add("no-gl");

function init() {
  const css = getComputedStyle(document.documentElement);
  const A = new Color(css.getPropertyValue("--accent").trim() || "#c6f432");
  const B = new Color(css.getPropertyValue("--accent-2").trim() || "#5ee0c1");

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new Scene();
  const camera = new PerspectiveCamera(40, 1, 0.1, 100);
  const world = new Group();
  scene.add(world);

  const U = {
    uTime: { value: 0 },
    uPulse: { value: -10 },
    uMouse: { value: new Vector3(99, 99, 0) },
    uHover: { value: 0 },
    uA: { value: A }, uB: { value: B },
    uPx: { value: renderer.getPixelRatio() },
  };

  /* ---- Core ---- */
  const coreMat = new ShaderMaterial({
    uniforms: U,
    vertexShader: NOISE + /* glsl */ `
      uniform float uTime, uPulse, uHover;
      varying vec3 vN; varying vec3 vV; varying float vD;
      void main(){
        vec3 p = position;
        float k = uTime - uPulse;
        float pulse = exp(-k * 3.0) * step(0.0, k);
        float d = snoise(p * 1.1 + vec3(0.0, uTime * 0.25, uTime * 0.12)) * (0.22 + uHover * 0.12)
                + snoise(p * 3.2 - uTime * 0.4) * 0.05
                + pulse * 0.35 * snoise(p * 4.0 + uTime);
        p += normal * d;
        vD = d;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uA, uB; uniform float uHover;
      varying vec3 vN; varying vec3 vV; varying float vD;
      void main(){
        float f = pow(1.0 - max(dot(normalize(vN), vV), 0.0), 2.4);
        vec3 base = vec3(0.02, 0.025, 0.03);
        vec3 glow = mix(uB, uA, smoothstep(-0.2, 0.3, vD));
        vec3 col = base + glow * (f * (1.1 + uHover * 0.6)) + glow * smoothstep(0.1, 0.35, vD) * 0.25;
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const core = new Mesh(new IcosahedronGeometry(1, 64), coreMat);
  world.add(core);

  // 와이어 케이지
  const cage = new LineSegments(
    new EdgesGeometry(new IcosahedronGeometry(1.55, 1)),
    new LineBasicMaterial({ color: A, transparent: true, opacity: 0.08 })
  );
  world.add(cage);

  /* ---- Particles ---- */
  const N = innerWidth < 720 ? 4500 : 9000;
  const pos = new Float32Array(N * 3);
  const rnd = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2;
    const band = Math.random() < 0.35; // 일부는 원반형 궤도
    const r = band ? 2.0 + Math.random() * 2.4 : 1.35 + Math.pow(Math.random(), 1.6) * 3.6;
    const s = Math.sqrt(1 - u * u);
    const y = band ? (Math.random() - 0.5) * 0.18 : u * r;
    pos.set([Math.cos(th) * s * r * (band ? 1 / s : 1), y, Math.sin(th) * s * r * (band ? 1 / s : 1)], i * 3);
    rnd[i] = Math.random();
  }
  const pg = new BufferGeometry();
  pg.setAttribute("position", new BufferAttribute(pos, 3));
  pg.setAttribute("aR", new BufferAttribute(rnd, 1));
  const pMat = new ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: AdditiveBlending,
    vertexShader: NOISE + /* glsl */ `
      uniform float uTime, uPulse, uPx; uniform vec3 uMouse;
      attribute float aR; varying float vR; varying float vE;
      void main(){
        vec3 p = position;
        float r = length(p.xz);
        float a = uTime * (0.35 / (0.6 + r * 0.5)) * (0.6 + aR * 0.8);
        p.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * p.xz;
        p += 0.18 * vec3(snoise(p * 0.6 + uTime * 0.15), snoise(p * 0.6 + 7.1 + uTime * 0.15), snoise(p * 0.6 + 13.7));
        vec4 wp = modelMatrix * vec4(p, 1.0);
        vec3 dir = wp.xyz - uMouse;
        float dm = length(dir);
        wp.xyz += normalize(dir) * 0.9 * exp(-dm * dm * 1.4);
        float k = uTime - uPulse;
        float wave = exp(-pow(length(wp.xyz) - k * 5.0, 2.0) * 3.0) * exp(-k * 0.9) * step(0.0, k);
        wp.xyz += normalize(wp.xyz) * wave * 0.8;
        vE = wave + exp(-dm * dm * 1.4) * 0.8;
        vR = aR;
        vec4 mv = viewMatrix * wp;
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (1.2 + aR * 2.2 + vE * 3.0) * uPx * (6.0 / -mv.z);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uA, uB; varying float vR; varying float vE;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        float m = smoothstep(0.5, 0.0, d);
        vec3 c = mix(uB, uA, vR);
        c = mix(c, vec3(1.0), step(0.93, vR) * 0.7 + vE * 0.5);
        gl_FragColor = vec4(c, m * (0.35 + vR * 0.45 + vE));
      }`,
  });
  const points = new Points(pg, pMat);
  points.rotation.set(0.42, 0, 0.18); // 원반 궤도를 비스듬히
  world.add(points);

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

  /* ---- Layout ---- */
  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const wide = w > 900;
    camera.position.set(0, 0, wide ? 9 : 12.5);
    camera.updateProjectionMatrix();
    world.position.set(wide ? 2.4 : 0, wide ? 0 : 2.3, 0);
    world.scale.setScalar(wide ? 1 : 0.85);
  }
  addEventListener("resize", resize);
  resize();

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
    U.uTime.value += reduce ? dt * 0.15 : dt;
    mouse.lerp(target, 0.06);

    ray.setFromCamera(mouse, camera);
    if (hasMouse && ray.ray.intersectPlane(plane, hit)) U.uMouse.value.lerp(hit, 0.2);
    else U.uMouse.value.set(99, 99, 0);
    const dCore = hasMouse ? hit.distanceTo(world.position) : 99;
    U.uHover.value += ((dCore < 1.6 ? 1 : 0) - U.uHover.value) * 0.08;

    world.rotation.y += dt * 0.06;
    world.rotation.x = mouse.y * 0.25;
    world.rotation.z = -mouse.x * 0.08;
    cage.rotation.y -= dt * 0.12;
    cage.rotation.x += dt * 0.05;
    camera.position.x = mouse.x * 0.4;
    camera.position.y = mouse.y * 0.3;
    camera.lookAt(world.position.x * 0.5, world.position.y * 0.5, 0);

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
