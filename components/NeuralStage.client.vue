<script setup lang="ts">
// The 3D layer fixed behind the whole page: one particle cloud that morphs brain > eye > pulse > helix > lattice > brain
// as you scroll. All the morphing happens on the GPU, so a frame only updates a few uniforms.
// `.client.vue` means Nuxt renders it in the browser only (there is no WebGL on the server).
import * as THREE from 'three'
import { buildForms } from '~/utils/forms'
import { NARROW_POSES, STAGE_SECTIONS, WIDE_POSES, normaliseAnchors, poseAt, stageAt } from '~/utils/stage'

const host = ref<HTMLDivElement | null>(null)
const figure = useState('stage-figure', () => 0)
const route = useRoute()
let cleanup: (() => void) | null = null

const vertexShader = /* glsl */ `
  attribute vec3 aEye;
  attribute vec3 aPulse;
  attribute vec3 aHelix;
  attribute vec3 aLattice;
  attribute vec4 aTones; // brain, eye, pulse, helix
  attribute vec3 aMeta;  // lattice tone, seed, size

  uniform float uStage;
  uniform float uTime;
  uniform float uIntro;
  uniform float uScale;
  uniform float uOpacity;
  uniform float uMotion;
  uniform vec3 uCool;
  uniform vec3 uWarm;
  uniform vec3 uTouch; // x, y in clip space, z strength
  uniform float uAspect;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float seed = aMeta.y;

    // Each particle starts its journey at a slightly different moment, so forms dissolve instead of sliding.
    float index = floor(uStage);
    float eased = smoothstep(seed * 0.45, 0.55 + seed * 0.45, uStage - index);
    float s = index + eased;

    float wBrain = max(0.0, 1.0 - abs(s)) + max(0.0, 1.0 - abs(s - 5.0));
    float wEye = max(0.0, 1.0 - abs(s - 1.0));
    float wPulse = max(0.0, 1.0 - abs(s - 2.0));
    float wHelix = max(0.0, 1.0 - abs(s - 3.0));
    float wLattice = max(0.0, 1.0 - abs(s - 4.0));

    vec3 p = position * wBrain + aEye * wEye + aPulse * wPulse + aHelix * wHelix + aLattice * wLattice;
    float tone = dot(aTones, vec4(wBrain, wEye, wPulse, wHelix)) + aMeta.x * wLattice;

    // Mid-morph the cloud churns, then settles back exactly onto the next form.
    float churn = sin(3.14159 * eased) * uMotion;
    p += vec3(sin(p.y * 2.7 + uTime), cos(p.z * 2.3 + uTime * 0.8), sin(p.x * 2.1 - uTime * 0.9)) * 0.34 * churn;

    // On load, particles fly in from all around.
    float arrived = smoothstep(seed * 0.5, 0.5 + seed * 0.5, uIntro);
    vec3 scattered = vec3(sin(seed * 91.7), cos(seed * 47.3), sin(seed * 23.9 + 1.0)) * 6.0;
    p = mix(scattered, p, arrived);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // A travelling wave of activity, plus a burst of firing around the visitor's cursor or finger.
    float wave = uMotion * pow(0.5 + 0.5 * sin(dot(p, vec3(1.1, 0.5, 0.35)) * 2.6 - uTime * 1.5), 14.0);
    vec2 clip = gl_Position.xy / gl_Position.w;
    vec2 delta = (clip - uTouch.xy) * vec2(uAspect, 1.0);
    float fired = uTouch.z * exp(-dot(delta, delta) * 26.0);
    float energy = clamp(wave + fired, 0.0, 1.0);

    vColor = mix(uCool, uWarm, clamp(tone + energy * 0.9, 0.0, 1.0));
    float nearness = clamp((7.0 + mv.z) / 3.4, 0.25, 1.0); // the far side fades, which sells the depth
    vAlpha = (0.62 + energy * 0.38) * nearness * uOpacity;
    gl_PointSize = aMeta.z * (1.0 + energy * 0.9) * uScale / -mv.z;
  }`

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float a = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));
    gl_FragColor = vec4(vColor, a * a * vAlpha);
  }`

onMounted(async () => {
  // A .client.vue component mounts a placeholder first; the real template only exists after the next tick.
  await nextTick()
  const el = host.value
  if (!el) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const lightMode = window.matchMedia('(prefers-color-scheme: light)').matches
  const small = window.innerWidth < 700
  const blending = lightMode ? THREE.NormalBlending : THREE.AdditiveBlending
  const cool = new THREE.Color(lightMode ? '#059669' : '#34d399')
  const warm = new THREE.Color(lightMode ? '#b7791f' : '#fbbf24')

  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ antialias: !small, alpha: true })
  } catch (err) {
    console.warn('3D scene disabled: WebGL is not available', err) // the page is complete without it
    return
  }
  let pixelRatio = Math.min(window.devicePixelRatio, small ? 1.5 : 1.75)
  renderer.setPixelRatio(pixelRatio)
  el.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
  camera.position.set(0, 0, small ? 6.2 : 5.2)

  const cloud = new THREE.Group()
  scene.add(cloud)

  // Particles
  const count = small ? 5000 : 11000
  const { positions, tones } = buildForms(count)
  const [brainPos, eyePos, pulsePos, helixPos, latticePos] = positions as [
    Float32Array, Float32Array, Float32Array, Float32Array, Float32Array,
  ]
  const toneData = new Float32Array(count * 4)
  const meta = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    toneData.set([tones[0]![i]!, tones[1]![i]!, tones[2]![i]!, tones[3]![i]!], i * 4)
    meta.set([tones[4]![i]!, Math.random(), 0.3 + Math.random() * 0.42], i * 3)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(brainPos, 3))
  geometry.setAttribute('aEye', new THREE.BufferAttribute(eyePos, 3))
  geometry.setAttribute('aPulse', new THREE.BufferAttribute(pulsePos, 3))
  geometry.setAttribute('aHelix', new THREE.BufferAttribute(helixPos, 3))
  geometry.setAttribute('aLattice', new THREE.BufferAttribute(latticePos, 3))
  geometry.setAttribute('aTones', new THREE.BufferAttribute(toneData, 4))
  geometry.setAttribute('aMeta', new THREE.BufferAttribute(meta, 3))

  const pointScale = () => pixelRatio * (small ? 36 : 44)
  const uniforms = {
    uStage: { value: 0 },
    uTime: { value: 0 },
    uIntro: { value: reduceMotion ? 1 : 0 },
    uScale: { value: pointScale() },
    uOpacity: { value: 1 },
    uMotion: { value: reduceMotion ? 0 : 1 },
    uCool: { value: cool },
    uWarm: { value: warm },
    uTouch: { value: new THREE.Vector3(0, 0, 0) },
    uAspect: { value: 1 },
  }
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending,
    uniforms,
    vertexShader,
    fragmentShader,
  })
  const points = new THREE.Points(geometry, material)
  points.frustumCulled = false // the shader moves every particle, so the stored bounds mean nothing
  cloud.add(points)

  // Synapses belong to the brain form only: a subset of particles linked to close neighbours
  const linked = small ? 220 : 420
  const nodeAt = (i: number) => new THREE.Vector3().fromArray(brainPos, i * 3)
  const edges: [THREE.Vector3, THREE.Vector3][] = []
  for (let i = 0; i < linked; i++) {
    let links = 0
    for (let j = i + 1; j < linked && links < 2; j++) {
      if (nodeAt(i).distanceTo(nodeAt(j)) < (small ? 0.36 : 0.3)) {
        edges.push([nodeAt(i), nodeAt(j)])
        links++
      }
    }
  }
  const linePos = new Float32Array(edges.length * 6)
  edges.forEach(([a, b], k) => linePos.set([a.x, a.y, a.z, b.x, b.y, b.z], k * 6))
  const lineGeo = new THREE.BufferGeometry()
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3))
  const lineOpacity = lightMode ? 0.28 : 0.16
  const lineMat = new THREE.LineBasicMaterial({ color: cool, transparent: true, opacity: lineOpacity, blending, depthWrite: false })
  const lines = new THREE.LineSegments(lineGeo, lineMat)
  cloud.add(lines)

  // Signals travelling along the synapses
  const signalCount = small ? 24 : 48
  const signals = Array.from({ length: signalCount }, () => ({
    edge: Math.floor(Math.random() * edges.length),
    t: reduceMotion ? 0.5 : Math.random(),
    speed: 0.4 + Math.random() * 0.8,
  }))
  const sigPos = new Float32Array(signalCount * 3)
  const sigGeo = new THREE.BufferGeometry()
  sigGeo.setAttribute('position', new THREE.BufferAttribute(sigPos, 3))
  const sigMat = new THREE.PointsMaterial({ color: warm, size: 0.035, transparent: true, blending, depthWrite: false })
  const sparks = new THREE.Points(sigGeo, sigMat)
  sparks.frustumCulled = false
  cloud.add(sparks)

  // Background dust
  const dustCount = small ? 200 : 420
  const dustPos = new Float32Array(dustCount * 3)
  for (let i = 0; i < dustCount; i++) {
    dustPos.set([(Math.random() - 0.5) * 14, (Math.random() - 0.5) * 10, -2 - Math.random() * 6], i * 3)
  }
  const dustGeo = new THREE.BufferGeometry()
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
  const dustMat = new THREE.PointsMaterial({
    color: lightMode ? 0x059669 : 0x9bb3a8,
    size: 0.02,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
  })
  const dust = new THREE.Points(dustGeo, dustMat)
  scene.add(dust)

  // Pointer: tilts the cloud and fires neurons under the cursor or finger
  const pointer = { x: 0, y: 0 }
  const touch = uniforms.uTouch.value
  const onPointer = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth - 0.5) * 2
    pointer.y = (e.clientY / window.innerHeight - 0.5) * 2
    touch.set(pointer.x, -pointer.y, 1)
  }
  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('pointerdown', onPointer, { passive: true })

  // Size and layout
  let halfHeight = 1
  let halfWidth = 1
  let poses = WIDE_POSES
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = el
    renderer.setSize(w, h, false)
    camera.aspect = w / Math.max(h, 1)
    camera.updateProjectionMatrix()
    uniforms.uAspect.value = camera.aspect
    halfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z
    halfWidth = halfHeight * camera.aspect
    poses = w >= 900 ? WIDE_POSES : NARROW_POSES
  }
  const ro = new ResizeObserver(resize)
  ro.observe(el)
  resize()

  // Scroll: where each form completes, measured from the real page so the morph follows any layout
  let anchors: number[] = []
  const measure = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const raw = STAGE_SECTIONS.map((id, i) => {
      if (i === 0) return 0
      const section = document.getElementById(id)
      return section ? section.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.3 : maxScroll
    })
    anchors = normaliseAnchors(raw, maxScroll)
  }
  const pageObserver = new ResizeObserver(measure)
  pageObserver.observe(document.documentElement)
  measure()

  let stage = stageAt(window.scrollY, anchors)
  const started = performance.now()
  let last = started
  let frame = 0
  let lost = false
  let slowFrames = 0
  const spot = new THREE.Vector3()

  const render = () => {
    const now = performance.now()
    const dt = Math.min((now - last) / 1000, 0.05)
    const t = (now - started) / 1000
    last = now

    // Phones and old laptops: drop the resolution once rather than stutter
    slowFrames = now - started > 3000 && dt > 0.034 ? slowFrames + 1 : Math.max(0, slowFrames - 1)
    if (slowFrames > 40 && pixelRatio > 1) {
      pixelRatio = 1
      renderer.setPixelRatio(1)
      uniforms.uScale.value = pointScale()
      resize()
    }

    const targetStage = stageAt(window.scrollY, anchors)
    stage = reduceMotion ? targetStage : stage + (targetStage - stage) * (1 - Math.exp(-dt * 6))
    figure.value = Math.round(stage)

    const pose = poseAt(poses, stage)
    const sway = reduceMotion ? 0 : Math.sin(t * 0.3) * pose.sway
    cloud.scale.setScalar(pose.scale)
    cloud.rotation.set(pointer.y * 0.2, pose.rotY + sway + pointer.x * 0.15, pose.rotZ)
    cloud.position.set(pose.x * halfWidth + pointer.x * 0.1, pose.y * halfHeight, 0)
    dust.rotation.y = t * 0.01
    dust.position.y = window.scrollY * 0.0005

    // Keep the About section readable while the hero's bright brain is still in place
    const scrolled = Math.min(window.scrollY / window.innerHeight, 1)
    const early = 1 - 0.45 * scrolled * Math.max(0, 1 - stage)
    const opacity = pose.opacity * early * (route.path === '/' ? 1 : 0.28)

    uniforms.uStage.value = stage
    uniforms.uTime.value = t
    uniforms.uOpacity.value = opacity
    if (!reduceMotion) {
      uniforms.uIntro.value = Math.min(1, t / 2.4)
      touch.z *= Math.exp(-dt * 2.4)
    }

    // Synapses and signals only exist at rest on the brain
    const onBrain = Math.max(0, 1 - Math.min(stage, 5 - stage) * 5) * uniforms.uIntro.value ** 3
    lines.visible = sparks.visible = onBrain > 0.01
    if (lines.visible) {
      lineMat.opacity = lineOpacity * opacity * onBrain
      sigMat.opacity = opacity * onBrain
      signals.forEach((s, i) => {
        s.t += reduceMotion ? 0 : dt * s.speed
        if (s.t >= 1) {
          s.t = 0
          s.edge = Math.floor(Math.random() * edges.length)
        }
        const [a, b] = edges[s.edge]!
        spot.copy(a).lerp(b, s.t)
        sigPos.set([spot.x, spot.y, spot.z], i * 3)
      })
      sigGeo.attributes.position!.needsUpdate = true
    }

    renderer.render(scene, camera)
  }

  const loop = () => {
    frame = requestAnimationFrame(loop)
    if (!document.hidden && !lost) render()
  }

  const onScroll = () => render()
  if (reduceMotion) {
    window.addEventListener('scroll', onScroll, { passive: true })
    render()
  } else {
    loop()
  }

  const canvas = renderer.domElement
  const onLost = (e: Event) => {
    e.preventDefault()
    lost = true
  }
  const onRestored = () => (lost = false)
  canvas.addEventListener('webglcontextlost', onLost)
  canvas.addEventListener('webglcontextrestored', onRestored)

  cleanup = () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('pointermove', onPointer)
    window.removeEventListener('pointerdown', onPointer)
    window.removeEventListener('scroll', onScroll)
    canvas.removeEventListener('webglcontextlost', onLost)
    canvas.removeEventListener('webglcontextrestored', onRestored)
    ro.disconnect()
    pageObserver.disconnect()
    ;[geometry, lineGeo, sigGeo, dustGeo].forEach((g) => g.dispose())
    ;[material, lineMat, sigMat, dustMat].forEach((m) => m.dispose())
    renderer.dispose()
    canvas.remove()
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div ref="host" class="scene" aria-hidden="true" />
</template>

<style scoped>
.scene {
  position: fixed;
  inset: 0 0 auto;
  height: 100lvh; /* the large viewport, so a phone's address bar hiding never resizes the canvas */
  z-index: 0;
  pointer-events: none;
}

.scene :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>
