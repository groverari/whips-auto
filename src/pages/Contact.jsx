import { motion } from 'framer-motion'
import BookingForm from '../components/BookingForm'

export default function Contact() {
  return (
    <main className="min-h-screen bg-[#0B0B0F] pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[#D4A843] text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            Get In Touch
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            Schedule Your Service
          </h1>
          <p className="text-lg text-gray-400">
            Pick your service and vehicle details so we can follow up with the right quote.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <BookingForm title="" />
        </motion.div>
      </div>
    </main>
  )
}
