import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, GraduationCap, Briefcase, Users, ArrowRight, CheckCircle } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const ProgramsPreview = () => {
  const { t } = useLanguage()
  
  const programs = [
    {
      icon: Heart,
      title: t('programs.womenSupport'),
      description: t('programs.womenSupportDesc'),
      features: [t('programs.monthlyAid'), t('programs.healthcareSupport'), t('programs.skillTraining'), t('programs.legalAssistance')],
      color: 'from-pink-500 to-rose-600',
      image: 'women-support'
    },
    {
      icon: GraduationCap,
      title: t('programs.youthEmpowerment'),
      description: t('programs.youthEmpowermentDesc'),
      features: [t('programs.technicalTraining'), t('programs.softSkills'), t('programs.certificationPrograms'), t('programs.mentorship')],
      color: 'from-blue-500 to-indigo-600',
      image: 'youth-training'
    },
    {
      icon: Briefcase,
      title: t('programs.employmentSupport'),
      description: t('programs.employmentSupportDesc'),
      features: [t('programs.jobPlacement'), t('programs.careerCounseling'), t('programs.interviewPrep'), t('programs.networkingEvents')],
      color: 'from-green-500 to-emerald-600',
      image: 'employment'
    },
    {
      icon: Users,
      title: t('programs.communityDevelopment'),
      description: t('programs.communityDevelopmentDesc'),
      features: [t('programs.educationSupport'), t('programs.healthCamps'), t('programs.culturalPrograms'), t('programs.infrastructure')],
      color: 'from-orange-500 to-amber-600',
      image: 'community'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-saf-red-100 px-4 py-2 rounded-full mb-4">
            <Briefcase className="w-5 h-5 text-saf-red-600" />
            <span className="text-sm font-semibold text-saf-red-600">{t('nav.programs')}</span>
          </div>
          <h2 className="section-title">{t('programs.title')}</h2>
          <p className="section-subtitle mt-4">
            {t('programs.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {programs.map((program, index) => (
            <div key={index} className="card group hover:shadow-2xl">
              <div className={`bg-gradient-to-br ${program.color} p-8 relative overflow-hidden`}>
                <div className="absolute inset-0 pattern-overlay opacity-10"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                    <program.icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="text-white text-right">
                    <div className="text-3xl font-bold">0{index + 1}</div>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-4">
                <h3 className="text-2xl font-bold text-saf-dark-900 group-hover:text-saf-red-600 transition-colors">
                  {program.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {program.description}
                </p>

                <div className="space-y-2 pt-4">
                  {program.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6">
                  <Link
                    to={`/programs#${program.image}`}
                    className="text-saf-red-600 font-semibold inline-flex items-center group-hover:gap-2 transition-all"
                  >
                    {t('programs.learnMore')}
                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/programs" className="btn-primary inline-flex items-center group">
            {t('programs.viewAllPrograms')}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ProgramsPreview
