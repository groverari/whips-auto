import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Car3DRealistic from '../components/Car3DRealistic'
import CarFallback from '../components/CarFallback'

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) return false
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      // Software renderers = no hardware acceleration
      if (/SwiftShader|llvmpipe|softpipe/i.test(renderer)) return false
    }
    return true
  } catch {
    return false
  }
}

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeScene, setActiveScene] = useState(0)
  const [webglSupported] = useState(() => hasWebGL())
  const containerRef = useRef(null)
  const navigate = useNavigate()

  // Scenes with position info
  const scenes = [
    {
      id: 0,
      title: 'WHIPS AUTO',
      subtitle: 'Premium Auto Repair & Maintenance',
      cta: 'Explore Services',
      position: 'center', // Hero centered
    },
    {
      id: 1,
      title: 'Engine Services',
      subtitle: 'Complete engine diagnostics, oil changes, and repairs',
      cta: 'Learn More',
      position: 'left',
    },
    {
      id: 2,
      title: 'Tire & Wheel Services',
      subtitle: 'Rotation, balancing, and premium tire installation',
      cta: 'View Options',
      position: 'right',
    },
    {
      id: 3,
      title: 'Get in Touch',
      subtitle: 'Ready to service your vehicle? Contact us today.',
      cta: 'Contact Us',
      position: 'left',
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(scrollTop / docHeight, 1)
      
      setScrollProgress(progress)
      const sceneIndex = Math.min(Math.floor(progress * 4), 3)
      setActiveScene(sceneIndex)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const currentScene = scenes[activeScene]

  const handleCTA = () => {
    if (activeScene === 3) {
      navigate('/contact')
    } else {
      navigate('/services')
    }
  }

  // Position classes based on scene
  const getPositionClasses = (position) => {
    switch (position) {
      case 'left':
        return 'items-start text-left pl-6 sm:pl-12 md:pl-20'
      case 'right':
        return 'items-end text-right pr-6 sm:pr-12 md:pr-20'
      default: // center
        return 'items-center text-center px-4'
    }
  }

  return (
    <div ref={containerRef} className="relative touch-pan-y">
      {/* Fixed Black Background */}
      <div className="fixed inset-0 bg-black -z-10" />

      {/* Fixed Hero Content */}
      <div className="fixed inset-0 flex flex-col justify-end sm:justify-center pointer-events-none overflow-hidden">
        {/* 3D Car or Fallback Image */}
        <div className="absolute inset-0 w-full h-full">
          {webglSupported ? (
            <Car3DRealistic scene={activeScene} scrollProgress={scrollProgress} />
          ) : (
            <CarFallback scene={activeScene} />
          )}
        </div>

        {/* Dark vignette for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

        {/* Glass Morphism Title Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScene}
            className={`relative z-10 flex flex-col pb-28 sm:pb-0 ${getPositionClasses(currentScene.position)} pointer-events-auto`}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Glass Card */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl max-w-lg">
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4 tracking-tight">
                {currentScene.title}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-white/80 mb-4 sm:mb-6">
                {currentScene.subtitle}
              </p>
              <motion.button
                onClick={handleCTA}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 sm:px-8 sm:py-3 bg-white text-black font-bold rounded-lg hover:bg-yellow-400 transition shadow-lg text-sm sm:text-base"
              >
                {currentScene.cta}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scroll Spacer */}
      <div className="h-[400vh]" />

      {/* Up/Down Scroll Arrows */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
        {activeScene > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              const targetProgress = (activeScene - 1) / scenes.length
              const docHeight = document.documentElement.scrollHeight - window.innerHeight
              window.scrollTo({ top: targetProgress * docHeight, behavior: 'smooth' })
            }}
            className="w-10 h-10 sm:w-12 sm:h-12 backdrop-blur-md bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </motion.button>
        )}
        {activeScene < scenes.length - 1 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              const targetProgress = (activeScene + 1) / scenes.length
              const docHeight = document.documentElement.scrollHeight - window.innerHeight
              window.scrollTo({ top: targetProgress * docHeight, behavior: 'smooth' })
            }}
            className="w-10 h-10 sm:w-12 sm:h-12 backdrop-blur-md bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
            whileAnimate={{ y: [0, 4, 0] }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
        )}
      </div>

      {/* Scene Dots */}
      <div className="hidden sm:flex fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 flex-col gap-2 sm:gap-3">
        {scenes.map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 border border-white/30 ${
              idx === activeScene 
                ? 'bg-white scale-125' 
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>

    </div>
  )
}
