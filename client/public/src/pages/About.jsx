import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Users, Calendar, Award, TrendingUp, Shield, Heart, Target, Eye } from 'lucide-react'

const About = () => {
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
      description: t('about.anniversaryDate') + ' - ' + t('about.anniversaryLocation') + '. ' + t('about.anniversaryDesc')
    }
  ]

  const values = [
    {
      icon: Heart,
      title: t('about.title'),
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: Users,
      title: t('about.title'),
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: TrendingUp,
      title: t('about.title'),
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Award,
      title: t('about.title'),
      color: 'from-orange-500 to-amber-600'
    }
  ]

  return (
    <div className="pt-20 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-saf-red-500 to-saf-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t('about.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-100">
              {t('about.communityDesc1')}
            </p>
          </div>
        </div>
      </section>

      {/* Community Description */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/assets/saf_cmty_mmbr.jpeg" 
                alt="SAF Community Members" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-saf-dark-900">
                {t('about.title')}
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>{t('about.communityDesc1')}</p>
                <p>{t('about.communityDesc2')}</p>
                <p>{t('about.communityDesc3')}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="bg-saf-red-50 p-6 rounded-xl">
                  <Award className="w-8 h-8 text-saf-red-600 mb-2" />
                  <div className="text-2xl font-bold text-saf-dark-900">BC-B</div>
                  <div className="text-sm text-gray-600">{t('about.classification')}</div>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
                  <div className="text-2xl font-bold text-saf-dark-900">100+</div>
                  <div className="text-sm text-gray-600">{t('about.yearsLegacy')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-saf-dark-900 mb-4">
              {t('about.ourJourney')}
            </h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-saf-red-200"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="flex-1 md:text-right md:pr-8">
                    {index % 2 === 0 && (
                      <div className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="text-saf-red-600 font-bold text-lg mb-2">{item.year}</div>
                        <h3 className="text-xl font-semibold text-saf-dark-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="relative flex items-center justify-center w-12 h-12 bg-saf-red-600 rounded-full border-4 border-white shadow-lg z-10">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 md:pl-8">
                    {index % 2 !== 0 && (
                      <div className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="text-saf-red-600 font-bold text-lg mb-2">{item.year}</div>
                        <h3 className="text-xl font-semibold text-saf-dark-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What is SAF */}
      <section className="py-16 bg-gradient-to-r from-saf-red-600 to-saf-red-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('about.whatIsSAF')}</h2>
          <p className="text-lg md:text-xl leading-relaxed mb-8">
            {t('about.safDescription')}
          </p>
          <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
            <p className="text-sm font-medium">{t('about.patronageOf')}</p>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-saf-dark-900 mb-4">
              {t('leadership.title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center p-8">
              <div className="w-32 h-32 bg-gradient-to-br from-saf-red-500 to-saf-red-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold text-saf-dark-900 mb-2">
                {t('home.minister')}
              </h3>
              <div className="text-saf-red-600 font-semibold mb-3">{t('leadership.patron')}</div>
              <p className="text-gray-600 text-sm">{t('leadership.patronDesc')}</p>
            </div>

            <div className="card text-center p-8">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold text-saf-dark-900 mb-2">Community Leader</h3>
              <div className="text-blue-600 font-semibold mb-3">{t('leadership.president')}</div>
              <p className="text-gray-600 text-sm">{t('leadership.presidentDesc')}</p>
            </div>

            <div className="card text-center p-8">
              <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold text-saf-dark-900 mb-2">Community Leader</h3>
              <div className="text-green-600 font-semibold mb-3">{t('leadership.secretary')}</div>
              <p className="text-gray-600 text-sm">{t('leadership.secretaryDesc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
