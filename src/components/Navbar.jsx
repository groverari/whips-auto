import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`)
      setMobileOpen(false)
      return
    }

    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  const navLinks = [
    { label: 'Services', id: 'services' },
    { label: 'About', id: 'about' },
    { label: 'Reviews', id: 'testimonials' },
    { label: 'FAQ', id: 'faq' },
    { label: 'Contact', id: 'contact' },
  ]

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0B0B0F]/95 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => scrollTo('hero')}
          className="text-2xl font-bold tracking-[0.2em] text-white hover:text-[#D4A843] transition-colors"
        >
          WHIPS AUTO
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-sm text-white/70 hover:text-white transition-colors tracking-wide uppercase"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('contact')}
            className="px-6 py-2.5 bg-[#D4A843] text-black text-sm font-semibold rounded tracking-wide hover:bg-[#C49A3A] transition-colors"
          >
            Book Now
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0B0B0F]/98 backdrop-blur-md border-t border-white/5">
          <div className="px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-left text-white/70 hover:text-white transition-colors tracking-wide uppercase text-sm py-2"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('contact')}
              className="mt-2 px-6 py-3 bg-[#D4A843] text-black text-sm font-semibold rounded tracking-wide hover:bg-[#C49A3A] transition-colors text-center"
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
