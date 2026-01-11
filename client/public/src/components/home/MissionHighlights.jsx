import React from 'react'
import { Heart, GraduationCap, Briefcase, Users, TrendingUp, Shield, HeartHandshake, Target } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const MissionHighlights = () => {
  const { t } = useLanguage()
  
  const missions = [
    {
      icon: Heart,
      title: t('mission.financialSupport'),
      description: t('mission.financialSupportDesc'),
      color: 'from-pink-500 to-rose-600',
      stats: `500+ ${t('mission.womenSupported')}`
    },
    {
      icon: GraduationCap,
      title: t('mission.youthSkills'),
      description: t('mission.youthSkillsDesc'),
      color: 'from-blue-500 to-indigo-600',
      stats: `300+ ${t('mission.youthTrained')}`
    },
    {
      icon: Briefcase,
      title: t('mission.employment'),
      description: t('mission.employmentDesc'),
      color: 'from-green-500 to-emerald-600',
      stats: `200+ ${t('mission.jobsCreated')}`
    },
    {
      icon: Users,
      title: t('mission.communityWelfare'),
      description: t('mission.communityWelfareDesc'),
      color: 'from-orange-500 to-amber-600',
      stats: `50+ ${t('mission.programsActive')}`
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-saf-red-100 px-4 py-2 rounded-full mb-4">
            <Target className="w-5 h-5 text-saf-red-600" />
            <span className="text-sm font-semibold text-saf-red-600">{t('mission.title')}</span>
          </div>
          <h2 className="section-title">
            {t('mission.title')}
          </h2>
          <p className="section-subtitle mt-4">
            {t('mission.subtitle')}
          </p>
        </div>

        {/* Mission Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {missions.map((mission, index) => (
            <div
              key={index}
              className="group card hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon Header */}
              <div className={`bg-gradient-to-br ${mission.color} p-6 relative overflow-hidden`}>
                <div className="absolute inset-0 pattern-overlay opacity-10"></div>
                <div className="relative z-10 flex justify-center">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                    <mission.icon className="w-12 h-12 text-white" strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-saf-dark-900 group-hover:text-saf-red-600 transition-colors">
                  {mission.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {mission.description}
                </p>
                
                {/* Stats Badge */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-saf-red-600 bg-saf-red-50 px-3 py-1 rounded-full">
                      {mission.stats}
                    </span>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-4">
              <div className="bg-saf-red-100 p-4 rounded-full">
                <HeartHandshake className="w-8 h-8 text-saf-red-600" />
              </div>
              <div className="text-left">
                <h4 className="text-lg font-bold text-saf-dark-900">{t('mission.wantToContribute')}</h4>
                <p className="text-sm text-gray-600">{t('mission.joinDifference')}</p>
              </div>
            </div>
            <a href="/contact?tab=membership" className="btn-primary whitespace-nowrap">
              {t('mission.getInvolved')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MissionHighlights
