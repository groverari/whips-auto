import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Using Formspree for form submission
    // SETUP REQUIRED: Replace YOUR_FORM_ID with your actual Formspree form ID
    // 1. Go to https://formspree.io
    // 2. Sign up for free
    // 3. Create a new form
    // 4. Copy the form ID from the endpoint (e.g., f/abc123)
    // 5. Replace 'YOUR_FORM_ID' below with that ID
    
    const FORMSPREE_FORM_ID = 'YOUR_FORM_ID' // TODO: Replace with actual form ID

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', phone: '', service: '', message: '' })
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        alert('Error submitting form. Please check that FORMSPREE_FORM_ID is set correctly.')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      alert('Error submitting form. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-400">Schedule your service or ask us anything</p>
        </motion.div>

        {submitted && (
          <motion.div
            className="bg-green-900 border border-green-400 text-green-100 px-6 py-4 rounded-lg mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ✓ Message sent! We'll contact you shortly.
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          className="bg-gray-800 rounded-lg p-8 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-white font-semibold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-white font-semibold mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Service Needed</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
              >
                <option value="">Select a service</option>
                <option value="Engine Services">Engine Services</option>
                <option value="Tire & Wheel">Tire & Wheel Services</option>
                <option value="Brake Services">Brake Services</option>
                <option value="Suspension">Suspension & Steering</option>
                <option value="Electrical">Electrical & Battery</option>
                <option value="Cooling">Air & Cooling</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
              placeholder="Tell us about your vehicle and what you need..."
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </motion.button>
        </motion.form>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="text-center">
            <div className="text-4xl mb-2">📍</div>
            <h3 className="text-white font-semibold mb-1">Location</h3>
            <p className="text-gray-400">Update this address<br/>in Contact.jsx</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">📞</div>
            <h3 className="text-white font-semibold mb-1">Phone</h3>
            <p className="text-gray-400">Update this phone<br/>in Contact.jsx</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">⏰</div>
            <h3 className="text-white font-semibold mb-1">Hours</h3>
            <p className="text-gray-400">Update these hours<br/>in Contact.jsx</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
