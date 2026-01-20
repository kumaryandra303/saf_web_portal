import React from 'react'
import { User, Award } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const LeadershipSection = () => {
  const { t } = useLanguage()
  
  const leaders = [
    { name: t('home.minister'), role: t('leadership.patron'), desc: t('leadership.patronDesc') },
    { name: 'Community Leader', role: t('leadership.president'), desc: t('leadership.presidentDesc') },
    { name: 'Community Leader', role: t('leadership.secretary'), desc: t('leadership.secretaryDesc') }
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="section-title">{t('leadership.title')}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {leaders.map((leader, i) => (
            <div key={i} className="card text-center p-8">
              <div className="w-24 h-24 bg-gradient-to-br from-saf-red-500 to-saf-red-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-saf-dark-900 mb-2">{leader.name}</h3>
              <div className="text-saf-red-600 font-semibold mb-3">{leader.role}</div>
              <p className="text-gray-600 text-sm">{leader.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LeadershipSection
