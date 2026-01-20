import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Languages, ChevronDown } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false)
  const location = useLocation()
  const { language, toggleLanguage, t } = useLanguage()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAboutDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.programs'), path: '/programs' },
    { name: t('nav.updates'), path: '/updates' },
    { name: t('nav.contact'), path: '/contact' },
  ]

  const aboutMenuItems = [
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.members'), path: '/members' },
  ]

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg py-3' : 'bg-white/95 backdrop-blur-sm py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0">
            <img 
              src="/assets/saf_logo.jpeg" 
              alt="SAF Logo" 
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain group-hover:scale-110 transition-transform duration-300"
            />
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-saf-red-800 leading-tight">
                SAF
              </span>
              <span className="text-xs text-saf-dark-600 leading-tight hidden sm:block">
                Settibalija Action Force
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
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
            
            {/* About SAF Dropdown */}
            <div 
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-1 ${
                  location.pathname === '/about' || location.pathname === '/members'
                    ? 'bg-saf-red-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-saf-red-50 hover:text-saf-red-600'
                }`}
              >
                {t('nav.about')}
                <ChevronDown className={`w-4 h-4 transition-transform ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {aboutDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fade-in">
                  {aboutMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setAboutDropdownOpen(false)}
                      className={`block px-4 py-2 text-sm font-medium transition-all duration-200 ${
                        location.pathname === item.path
                          ? 'bg-saf-red-50 text-saf-red-600 font-semibold'
                          : 'text-gray-700 hover:bg-saf-red-50 hover:text-saf-red-600'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Language Toggle & CTA - Desktop */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-saf-red-50 text-saf-red-700 hover:bg-saf-red-100 transition-colors"
            >
              <Languages className="w-5 h-5" />
              <span className="font-medium">{language === 'en' ? 'తెలుగు' : 'English'}</span>
            </button>
            <Link to="/contact?tab=membership" className="btn-primary">
              {t('nav.joinMission')}
            </Link>
          </div>

          {/* Mobile Menu Button - Aligned with content edge */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors flex-shrink-0 ml-auto"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-4 animate-fade-in-up border-t border-gray-200 pt-4">
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
              
              {/* About SAF Mobile Dropdown */}
              <div>
                <button
                  onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-between ${
                    location.pathname === '/about' || location.pathname === '/members'
                      ? 'bg-saf-red-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-saf-red-50 hover:text-saf-red-600'
                  }`}
                >
                  <span>{t('nav.about')}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {aboutDropdownOpen && (
                  <div className="mt-2 ml-4 space-y-1">
                    {aboutMenuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => {
                          setIsOpen(false)
                          setAboutDropdownOpen(false)
                        }}
                        className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          location.pathname === item.path
                            ? 'bg-saf-red-50 text-saf-red-600 font-semibold'
                            : 'text-gray-700 hover:bg-saf-red-50 hover:text-saf-red-600'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
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
                to="/contact?tab=membership"
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
