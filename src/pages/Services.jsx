import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ServiceIcon from '../components/ServiceIcon'
import { services } from '../data/services'

export default function Services() {
  return (
    <main className="min-h-screen bg-[#0B0B0F] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[#D4A843] text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            What We Offer
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            Our Services
          </h1>
          <p className="text-lg text-gray-400">Oil/lube and tires, detailing, and tinting.</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {services.map((service) => (
            <motion.div
              key={service.slug}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="bg-[#13131A] border border-white/5 rounded-xl p-8 hover:border-[#D4A843]/30 transition-colors"
            >
              <div className="text-[#D4A843] mb-5">
                <ServiceIcon
                  type={service.slug === 'detailing' ? 'detailing' : service.slug === 'tinting' ? 'tinting' : 'oil'}
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{service.description}</p>
              <Link
                to={`/services/${service.slug}`}
                className="text-[#D4A843] text-sm font-medium hover:text-[#e8c066] transition-colors inline-flex items-center gap-2"
              >
                View details
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  )
}
