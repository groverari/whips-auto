import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Car3D from '../components/Car3D'

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeScene, setActiveScene] = useState(0)
  const navigate = useNavigate()

  // Scenes: 0 = full car, 1 = engine, 2 = wheel, 3 = back
  const scenes = [
    {
      id: 0,
      title: 'WHIPS AUTO',
      subtitle: 'Premium Auto Repair & Maintenance',
      image: '🚗',
      cta: 'Explore Services',
      color: 'from-blue-600 to-blue-900',
    },
    {
      id: 1,
      title: 'Engine Services',
      subtitle: 'Complete engine diagnostics, oil changes, and repairs',
      image: '⚙️',
      cta: 'Learn More',
      color: 'from-orange-600 to-red-900',
    },
    {
      id: 2,
      title: 'Tire & Wheel Services',
      subtitle: 'Rotation, balancing, and premium tire installation',
      image: '🛞',
      cta: 'View Options',
      color: 'from-gray-600 to-gray-900',
    },
    {
      id: 3,
      title: 'Get in Touch',
      subtitle: 'Ready to service your vehicle? Contact us today.',
      image: '📞',
      cta: 'Contact Us',
      color: 'from-green-600 to-green-900',
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY / scrollHeight
      setScrollProgress(scrolled)

      // Calculate which scene we're in based on scroll progress
      const sceneIndex = Math.floor(scrolled * scenes.length)
      setActiveScene(Math.min(sceneIndex, scenes.length - 1))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const currentScene = scenes[activeScene]

  const handleCTA = () => {
    if (activeScene === 0) {
      navigate('/services')
    } else if (activeScene === 1 || activeScene === 2) {
      navigate('/services')
    } else if (activeScene === 3) {
      navigate('/contact')
    }
  }

  return (
    <div className="w-full">
      {/* Fixed Background with Scene */}
      <div className={`fixed inset-0 bg-gradient-to-b ${currentScene.color} transition-all duration-500 -z-10`} />

      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center text-white relative overflow-hidden pt-20">
        <div className="absolute inset-0 opacity-30 flex items-center justify-center">
          <Car3D scene={activeScene} />
        </div>

        <motion.div
          className="text-center z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-4 tracking-tight">
            {currentScene.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            {currentScene.subtitle}
          </p>
          <motion.button
            onClick={handleCTA}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-yellow-400 transition"
          >
            {currentScene.cta}
          </motion.button>
        </motion.div>
      </section>

      {/* Scroll Spacer - creates tall scrollable area */}
      <div className="h-[300vh]" />

      {/* Scroll Indicator */}
      <div className="fixed bottom-8 right-8 text-white z-40">
        <motion.div
          className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center"
          animate={{ y: scrollProgress * 10 }}
        >
          <span className="text-xs font-bold">{Math.round(scrollProgress * 100)}%</span>
        </motion.div>
      </div>
    </div>
  )
}
