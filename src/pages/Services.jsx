import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Services() {
  const navigate = useNavigate()

  const services = [
    {
      title: 'Engine Services',
      icon: '⚙️',
      description: 'Complete diagnostics, oil changes, fluid flushes, and major repairs.',
      items: ['Oil Changes', 'Filter Replacements', 'Spark Plugs', 'Transmission Repair']
    },
    {
      title: 'Tire & Wheel Services',
      icon: '🛞',
      description: 'Premium tires, balancing, rotation, and alignment.',
      items: ['Tire Installation', 'Wheel Balancing', 'Alignment', 'Rotation']
    },
    {
      title: 'Brake Services',
      icon: '🛑',
      description: 'Brake pads, rotors, and complete brake system maintenance.',
      items: ['Brake Pads', 'Rotor Replacement', 'Brake Fluid', 'System Inspection']
    },
    {
      title: 'Suspension & Steering',
      icon: '🔧',
      description: 'Suspension repairs, struts, shocks, and steering components.',
      items: ['Shock Absorbers', 'Struts', 'Control Arms', 'Tie Rods']
    },
    {
      title: 'Electrical & Battery',
      icon: '🔋',
      description: 'Battery replacement, alternators, starters, and wiring.',
      items: ['Battery Service', 'Alternator', 'Starter', 'Electrical Diagnosis']
    },
    {
      title: 'Air & Cooling',
      icon: '❄️',
      description: 'AC service, radiator repair, cooling system maintenance.',
      items: ['AC Recharge', 'Radiator Flush', 'Water Pump', 'Thermostat']
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Our Services</h1>
          <p className="text-xl text-gray-400">Complete auto care for every need</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              className="bg-gray-800 rounded-lg p-8 hover:bg-gray-700 transition border border-gray-700 hover:border-yellow-400"
              variants={itemVariants}
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
              <p className="text-gray-300 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.items.map((item, i) => (
                  <li key={i} className="text-gray-400 flex items-center">
                    <span className="text-yellow-400 mr-2">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <button
            onClick={() => navigate('/contact')}
            className="px-8 py-4 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition text-lg"
          >
            Schedule Service Now
          </button>
        </motion.div>
      </div>
    </div>
  )
}
