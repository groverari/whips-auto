import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'

export default function Car3DRealistic({ scene: _sceneIndex = 0, scrollProgress = 0, heroMode = false }) {
  const mountRef = useRef(null)
  const scrollProgressRef = useRef(scrollProgress)
  const [loading, setLoading] = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)

  const isMobileView = typeof window !== 'undefined' && window.innerWidth < 768
  const mobScale = isMobileView ? 2 : 1

  const cameraKeyframes = [
    { angle: 210, height: 1, dist: 3.5 * mobScale, target: [0, 0.4, 0] },
    { angle: 300, height: 2, dist: 5.5 * mobScale, target: [0, 0.3, 0] },
    { angle: 30,  height: 1.5, dist: 4 * mobScale, target: [0, 0.3, 0] },
    { angle: 120, height: 2, dist: 5 * mobScale, target: [0, 0.3, 0] },
  ]

  useEffect(() => {
    scrollProgressRef.current = scrollProgress
  }, [scrollProgress])

  useEffect(() => {
    if (!mountRef.current) return

    const container = mountRef.current
    const w = container.clientWidth || window.innerWidth
    const h = container.clientHeight || window.innerHeight
    const isMobile = window.innerWidth < 768

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: isMobile ? 'default' : 'high-performance'
      })
    } catch (e) {
      console.warn('WebGL not available:', e.message)
      container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#888;font-size:1.2rem;">3D view requires WebGL</div>'
      return
    }
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    const threeScene = new THREE.Scene()
    threeScene.background = new THREE.Color(0x0B0B0F)

    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100)
    const initAngle = cameraKeyframes[0].angle * Math.PI / 180
    camera.position.set(
      Math.sin(initAngle) * cameraKeyframes[0].dist,
      cameraKeyframes[0].height,
      Math.cos(initAngle) * cameraKeyframes[0].dist
    )
    camera.lookAt(new THREE.Vector3(...cameraKeyframes[0].target))

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    threeScene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5)
    mainLight.position.set(10, 15, 10)
    mainLight.castShadow = true
    mainLight.shadow.mapSize.width = 2048
    mainLight.shadow.mapSize.height = 2048
    mainLight.shadow.camera.near = 0.5
    mainLight.shadow.camera.far = 50
    mainLight.shadow.camera.left = -10
    mainLight.shadow.camera.right = 10
    mainLight.shadow.camera.top = 10
    mainLight.shadow.camera.bottom = -10
    threeScene.add(mainLight)

    const fillLight = new THREE.DirectionalLight(0x8899ff, 0.3)
    fillLight.position.set(-5, 5, -5)
    threeScene.add(fillLight)

    // Subtle warm accent light for gold tones
    const accentLight = new THREE.PointLight(0xD4A843, 0.3, 20)
    accentLight.position.set(-3, 2, 3)
    threeScene.add(accentLight)

    // Ground — black reflective showroom floor
    const groundGeometry = new THREE.PlaneGeometry(100, 100)
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.15,
      metalness: 0.8,
      envMapIntensity: 0.6,
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = 0
    ground.receiveShadow = true
    threeScene.add(ground)

    let carModel = null

    // Load HDRI
    const hdrLoader = new HDRLoader()
    hdrLoader.load('/hdri/studio.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      threeScene.environment = texture
      threeScene.background = new THREE.Color(0x0B0B0F)
    })

    // Load car model
    const gltfLoader = new GLTFLoader()
    gltfLoader.load(
      '/models/free_porsche_911_carrera_4s.glb',
      (gltf) => {
        carModel = gltf.scene

        const box = new THREE.Box3().setFromObject(carModel)
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 4 / maxDim
        carModel.scale.multiplyScalar(scale)

        const scaledBox = new THREE.Box3().setFromObject(carModel)
        const center = scaledBox.getCenter(new THREE.Vector3())
        carModel.position.x = -center.x
        carModel.position.z = -center.z
        carModel.position.y = -scaledBox.min.y

        carModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((mat) => {
                  mat.envMapIntensity = 1.5
                })
              } else {
                child.material.envMapIntensity = 1.5
              }
            }
          }
        })

        threeScene.add(carModel)
        setLoading(false)
      },
      (xhr) => {
        if (xhr.total) setLoadProgress(Math.round((xhr.loaded / xhr.total) * 100))
      },
      (error) => {
        console.error('Error loading car:', error)
        setLoading(false)
      }
    )

    const handleResize = () => {
      const newW = container.clientWidth || window.innerWidth
      const newH = container.clientHeight || window.innerHeight
      renderer.setSize(newW, newH)
      camera.aspect = newW / newH
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', handleResize)

    // Animation
    let animationFrameId
    let currentAngle = cameraKeyframes[0].angle * Math.PI / 180
    let currentHeight = cameraKeyframes[0].height
    let currentDist = cameraKeyframes[0].dist
    const currentTarget = new THREE.Vector3(...cameraKeyframes[0].target)
    const startTime = Date.now()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      if (heroMode) {
        // Slow auto-rotation for hero section
        const elapsed = (Date.now() - startTime) * 0.00008
        const angle = (210 * Math.PI / 180) + elapsed * Math.PI * 2
        const height = 1.2 + Math.sin(elapsed * 0.5) * 0.15
        const dist = (isMobile ? 7 : 4.2)

        camera.position.set(
          Math.sin(angle) * dist,
          height,
          Math.cos(angle) * dist
        )
        camera.lookAt(new THREE.Vector3(0, 0.35, 0))
      } else {
        // Scroll-based camera movement
        const t = scrollProgressRef.current * (cameraKeyframes.length - 1)
        const idx = Math.min(Math.floor(t), cameraKeyframes.length - 2)
        const frac = t - idx

        const from = cameraKeyframes[idx]
        const to = cameraKeyframes[idx + 1]

        const fromAngle = from.angle * Math.PI / 180
        const toAngle = to.angle * Math.PI / 180
        let angleDiff = toAngle - fromAngle
        while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI
        while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI
        const goalAngle = fromAngle + angleDiff * frac

        const goalHeight = from.height + (to.height - from.height) * frac
        const goalDist = from.dist + (to.dist - from.dist) * frac
        const goalTarget = new THREE.Vector3().lerpVectors(
          new THREE.Vector3(...from.target),
          new THREE.Vector3(...to.target),
          frac
        )

        let angleDelta = goalAngle - currentAngle
        while (angleDelta > Math.PI) angleDelta -= 2 * Math.PI
        while (angleDelta < -Math.PI) angleDelta += 2 * Math.PI
        currentAngle += angleDelta * 0.08
        currentHeight += (goalHeight - currentHeight) * 0.08
        currentDist += (goalDist - currentDist) * 0.08
        currentTarget.lerp(goalTarget, 0.08)

        camera.position.set(
          Math.sin(currentAngle) * currentDist,
          currentHeight,
          Math.cos(currentAngle) * currentDist
        )
        camera.lookAt(currentTarget)
      }

      renderer.render(threeScene, camera)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <>
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0B0B0F',
            zIndex: 10,
            transition: 'opacity 0.6s ease',
          }}
        >
          <div style={{
            width: 48,
            height: 48,
            border: '3px solid rgba(212,168,67,0.15)',
            borderTop: '3px solid #D4A843',
            borderRadius: '50%',
            animation: 'spin 0.9s linear infinite',
            marginBottom: 20,
          }} />
          <div style={{
            width: 160,
            height: 3,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 2,
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${loadProgress}%`,
              height: '100%',
              background: '#D4A843',
              borderRadius: 2,
              transition: 'width 0.3s ease',
            }} />
          </div>
          <span style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: 12,
            letterSpacing: '0.15em',
            marginTop: 10,
            fontFamily: 'inherit',
          }}>
            {loadProgress > 0 ? `${loadProgress}%` : 'Loading'}
          </span>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}
    </>
  )
}
