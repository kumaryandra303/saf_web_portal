import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Phone, Mail } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const CTASection = () => {
  const { t } = useLanguage()
  
  return (
    <section className="py-20 bg-gradient-to-br from-saf-red-600 to-saf-dark-900 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold">{t('cta.title')}</h2>
        <p className="text-xl text-gray-200">{t('cta.subtitle')}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact?tab=membership" className="bg-white text-saf-red-600 px-8 py-4 rounded-lg font-semibold hover:scale-105 transition-all inline-flex items-center justify-center">
            {t('cta.contactUs')} <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <a href="tel:+91XXXXXXXXXX" className="bg-transparent border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-saf-red-600 transition-all inline-flex items-center justify-center">
            <Phone className="mr-2 w-5 h-5" /> {t('cta.callNow')}
          </a>
        </div>
      </div>
    </section>
  )
}

export default CTASection
