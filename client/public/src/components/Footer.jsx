import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { t } = useLanguage()

  const quickLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.programs'), path: '/programs' },
    { name: t('nav.updates'), path: '/updates' },
  ]

  const programs = [
    { name: t('programs.womenSupport'), path: '/programs#women-support' },
    { name: t('programs.youthEmpowerment'), path: '/programs#youth' },
    { name: t('programs.employmentSupport'), path: '/programs#employment' },
    { name: t('programs.communityDevelopment'), path: '/programs#community' },
  ]

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: '#', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: Twitter, url: '#', color: 'hover:text-sky-500' },
    { name: 'Instagram', icon: Instagram, url: '#', color: 'hover:text-pink-600' },
    { name: 'YouTube', icon: Youtube, url: '#', color: 'hover:text-red-600' },
    { name: 'LinkedIn', icon: Linkedin, url: '#', color: 'hover:text-blue-700' },
  ]

  return (
    <footer className="bg-saf-dark-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-10 h-10 text-saf-red-500" />
              <div>
                <h3 className="text-xl font-bold text-white">SAF</h3>
                <p className="text-xs text-gray-400">Settibalija Action Force</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('footer.about')}
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 bg-saf-dark-800 rounded-lg transition-all duration-300 ${social.color} hover:scale-110`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-saf-red-500 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-saf-red-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{t('footer.ourPrograms')}</h4>
            <ul className="space-y-2">
              {programs.map((program) => (
                <li key={program.path}>
                  <Link
                    to={program.path}
                    className="text-sm text-gray-400 hover:text-saf-red-500 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-saf-red-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {program.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{t('footer.contactUs')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm">
                <MapPin className="w-5 h-5 text-saf-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  Andhra Pradesh & Telangana<br />
                  India
                </span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Phone className="w-5 h-5 text-saf-red-500 flex-shrink-0" />
                <a href="tel:+91XXXXXXXXXX" className="text-gray-400 hover:text-saf-red-500 transition-colors">
                  +91 XXXX-XXXXXX
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Mail className="w-5 h-5 text-saf-red-500 flex-shrink-0" />
                <a href="mailto:info@saf.org" className="text-gray-400 hover:text-saf-red-500 transition-colors">
                  info@saf.org
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-saf-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {currentYear} Settibalija Action Force (SAF). {t('footer.allRightsReserved')}.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <a href="#" className="hover:text-saf-red-500 transition-colors">{t('footer.privacyPolicy')}</a>
              <span className="hidden md:inline">•</span>
              <a href="#" className="hover:text-saf-red-500 transition-colors">{t('footer.termsOfService')}</a>
              <span className="hidden md:inline">•</span>
              <a href="#" className="hover:text-saf-red-500 transition-colors">{t('footer.transparencyReport')}</a>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              #SettibalijaActionForce #VasamsettiSubash #SAFTeam #Andhrapradesh #Telangana
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
