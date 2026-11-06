<script setup lang="ts">
// The 3D layer fixed behind the whole page. A brain drawn in particles with three.js: folded cortex, cerebellum and stem, links between near neighbours, and
// "signals" travelling along the links. `.client.vue` means Nuxt only renders it in the browser (no WebGL on the server).
import * as THREE from 'three'
import { brainPoints } from '~/utils/shapes'

const host = ref<HTMLDivElement | null>(null)
const failed = ref(false)
let cleanup: (() => void) | null = null

const EMERALD = new THREE.Color('#34d399')
const GOLD = new THREE.Color('#fbbf24')

onMounted(async () => {
  // A .client.vue component mounts a placeholder first; the real template only exists after the next tick.
  await nextTick()
  const el = host.value
  if (!el) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const lightMode = window.matchMedia('(prefers-color-scheme: light)').matches
  const small = window.innerWidth < 700
  const blending = lightMode ? THREE.NormalBlending : THREE.AdditiveBlending

  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
  } catch (err) {
    console.warn('3D scene disabled: WebGL is not available', err)
    failed.value = true
    return
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  el.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
  camera.position.set(0, 0, small ? 6.2 : 5.2)

  const brain = new THREE.Group()
  const restAngle = -1.25 // near side-on, where the folds and cerebellum read best
  brain.rotation.y = restAngle
  scene.add(brain)

  // Nodes
  const count = small ? 4500 : 9000
  const nodes = brainPoints(count).map(([x, y, z]) => new THREE.Vector3(x, y, z))

  const nodePos = new Float32Array(count * 3)
  const nodeCol = new Float32Array(count * 3)
  const nodeSize = new Float32Array(count)
  nodes.forEach((p, i) => {
    nodePos.set([p.x, p.y, p.z], i * 3)
    const c = EMERALD.clone().lerp(GOLD, Math.random() < 0.1 ? 0.9 : Math.random() * 0.22)
    nodeCol.set([c.r, c.g, c.b], i * 3)
    nodeSize[i] = 0.3 + Math.random() * 0.42
  })

  const dotMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending,
    uniforms: { uScale: { value: renderer.getPixelRatio() * (small ? 36 : 44) }, uTime: { value: 0 }, uOpacity: { value: 1 } },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      uniform float uScale;
      uniform float uTime;
      void main() {
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float twinkle = 0.85 + 0.15 * sin(uTime * 2.0 + position.x * 9.0 + position.y * 7.0);
        gl_PointSize = size * twinkle * uScale / -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying vec3 vColor;
      uniform float uOpacity;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vColor, a * a * uOpacity);
      }`,
  })

  const nodeGeo = new THREE.BufferGeometry()
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3))
  nodeGeo.setAttribute('color', new THREE.BufferAttribute(nodeCol, 3))
  nodeGeo.setAttribute('size', new THREE.BufferAttribute(nodeSize, 1))
  brain.add(new THREE.Points(nodeGeo, dotMaterial))

  // Links: a subset of nodes connects to up to 2 close neighbours; linking every particle would hide the folds
  const edges: [number, number][] = []
  const linked = small ? 220 : 420
  const maxDist = small ? 0.36 : 0.3
  for (let i = 0; i < linked; i++) {
    let links = 0
    for (let j = i + 1; j < linked && links < 2; j++) {
      if (nodes[i].distanceTo(nodes[j]) < maxDist) {
        edges.push([i, j])
        links++
      }
    }
  }
  const linePos = new Float32Array(edges.length * 6)
  edges.forEach(([a, b], k) => {
    linePos.set([nodes[a].x, nodes[a].y, nodes[a].z, nodes[b].x, nodes[b].y, nodes[b].z], k * 6)
  })
  const lineGeo = new THREE.BufferGeometry()
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3))
  const lineOpacity = lightMode ? 0.28 : 0.16
  const lineMat = new THREE.LineBasicMaterial({
    color: EMERALD,
    transparent: true,
    opacity: lineOpacity,
    blending,
    depthWrite: false,
  })
  brain.add(new THREE.LineSegments(lineGeo, lineMat))

  // Signals travelling along links
  const signalCount = small ? 24 : 48
  const signals = Array.from({ length: signalCount }, () => ({
    edge: Math.floor(Math.random() * edges.length),
    t: Math.random(),
    speed: 0.4 + Math.random() * 0.8,
  }))
  const sigPos = new Float32Array(signalCount * 3)
  const sigCol = new Float32Array(signalCount * 3)
  const sigSize = new Float32Array(signalCount).fill(2.6)
  for (let i = 0; i < signalCount; i++) sigCol.set([GOLD.r, GOLD.g, GOLD.b], i * 3)
  const sigGeo = new THREE.BufferGeometry()
  sigGeo.setAttribute('position', new THREE.BufferAttribute(sigPos, 3))
  sigGeo.setAttribute('color', new THREE.BufferAttribute(sigCol, 3))
  sigGeo.setAttribute('size', new THREE.BufferAttribute(sigSize, 1))
  brain.add(new THREE.Points(sigGeo, dotMaterial))

  // Background dust
  const dustCount = small ? 200 : 420
  const dustPos = new Float32Array(dustCount * 3)
  for (let i = 0; i < dustCount; i++) {
    dustPos.set([(Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8, -2 - Math.random() * 6], i * 3)
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

  // Pointer parallax
  const target = { x: 0, y: 0 }
  const onPointer = (e: PointerEvent) => {
    target.x = (e.clientX / window.innerWidth - 0.5) * 2
    target.y = (e.clientY / window.innerHeight - 0.5) * 2
  }
  window.addEventListener('pointermove', onPointer, { passive: true })

  // Beside the hero copy on wide screens; centred, higher and dimmer behind the text on narrow ones
  const anchor = { x: 0, y: 0 }
  let baseOpacity = 1
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = el
    renderer.setSize(w, h, false)
    camera.aspect = w / Math.max(h, 1)
    camera.updateProjectionMatrix()
    const halfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z
    const wide = w >= 900
    anchor.x = wide ? halfHeight * camera.aspect * 0.46 : 0
    anchor.y = wide ? 0 : halfHeight * 0.3
    baseOpacity = wide ? 1 : 0.5
  }
  const ro = new ResizeObserver(resize)
  ro.observe(el)
  resize()
  brain.position.set(anchor.x, anchor.y, 0)

  // The scene dims once the hero scrolls away, so it never competes with the text
  let scrollDim = 1
  const onScroll = () => {
    scrollDim = 1 - 0.55 * Math.min(window.scrollY / window.innerHeight, 1)
    if (reduceMotion) render()
  }
  window.addEventListener('scroll', onScroll, { passive: true })

  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const started = performance.now()
  let last = started
  let frame = 0

  const render = () => {
    const now = performance.now()
    const dt = Math.min((now - last) / 1000, 0.05)
    const t = (now - started) / 1000
    last = now
    dotMaterial.uniforms.uTime.value = t

    brain.rotation.y = restAngle + Math.sin(t * 0.3) * 0.5 // sway rather than spin: front-on it reads as a mushroom
    brain.rotation.x += (target.y * 0.25 - brain.rotation.x) * 0.04
    brain.position.x += (anchor.x + target.x * 0.15 - brain.position.x) * 0.04
    brain.position.y += (anchor.y - brain.position.y) * 0.04
    dotMaterial.uniforms.uOpacity.value = baseOpacity * scrollDim
    lineMat.opacity = lineOpacity * baseOpacity * scrollDim
    dust.rotation.y = t * 0.01

    signals.forEach((s, i) => {
      s.t += dt * s.speed
      if (s.t >= 1) {
        s.t = 0
        s.edge = Math.floor(Math.random() * edges.length)
      }
      const [ia, ib] = edges[s.edge]
      a.copy(nodes[ia])
      b.copy(nodes[ib])
      a.lerp(b, s.t)
      sigPos.set([a.x, a.y, a.z], i * 3)
    })
    sigGeo.attributes.position.needsUpdate = true

    renderer.render(scene, camera)
  }

  const loop = () => {
    frame = requestAnimationFrame(loop)
    if (document.hidden) return
    render()
  }

  onScroll()
  if (reduceMotion) {
    signals.forEach((s) => (s.t = 0.5))
    render()
  } else {
    loop()
  }

  cleanup = () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('pointermove', onPointer)
    window.removeEventListener('scroll', onScroll)
    ro.disconnect()
    ;[nodeGeo, lineGeo, sigGeo, dustGeo].forEach((g) => g.dispose())
    ;[dotMaterial, lineMat, dustMat].forEach((m) => m.dispose())
    renderer.dispose()
    renderer.domElement.remove()
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div ref="host" class="scene" :class="{ failed }" aria-hidden="true" />
</template>

<style scoped>
.scene {
  position: fixed;
  inset: 0 0 auto;
  height: 100lvh; /* the large viewport, so a phone's address bar hiding never resizes the canvas */
  z-index: 0;
  pointer-events: none;
}

/* No WebGL: a soft static glow instead of an empty box */
.scene.failed {
  background: radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--emerald) 30%, transparent), transparent 60%);
}

.scene :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>
