import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Users, Award, TrendingUp } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const AboutPreview = () => {
  const { t } = useLanguage()
  
  const timeline = [
    {
      year: '1920',
      title: t('about.communityFormation'),
      description: t('about.communityFormationDesc')
    },
    {
      year: '2023',
      title: t('about.safEstablishment'),
      description: t('about.safEstablishmentDesc')
    },
    {
      year: '2024',
      title: t('about.revivalExpansion'),
      description: t('about.revivalExpansionDesc')
    },
    {
      year: '2026',
      title: t('about.anniversaryTitle'),
      description: t('about.anniversaryDesc')
    }
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-saf-red-100 rounded-full blur-3xl opacity-30 hidden sm:block"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-saf-gold-100 rounded-full blur-3xl opacity-30 hidden sm:block"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-saf-red-100 px-4 py-2 rounded-full">
              <Users className="w-5 h-5 text-saf-red-600" />
              <span className="text-sm font-semibold text-saf-red-600">{t('nav.about')}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-saf-dark-900 leading-tight">
              {t('about.title')}
            </h2>

            <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed">
              <p className="text-base sm:text-lg">
                {t('about.communityDesc1')}
              </p>
              <p className="text-sm sm:text-base">
                {t('about.communityDesc2')}
              </p>
              <p className="text-sm sm:text-base">
                {t('about.communityDesc3')}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="bg-gradient-to-br from-saf-red-50 to-saf-red-100 p-6 rounded-xl">
                <Award className="w-8 h-8 text-saf-red-600 mb-2" />
                <div className="text-2xl font-bold text-saf-dark-900">BC-B</div>
                <div className="text-sm text-gray-600">{t('about.classification')}</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
                <div className="text-2xl font-bold text-saf-dark-900">100+</div>
                <div className="text-sm text-gray-600">{t('about.yearsLegacy')}</div>
              </div>
            </div>

            <div className="pt-6">
              <Link to="/about" className="btn-primary inline-flex items-center group">
                {t('about.learnMore')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Content - Timeline */}
          <div className="relative mt-8 lg:mt-0">
            <div className="bg-gradient-to-br from-saf-dark-900 to-saf-red-900 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 flex items-center">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-saf-gold-400 flex-shrink-0" />
                {t('about.ourJourney')}
              </h3>

              <div className="space-y-4 sm:space-y-6">
                {timeline.map((item, index) => (
                  <div key={index} className="relative pl-6 sm:pl-8 pb-4 sm:pb-6 last:pb-0">
                    {/* Timeline Line */}
                    {index !== timeline.length - 1 && (
                      <div className="absolute left-2 top-6 sm:top-8 bottom-0 w-0.5 bg-saf-gold-400/30"></div>
                    )}
                    
                    {/* Timeline Dot */}
                    <div className="absolute left-0 top-1 w-3 h-3 sm:w-4 sm:h-4 bg-saf-gold-400 rounded-full border-2 sm:border-4 border-saf-dark-900"></div>
                    
                    {/* Content */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 hover:bg-white/20 transition-all duration-300">
                      <div className="text-saf-gold-400 font-bold text-xs sm:text-sm mb-1">{item.year}</div>
                      <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">{item.title}</h4>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-r from-saf-red-600 to-saf-red-700 rounded-2xl p-6 sm:p-8 md:p-12 text-white text-center shadow-2xl">
          <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold">{t('about.whatIsSAF')}</h3>
            <p className="text-base sm:text-lg md:text-xl text-gray-100 leading-relaxed">
              {t('about.safDescription')}
            </p>
            <div className="pt-3 sm:pt-4">
              <span className="inline-block bg-white/20 backdrop-blur-sm px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm">
                {t('about.patronageOf')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutPreview
