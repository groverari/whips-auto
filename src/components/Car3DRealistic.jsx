import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'

export default function Car3DRealistic({ scene: sceneIndex = 0, scrollProgress = 0 }) {
  const mountRef = useRef(null)
  const scrollProgressRef = useRef(scrollProgress)

  // Camera orbits around the car center — defined as angle (degrees), height, distance
  // This ensures the camera always rotates around the car and never flies through it
  // On mobile (portrait), pull camera back so the car isn't clipped on the sides
  const isMobileView = typeof window !== 'undefined' && window.innerWidth < 768
  const mobScale = isMobileView ? 2 : 1
  const cameraKeyframes = [
    { angle: 210, height: 1, dist: 3.5 * mobScale, target: [0, 0.4, 0] },   // Scene 0: Front
    { angle: 300, height: 2, dist: 5.5 * mobScale, target: [0, 0.3, 0] },   // Scene 1: Right side
    { angle: 30,  height: 1.5, dist: 4 * mobScale, target: [0, 0.3, 0] },   // Scene 2: Left/rear wheels
    { angle: 120, height: 2, dist: 5 * mobScale, target: [0, 0.3, 0] },     // Scene 3: Rear view
  ]

  // Update ref when prop changes
  useEffect(() => {
    scrollProgressRef.current = scrollProgress
  }, [scrollProgress])

  useEffect(() => {
    if (!mountRef.current) return

    const container = mountRef.current
    const w = container.clientWidth || window.innerWidth
    const h = container.clientHeight || window.innerHeight

    // Detect mobile
    const isMobile = window.innerWidth < 768

    // Renderer setup
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: isMobile ? 'default' : 'high-performance'
      })
    } catch (e) {
      console.warn('WebGL not available:', e.message)
      container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#888;font-size:1.2rem;">3D view requires WebGL — enable hardware acceleration in browser settings</div>'
      return
    }
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    container.appendChild(renderer.domElement)

    const threeScene = new THREE.Scene()

    // Camera
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

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100)
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.6,
      metalness: 0.5,
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = 0
    ground.receiveShadow = true
    threeScene.add(ground)

    let carModel = null

    // Set background immediately so it's never white
    threeScene.background = new THREE.Color(0x000000)

    // Load HDRI
    const hdrLoader = new HDRLoader()
    hdrLoader.load('/hdri/studio.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      threeScene.environment = texture
      threeScene.background = new THREE.Color(0x000000)
    }, undefined, (error) => {
      console.error('Error loading EXR:', error)
    })

    // Load car model
    const gltfLoader = new GLTFLoader()

    gltfLoader.load(
      '/models/porsche.glb',
      (gltf) => {
        carModel = gltf.scene

        // Scale to fit scene
        const box = new THREE.Box3().setFromObject(carModel)
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 4 / maxDim
        carModel.scale.multiplyScalar(scale)

        // Recompute bounds after scale and center on ground
        const scaledBox = new THREE.Box3().setFromObject(carModel)
        const center = scaledBox.getCenter(new THREE.Vector3())
        carModel.position.x = -center.x
        carModel.position.z = -center.z
        carModel.position.y = -scaledBox.min.y // sit on ground

        // Materials
        const blackMat = new THREE.MeshStandardMaterial({
          color: 0x111111, metalness: 0.1, roughness: 0.85,
        })
        const redMat = new THREE.MeshStandardMaterial({
          color: 0xcc0000, metalness: 0.15, roughness: 0.55, envMapIntensity: 0.8,
        })

        const blackParts = new Set([
          'part_002', 'part_003',
          'part_021', 'part_022', 'part_023', 'part_024',
          'part_025', 'part_026', 'part_027', 'part_028',
        ])

        carModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
            child.material = blackParts.has(child.name) ? blackMat : redMat
          }
        })

        threeScene.add(carModel)
      },
      undefined,
      (error) => console.error('Error loading car:', error)
    )

    // Handle resize
    const handleResize = () => {
      const newW = container.clientWidth || window.innerWidth
      const newH = container.clientHeight || window.innerHeight
      renderer.setSize(newW, newH)
      camera.aspect = newW / newH
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', handleResize)

    // Animation loop — camera orbits around car based on scroll
    let animationFrameId
    let currentAngle = cameraKeyframes[0].angle * Math.PI / 180
    let currentHeight = cameraKeyframes[0].height
    let currentDist = cameraKeyframes[0].dist
    const currentTarget = new THREE.Vector3(...cameraKeyframes[0].target)

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      // Map scroll progress (0-1) to keyframe interpolation
      const t = scrollProgressRef.current * (cameraKeyframes.length - 1)
      const idx = Math.min(Math.floor(t), cameraKeyframes.length - 2)
      const frac = t - idx

      const from = cameraKeyframes[idx]
      const to = cameraKeyframes[idx + 1]

      // Interpolate angle (in radians), taking shortest path
      const fromAngle = from.angle * Math.PI / 180
      const toAngle = to.angle * Math.PI / 180
      let angleDiff = toAngle - fromAngle
      // Shortest rotation path
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

      // Smooth follow (shortest path for angle)
      let angleDelta = goalAngle - currentAngle
      while (angleDelta > Math.PI) angleDelta -= 2 * Math.PI
      while (angleDelta < -Math.PI) angleDelta += 2 * Math.PI
      currentAngle += angleDelta * 0.08
      currentHeight += (goalHeight - currentHeight) * 0.08
      currentDist += (goalDist - currentDist) * 0.08
      currentTarget.lerp(goalTarget, 0.08)

      // Convert polar to cartesian
      camera.position.set(
        Math.sin(currentAngle) * currentDist,
        currentHeight,
        Math.cos(currentAngle) * currentDist
      )
      camera.lookAt(currentTarget)

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
  )
}
