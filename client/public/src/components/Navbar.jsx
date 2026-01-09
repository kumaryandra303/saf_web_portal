import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Languages } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const { language, toggleLanguage, t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.programs'), path: '/programs' },
    { name: t('nav.updates'), path: '/updates' },
    { name: t('nav.gallery'), path: '/gallery' },
    { name: t('nav.members'), path: '/members' },
    { name: t('nav.contact'), path: '/contact' },
  ]

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg py-3' : 'bg-white/95 backdrop-blur-sm py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/assets/saf_logo.jpeg" 
              alt="SAF Logo" 
              className="w-12 h-12 md:w-14 md:h-14 object-contain group-hover:scale-110 transition-transform duration-300"
            />
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold text-saf-red-800 leading-tight">
                SAF
              </span>
              <span className="text-xs text-saf-dark-600 leading-tight hidden sm:block">
                Settibalija Action Force
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  location.pathname === link.path
                    ? 'bg-saf-red-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-saf-red-50 hover:text-saf-red-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Language Toggle & CTA - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-saf-red-50 text-saf-red-700 hover:bg-saf-red-100 transition-colors"
            >
              <Languages className="w-5 h-5" />
              <span className="font-medium">{language === 'en' ? 'తెలుగు' : 'English'}</span>
            </button>
            <Link to="/contact" className="btn-primary">
              {t('nav.joinMission')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-4 animate-fade-in-up">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'bg-saf-red-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-saf-red-50 hover:text-saf-red-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <button
                onClick={() => {
                  toggleLanguage()
                  setIsOpen(false)
                }}
                className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-saf-red-50 text-saf-red-700 font-medium"
              >
                <Languages className="w-5 h-5" />
                <span>{language === 'en' ? 'తెలుగు' : 'English'}</span>
              </button>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="btn-primary text-center"
              >
                {t('nav.joinMission')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
