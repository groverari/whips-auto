import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-black bg-opacity-80 backdrop-blur text-white z-50 py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wider">
          WHIPS AUTO
        </Link>
        <div className="flex gap-8">
          <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
          <Link to="/services" className="hover:text-yellow-400 transition">Services</Link>
          <Link to="/contact" className="hover:text-yellow-400 transition">Contact</Link>
        </div>
      </div>
    </nav>
  )
}
