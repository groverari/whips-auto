import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

export default function Car3DRealistic({ scene: sceneIndex = 0 }) {
  const mountRef = useRef(null)
  const sceneIndexRef = useRef(sceneIndex)
  const prevSceneRef = useRef(sceneIndex)
  const currentCamPosRef = useRef(new THREE.Vector3(6, 3, 6))
  const currentTargetRef = useRef(new THREE.Vector3(0, 0.5, 0))
  const transitionPhaseRef = useRef('idle') // 'idle', 'pullback', 'moveto'
  const pullbackProgressRef = useRef(0)

  // Camera positions for each scene
  const cameraSettings = {
    0: { pos: [5, 2, 5], target: [0, 0.3, 0] },       // Full car view
    1: { pos: [3, 1.5, 2], target: [1, 0.5, 0] },     // Front/engine area
    2: { pos: [-3, 1, 2.5], target: [-1, 0.3, 0.5] }, // Wheel area
    3: { pos: [-4, 2, -3], target: [0, 0.3, 0] },     // Back/rear view
  }

  // Neutral "pulled back" position for transitions
  const pullbackPos = new THREE.Vector3(0, 4, 8)
  const pullbackTarget = new THREE.Vector3(0, 0, 0)

  // Update ref when prop changes and trigger transition
  useEffect(() => {
    if (sceneIndex !== prevSceneRef.current) {
      transitionPhaseRef.current = 'pullback'
      pullbackProgressRef.current = 0
      prevSceneRef.current = sceneIndex
    }
    sceneIndexRef.current = sceneIndex
  }, [sceneIndex])

  useEffect(() => {
    if (!mountRef.current) return

    const container = mountRef.current
    const w = container.clientWidth || window.innerWidth
    const h = container.clientHeight || window.innerHeight

    // Detect mobile
    const isMobile = window.innerWidth < 768

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: !isMobile, 
      alpha: true,
      powerPreference: isMobile ? 'default' : 'high-performance'
    })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    const threeScene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100)
    const initialSettings = cameraSettings[0]
    camera.position.set(...initialSettings.pos)
    currentCamPosRef.current.set(...initialSettings.pos)
    currentTargetRef.current.set(...initialSettings.target)
    camera.lookAt(currentTargetRef.current)

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
      color: 0x1a1a1a,
      roughness: 0.15,
      metalness: 0.8,
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = 0
    ground.receiveShadow = true
    threeScene.add(ground)

    let carModel = null

    // Load HDRI
    const rgbeLoader = new RGBELoader()
    rgbeLoader.load('/hdri/studio.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      threeScene.environment = texture
      threeScene.background = new THREE.Color(0x111111)
    }, undefined, (error) => {
      console.error('Error loading HDRI:', error)
      threeScene.background = new THREE.Color(0x111111)
    })

    // Load car model
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

    const gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(dracoLoader)

    gltfLoader.load(
      '/models/ferrari.glb',
      (gltf) => {
        carModel = gltf.scene
        
        const box = new THREE.Box3().setFromObject(carModel)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 4 / maxDim
        carModel.scale.setScalar(scale)
        
        carModel.position.x = -center.x * scale
        carModel.position.z = -center.z * scale
        carModel.position.y = 0

        carModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
            if (child.material) {
              child.material.envMapIntensity = 1.5
            }
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

    // Animation loop with smooth pullback transitions
    let animationFrameId
    const lerpSpeed = 0.04
    const pullbackSpeed = 0.06

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      const currentScene = Math.min(sceneIndexRef.current, 3)
      const settings = cameraSettings[currentScene]
      const finalTargetPos = new THREE.Vector3(...settings.pos)
      const finalTargetLookAt = new THREE.Vector3(...settings.target)

      if (transitionPhaseRef.current === 'pullback') {
        // Phase 1: Pull back to neutral position
        currentCamPosRef.current.lerp(pullbackPos, pullbackSpeed)
        currentTargetRef.current.lerp(pullbackTarget, pullbackSpeed)
        
        pullbackProgressRef.current += pullbackSpeed
        
        // Check if we've pulled back enough
        if (pullbackProgressRef.current > 0.5) {
          transitionPhaseRef.current = 'moveto'
        }
      } else if (transitionPhaseRef.current === 'moveto') {
        // Phase 2: Move to target position
        currentCamPosRef.current.lerp(finalTargetPos, lerpSpeed)
        currentTargetRef.current.lerp(finalTargetLookAt, lerpSpeed)
        
        // Check if we've arrived
        if (currentCamPosRef.current.distanceTo(finalTargetPos) < 0.1) {
          transitionPhaseRef.current = 'idle'
        }
      } else {
        // Idle: just maintain position (small adjustments)
        currentCamPosRef.current.lerp(finalTargetPos, lerpSpeed)
        currentTargetRef.current.lerp(finalTargetLookAt, lerpSpeed)
      }

      camera.position.copy(currentCamPosRef.current)
      camera.lookAt(currentTargetRef.current)

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
      dracoLoader.dispose()
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
