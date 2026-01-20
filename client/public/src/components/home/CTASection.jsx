import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Phone, Mail } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const CTASection = () => {
  const { t } = useLanguage()
  
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-saf-red-600 to-saf-dark-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8 w-full">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">{t('cta.title')}</h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-200">{t('cta.subtitle')}</p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link to="/contact?tab=membership" className="bg-white text-saf-red-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:scale-105 transition-all inline-flex items-center justify-center text-sm sm:text-base">
            {t('cta.contactUs')} <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          <a href="tel:+91XXXXXXXXXX" className="bg-transparent border-2 border-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-white hover:text-saf-red-600 transition-all inline-flex items-center justify-center text-sm sm:text-base">
            <Phone className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /> {t('cta.callNow')}
          </a>
        </div>
      </div>
    </section>
  )
}

export default CTASection
