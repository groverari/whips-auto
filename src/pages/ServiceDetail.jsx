import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import BookingForm from '../components/BookingForm'
import ServiceIcon from '../components/ServiceIcon'
import {
  detailingSections,
  detailingSurcharges,
  inspections,
  oilLubeTirePricing,
  services,
} from '../data/services'

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

function PriceCard({ title, price, description }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="bg-[#13131A] border border-white/5 rounded-xl p-6 hover:border-[#D4A843]/30 transition-colors"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <span className="text-[#D4A843] text-xl font-bold whitespace-nowrap">{price}</span>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  )
}

function PricingList({ section }) {
  return (
    <motion.div variants={fadeInUp} className="bg-[#13131A] border border-white/5 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-5">{section.title}</h3>
      <div className="space-y-3">
        {section.items.map((item) => (
          <div
            key={`${section.title}-${item.name}`}
            className="flex items-start justify-between gap-4 border-b border-white/5 pb-3 last:border-b-0 last:pb-0"
          >
            <span className="text-gray-300 text-sm">{item.name}</span>
            <span className="text-[#D4A843] text-sm font-semibold whitespace-nowrap">{item.price}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function ServiceDetail() {
  const { slug } = useParams()
  const service = services.find((item) => item.slug === slug)

  if (!service) return <Navigate to="/" replace />

  const iconType = service.slug === 'detailing' ? 'detailing' : service.slug === 'tinting' ? 'tinting' : 'oil'

  return (
    <main className="min-h-screen bg-[#0B0B0F] pt-28">
      <section className="relative overflow-hidden bg-[#0F0F15] py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,168,67,0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_45%)]" />
        <div className="relative max-w-7xl mx-auto px-6">
          <Link
            to="/#services"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#D4A843] transition-colors mb-10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to services
          </Link>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.div variants={fadeInUp}>
              <p className="text-[#D4A843] text-sm font-semibold tracking-[0.2em] uppercase mb-3">
                {service.eyebrow}
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                {service.title}
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
                {service.description}
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-[#13131A]/80 border border-white/5 rounded-xl p-8"
            >
              <div className="text-[#D4A843] mb-6">
                <ServiceIcon type={iconType} className="w-14 h-14" />
              </div>
              <ul className="space-y-3">
                {service.items.map((item) => (
                  <li key={item} className="text-gray-300 flex items-center gap-3">
                    <svg className="w-4 h-4 text-[#D4A843] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {service.slug === 'oil-lube-tires' && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10">
              <div>
                <p className="text-[#D4A843] text-sm font-semibold tracking-[0.2em] uppercase mb-3">
                  Pricing
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
                  Oil, Lube, Tires, and Inspections
                </h2>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ margin: '-80px' }}
                  variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                >
                  {oilLubeTirePricing.map((item) => (
                    <PriceCard key={item.title} {...item} />
                  ))}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: '-80px' }}
                transition={{ duration: 0.55 }}
                className="bg-[#13131A] border border-white/5 rounded-xl p-6 self-start"
              >
                <h3 className="text-xl font-bold text-white mb-5">Inspections</h3>
                <ul className="space-y-3">
                  {inspections.map((inspection) => (
                    <li key={inspection} className="text-gray-300 flex gap-3">
                      <span className="text-[#D4A843]">•</span>
                      <span>{inspection}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {service.slug === 'detailing' && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-[#D4A843] text-sm font-semibold tracking-[0.2em] uppercase mb-3">
              Detailing Menu
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
              Packages and Upgrades
            </h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ margin: '-80px' }}
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            >
              {detailingSections.map((section) => (
                <PricingList key={section.title} section={section} />
              ))}
            </motion.div>

            <div className="mt-8 bg-[#0F0F15] border border-white/5 rounded-xl p-6">
              <h3 className="text-white font-bold mb-3">Vehicle Surcharges</h3>
              <ul className="space-y-2">
                {detailingSurcharges.map((item) => (
                  <li key={item} className="text-gray-400 text-sm flex gap-3">
                    <span className="text-[#D4A843]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {service.slug === 'tinting' && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10">
              <div>
                <p className="text-[#D4A843] text-sm font-semibold tracking-[0.2em] uppercase mb-3">
                  Quote Request
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5">
                  Tell Us Your Vehicle
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  Tinting quotes depend on the vehicle body style and glass layout. Pick
                  your year, make, and model in the form and we will follow up with options.
                </p>
              </div>
              <BookingForm
                defaultService={service.title}
                title="Tinting Contact Form"
                showServiceSelect={false}
                messagePlaceholder="Tell us your preferred tint shade or any tinting questions..."
              />
            </div>
          </div>
        </section>
      )}

      {service.slug !== 'tinting' && (
        <section className="py-20 bg-[#0F0F15]">
          <div className="max-w-4xl mx-auto px-6">
            <BookingForm
              defaultService={service.title}
              title={`Book ${service.title}`}
              showServiceSelect={false}
            />
          </div>
        </section>
      )}
    </main>
  )
}
