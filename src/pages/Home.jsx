import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import BookingForm from '../components/BookingForm'
import Car3DRealistic from '../components/Car3DRealistic'
import CarFallback from '../components/CarFallback'
import ServiceIcon from '../components/ServiceIcon'
import { services } from '../data/services'

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) return false
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      if (/SwiftShader|llvmpipe|softpipe/i.test(renderer)) return false
    }
    return true
  } catch {
    return false
  }
}

/* ─── Animation Variants ─── */

const slideFromLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const slideFromRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const scaleUp = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const flipUp = {
  hidden: { opacity: 0, rotateX: 15, y: 40 },
  visible: { opacity: 1, rotateX: 0, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

const staggerSlow = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.25 } },
}

// Per-card service animations: left, up, right
const serviceCardVariants = [
  {
    hidden: { opacity: 0, x: -50, rotateY: 8 },
    visible: { opacity: 1, x: 0, rotateY: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  },
  {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } },
  },
  {
    hidden: { opacity: 0, x: 50, rotateY: -8 },
    visible: { opacity: 1, x: 0, rotateY: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  },
]

// Testimonial cards: each slightly different
const testimonialVariants = [
  {
    hidden: { opacity: 0, y: 50, rotate: -2 },
    visible: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  },
  {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] } },
  },
  {
    hidden: { opacity: 0, y: 50, rotate: 2 },
    visible: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  },
]

// FAQ items alternate left/right
const faqItemVariant = (idx) => ({
  hidden: { opacity: 0, x: idx % 2 === 0 ? -30 : 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: idx * 0.08, ease: 'easeOut' } },
})

/* ─── Data ─── */

const testimonials = [
  {
    name: 'Marcus Johnson',
    date: '2 weeks ago',
    rating: 5,
    text: 'Brought my car in for an engine diagnostic and they found the issue right away. Fair pricing and fast turnaround. Will definitely be coming back.',
  },
  {
    name: 'Sarah Chen',
    date: '1 month ago',
    rating: 5,
    text: 'Best auto shop in town. They replaced my brakes and did an alignment — the car drives like new. The team is professional and honest.',
  },
  {
    name: 'David Williams',
    date: '3 weeks ago',
    rating: 5,
    text: "I've been taking all my vehicles here for over a year. Consistent quality work and they always explain what needs to be done. Highly recommend.",
  },
]

const faqs = [
  {
    q: 'What services do you offer?',
    a: 'We offer oil/lube and tire change services, auto detailing packages, and tinting quote requests.',
  },
  {
    q: 'How do I book an appointment?',
    a: 'You can book an appointment by filling out the contact form on this page, calling us directly at (555) 123-4567, or visiting our shop during business hours. We also accept walk-ins based on availability.',
  },
  {
    q: 'What are your hours of operation?',
    a: 'We are open Monday through Friday from 8:00 AM to 6:00 PM, Saturday from 9:00 AM to 3:00 PM, and closed on Sundays.',
  },
  {
    q: 'Do you offer any warranties on your work?',
    a: 'Yes, all our repairs come with a 12-month / 12,000-mile warranty on parts and labor. We stand behind our work and your satisfaction is our priority.',
  },
  {
    q: 'How long do repairs usually take?',
    a: 'Most standard oil/lube, tire, and detailing appointments can be scheduled quickly. We will confirm timing after reviewing your vehicle and selected service.',
  },
  {
    q: 'Do you provide free estimates?',
    a: 'Yes. Tinting and detailing quotes can vary by vehicle size and condition, so the form asks for year, make, and model to help us price it correctly.',
  },
]

/* ─── Sub-Components ─── */

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-5 text-left group"
      >
        <span className="text-white font-medium pr-8 group-hover:text-[#D4A843] transition-colors">
          {question}
        </span>
        <svg
          className={`w-5 h-5 text-[#D4A843] shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-gray-400 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StarRating({ count }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-[#D4A843]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

/* ─── Main Page ─── */

export default function Home() {
  const [webglSupported] = useState(() => hasWebGL())

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (!window.location.hash) return
    const id = window.location.hash.slice(1)
    window.setTimeout(() => scrollTo(id), 50)
  }, [])

  // Hero parallax — content fades out and shifts up as user scrolls away
  const heroRef = useRef(null)
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroTextY = useTransform(heroProgress, [0, 1], [0, -120])
  const heroTextOpacity = useTransform(heroProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(heroProgress, [0, 0.6], [1, 0.92])

  return (
    <main>
      {/* ═══════════ HERO ═══════════ */}
      <section
        id="hero"
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* 3D Car Background */}
        <div className="absolute inset-0">
          {webglSupported ? <Car3DRealistic heroMode /> : <CarFallback />}
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/20 to-[#0B0B0F]/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0F]/40 to-transparent pointer-events-none" />

        {/* Hero Content — parallax scroll */}
        <motion.div
          className="relative z-10 text-center px-6 max-w-4xl"
          style={{ y: heroTextY, opacity: heroTextOpacity, scale: heroScale }}
        >
          <motion.p
            className="text-[#D4A843] text-sm sm:text-base font-semibold tracking-[0.3em] uppercase mb-4"
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            #1 Premium Auto Service
          </motion.p>
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-[0.08em] mb-6"
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(12px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            WHIPS AUTO
          </motion.h1>
          <motion.p
            className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.6 }}
          >
            Quality craftsmanship and transparent pricing for every vehicle.
            Your car deserves the best — and so do you.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <motion.button
              onClick={() => scrollTo('contact')}
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(212,168,67,0.4)' }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 bg-[#D4A843] text-black font-semibold rounded tracking-wide hover:bg-[#C49A3A] transition-colors text-sm sm:text-base"
            >
              Book Now
            </motion.button>
            <motion.button
              onClick={() => scrollTo('services')}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 border border-white/25 text-white font-medium rounded tracking-wide transition-colors text-sm sm:text-base"
            >
              Our Services
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <span className="text-white/30 text-xs tracking-[0.2em] uppercase">Scroll</span>
          <motion.svg
            className="w-5 h-5 text-white/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.div>
      </section>

      {/* ═══════════ SERVICES ═══════════ */}
      <section id="services" className="py-24 bg-[#0B0B0F] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ margin: '-80px' }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[#D4A843] text-sm font-semibold tracking-[0.2em] uppercase mb-3">
              What We Offer
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Our Services
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerSlow}
            initial="hidden"
            whileInView="visible"
            viewport={{ margin: '-80px' }}
          >
            {services.map((service, idx) => (
              <motion.div
                key={service.slug}
                variants={serviceCardVariants[idx]}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group bg-[#13131A] border border-white/5 rounded-xl p-8 hover:border-[#D4A843]/30 hover:shadow-[0_8px_40px_rgba(212,168,67,0.08)] transition-all duration-300"
                style={{ perspective: 800 }}
              >
                <motion.div
                  className="text-[#D4A843] mb-5"
                  whileHover={{ rotate: 12, scale: 1.15 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <ServiceIcon
                    type={service.slug === 'detailing' ? 'detailing' : service.slug === 'tinting' ? 'tinting' : 'oil'}
                  />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{service.description}</p>
                <ul className="space-y-2.5">
                  {service.items.map((item, i) => (
                    <li key={i} className="text-gray-400 text-sm flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-[#D4A843] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/services/${service.slug}`}
                  className="mt-6 text-[#D4A843] text-sm font-medium hover:text-[#e8c066] transition-colors inline-flex items-center gap-1.5 group/link"
                >
                  Learn More
                  <svg className="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ WHY CHOOSE US ═══════════ */}
      <section id="about" className="py-24 bg-[#0F0F15] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — Text (slides in from left) */}
            <motion.div
              variants={slideFromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ margin: '-80px' }}
            >
              <motion.p
                className="text-[#D4A843] text-sm font-semibold tracking-[0.2em] uppercase mb-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{}}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Why Choose Us
              </motion.p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Why Choose<br />Whips Auto?
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                At Whips Auto, we believe every vehicle deserves expert care. Our team of
                certified technicians combines years of experience with cutting-edge
                diagnostics to deliver results you can trust. We are not just fixing cars —
                we are building lasting relationships with every customer who drives
                through our doors.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                From routine maintenance to complex repairs, we provide transparent
                pricing with no hidden fees. Your satisfaction is not just a goal — it is
                our standard.
              </p>
              <motion.button
                onClick={() => scrollTo('contact')}
                whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(212,168,67,0.3)' }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 bg-[#D4A843] text-black font-semibold rounded tracking-wide hover:bg-[#C49A3A] transition-colors text-sm"
              >
                Book an Appointment
              </motion.button>
            </motion.div>

            {/* Right — Stats (scale up with stagger) */}
            <motion.div
              className="grid grid-cols-2 gap-6"
              variants={staggerSlow}
              initial="hidden"
              whileInView="visible"
              viewport={{ margin: '-80px' }}
            >
              {[
                { number: '15+', label: 'Years Experience' },
                { number: '5,000+', label: 'Cars Serviced' },
                { number: '100%', label: 'Satisfaction Rate' },
                { number: '12 Mo', label: 'Parts Warranty' },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  variants={scaleUp}
                  whileHover={{ scale: 1.05, borderColor: 'rgba(212,168,67,0.3)' }}
                  className="bg-[#13131A] border border-white/5 rounded-xl p-6 text-center"
                >
                  <motion.div
                    className="text-3xl sm:text-4xl font-bold text-[#D4A843] mb-2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{}}
                    transition={{ duration: 0.5, delay: 0.3 + idx * 0.1, type: 'spring', stiffness: 200 }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section id="testimonials" className="py-24 bg-[#0B0B0F] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ margin: '-80px' }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[#D4A843] text-sm font-semibold tracking-[0.2em] uppercase mb-3">
              Testimonials
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              What Our Clients Say
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerSlow}
            initial="hidden"
            whileInView="visible"
            viewport={{ margin: '-80px' }}
          >
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                variants={testimonialVariants[idx]}
                whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}
                className="bg-[#13131A] border border-white/5 rounded-xl p-8"
                style={{ perspective: 600 }}
              >
                <StarRating count={t.rating} />
                <p className="text-gray-300 text-sm leading-relaxed mt-4 mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 rounded-full bg-[#D4A843]/20 flex items-center justify-center text-[#D4A843] font-bold text-sm"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    {t.name.split(' ').map((n) => n[0]).join('')}
                  </motion.div>
                  <div>
                    <p className="text-white text-sm font-medium">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section id="faq" className="py-24 bg-[#0F0F15] overflow-hidden">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#D4A843] text-sm font-semibold tracking-[0.2em] uppercase mb-3">
              FAQ
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div>
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                variants={faqItemVariant(idx)}
                initial="hidden"
                whileInView="visible"
                viewport={{ margin: '-40px' }}
              >
                <FAQItem question={faq.q} answer={faq.a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CONTACT / BOOKING ═══════════ */}
      <section id="contact" className="py-24 bg-[#0B0B0F] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ margin: '-80px' }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[#D4A843] text-sm font-semibold tracking-[0.2em] uppercase mb-3">
              Get In Touch
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Schedule Your Service
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form (rises up with slight scale) */}
            <motion.div
              className="lg:col-span-2"
              variants={flipUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ margin: '-80px' }}
              style={{ perspective: 800 }}
            >
              <BookingForm title="" />
            </motion.div>

            {/* Contact Info Sidebar (slides from right) */}
            <motion.div
              className="space-y-6"
              variants={staggerSlow}
              initial="hidden"
              whileInView="visible"
              viewport={{ margin: '-80px' }}
            >
              {[
                {
                  title: 'Visit Us',
                  detail: '123 Auto Lane\nYour City, ST 12345',
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                    </svg>
                  ),
                },
                {
                  title: 'Call Us',
                  detail: '(555) 123-4567',
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  ),
                },
                {
                  title: 'Business Hours',
                  detail: 'Mon–Fri: 8AM – 6PM\nSat: 9AM – 3PM\nSun: Closed',
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                },
                {
                  title: 'Email Us',
                  detail: 'info@whipsauto.com',
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  ),
                },
              ].map((info, idx) => (
                <motion.div
                  key={idx}
                  variants={slideFromRight}
                  whileHover={{ x: -4, borderColor: 'rgba(212,168,67,0.25)' }}
                  className="bg-[#13131A] border border-white/5 rounded-xl p-6 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-[#D4A843] shrink-0 mt-0.5">{info.icon}</div>
                    <div>
                      <h4 className="text-white font-medium text-sm mb-1">{info.title}</h4>
                      <p className="text-gray-400 text-sm whitespace-pre-line">{info.detail}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}
