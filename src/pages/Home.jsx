import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Car3DRealistic from '../components/Car3DRealistic'

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeScene, setActiveScene] = useState(0)
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
      <div className="fixed inset-0 flex flex-col justify-center pointer-events-none overflow-hidden">
        {/* 3D Car */}
        <div className="absolute inset-0 w-full h-full">
          <Car3DRealistic scene={activeScene} />
        </div>

        {/* Glass Morphism Title Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScene}
            className={`relative z-10 flex flex-col ${getPositionClasses(currentScene.position)} pointer-events-auto`}
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

      {/* Scroll Progress Indicator */}
      <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50">
        <div className="w-10 h-10 sm:w-12 sm:h-12 backdrop-blur-md bg-white/10 border border-white/20 rounded-full flex items-center justify-center">
          <span className="text-white text-xs sm:text-sm font-bold">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      </div>

      {/* Scene Dots */}
      <div className="hidden sm:flex fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 flex-col gap-2 sm:gap-3">
        {scenes.map((scene, idx) => (
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

      {/* Mobile scroll hint */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 sm:hidden">
        <motion.div
          className="text-white/50 text-xs flex flex-col items-center backdrop-blur-sm bg-white/5 px-3 py-1 rounded-full"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span>Scroll ↓</span>
        </motion.div>
      </div>
    </div>
  )
}
