import { useMemo, useState } from 'react'
import { makeModels, vehicleYears } from '../data/vehicles'
import { services } from '../data/services'

const blankForm = {
  'bot-field': '',
  name: '',
  email: '',
  phone: '',
  service: '',
  year: '',
  make: '',
  model: '',
  message: '',
}

export default function BookingForm({
  defaultService = '',
  title = 'Schedule Your Service',
  showServiceSelect = true,
  messagePlaceholder = 'Tell us about your vehicle and what you need...',
}) {
  const [formData, setFormData] = useState({ ...blankForm, service: defaultService })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const makes = useMemo(() => Object.keys(makeModels).sort(), [])
  const models = formData.make ? makeModels[formData.make] || [] : []

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'make' ? { model: '' } : {}),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const encodedForm = new URLSearchParams({
      'form-name': 'booking',
      ...formData,
    }).toString()

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodedForm,
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ ...blankForm, service: defaultService })
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        alert('Error submitting form. Please try again.')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      alert('Error submitting form. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div>
      {title && <h3 className="text-2xl font-bold text-white mb-6">{title}</h3>}

      {submitted && (
        <div className="bg-green-900/30 border border-green-500/30 text-green-300 px-6 py-4 rounded-lg mb-6">
          Message sent successfully! We will contact you shortly.
        </div>
      )}

      <form
        name="booking"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
        className="bg-[#13131A] border border-white/5 rounded-xl p-6 sm:p-8"
      >
        <input type="hidden" name="form-name" value="booking" />
        <p className="hidden">
          <label>
            Do not fill this out:
            <input name="bot-field" value={formData['bot-field']} onChange={handleChange} />
          </label>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <label className="block">
            <span className="block text-white text-sm font-medium mb-2">Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#0B0B0F] text-white text-sm rounded-lg border border-white/10 focus:border-[#D4A843] focus:outline-none transition-colors"
              placeholder="Your name"
            />
          </label>

          <label className="block">
            <span className="block text-white text-sm font-medium mb-2">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#0B0B0F] text-white text-sm rounded-lg border border-white/10 focus:border-[#D4A843] focus:outline-none transition-colors"
              placeholder="your@email.com"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <label className="block">
            <span className="block text-white text-sm font-medium mb-2">Phone</span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#0B0B0F] text-white text-sm rounded-lg border border-white/10 focus:border-[#D4A843] focus:outline-none transition-colors"
              placeholder="(555) 123-4567"
            />
          </label>

          {showServiceSelect && (
            <label className="block">
              <span className="block text-white text-sm font-medium mb-2">Service Needed</span>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0B0B0F] text-white text-sm rounded-lg border border-white/10 focus:border-[#D4A843] focus:outline-none transition-colors"
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.slug} value={service.title}>
                    {service.title}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </label>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <label className="block">
            <span className="block text-white text-sm font-medium mb-2">Year</span>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#0B0B0F] text-white text-sm rounded-lg border border-white/10 focus:border-[#D4A843] focus:outline-none transition-colors"
            >
              <option value="">Select year</option>
              {vehicleYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-white text-sm font-medium mb-2">Make</span>
            <select
              name="make"
              value={formData.make}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#0B0B0F] text-white text-sm rounded-lg border border-white/10 focus:border-[#D4A843] focus:outline-none transition-colors"
            >
              <option value="">Select make</option>
              {makes.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-white text-sm font-medium mb-2">Model</span>
            <select
              name="model"
              value={formData.model}
              onChange={handleChange}
              disabled={!formData.make}
              className="w-full px-4 py-3 bg-[#0B0B0F] text-white text-sm rounded-lg border border-white/10 focus:border-[#D4A843] focus:outline-none transition-colors disabled:opacity-50"
            >
              <option value="">{formData.make ? 'Select model' : 'Choose make first'}</option>
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
              {formData.make && <option value="Other">Other</option>}
            </select>
          </label>
        </div>

        <label className="block mb-6">
          <span className="block text-white text-sm font-medium mb-2">Message</span>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            className="w-full px-4 py-3 bg-[#0B0B0F] text-white text-sm rounded-lg border border-white/10 focus:border-[#D4A843] focus:outline-none transition-colors resize-none"
            placeholder={messagePlaceholder}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3.5 bg-[#D4A843] text-black font-semibold rounded tracking-wide hover:bg-[#C49A3A] transition-colors disabled:opacity-50 text-sm"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}
