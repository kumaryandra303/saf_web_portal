import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Heart, GraduationCap, Briefcase, Users, CheckCircle } from 'lucide-react'

const Programs = () => {
  const { t } = useLanguage()

  const programs = [
    {
      icon: Heart,
      title: t('programs.womenSupport'),
      description: t('programs.womenSupportDesc'),
      features: [
        t('programs.monthlyAid'),
        t('programs.healthcareSupport'),
        t('programs.skillTraining'),
        t('programs.legalAssistance')
      ],
      color: 'from-pink-500 to-rose-600',
      image: '/assets/saf_cmty_mmbr.jpeg'
    },
    {
      icon: GraduationCap,
      title: t('programs.youthEmpowerment'),
      description: t('programs.youthEmpowermentDesc'),
      features: [
        t('programs.technicalTraining'),
        t('programs.softSkills'),
        t('programs.certificationPrograms'),
        t('programs.mentorship')
      ],
      color: 'from-blue-500 to-indigo-600',
      image: '/assets/saf_peddalu.jpeg'
    },
    {
      icon: Briefcase,
      title: t('programs.employmentSupport'),
      description: t('programs.employmentSupportDesc'),
      features: [
        t('programs.jobPlacement'),
        t('programs.careerCounseling'),
        t('programs.interviewPrep'),
        t('programs.networkingEvents')
      ],
      color: 'from-green-500 to-emerald-600',
      image: '/assets/saf_cmty_mmbr.jpeg'
    },
    {
      icon: Users,
      title: t('programs.communityDevelopment'),
      description: t('programs.communityDevelopmentDesc'),
      features: [
        t('programs.educationSupport'),
        t('programs.healthCamps'),
        t('programs.culturalPrograms'),
        t('programs.infrastructure')
      ],
      color: 'from-orange-500 to-amber-600',
      image: '/assets/saf_peddalu.jpeg'
    }
  ]

  return (
    <div className="pt-20 pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-saf-red-500 to-saf-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t('programs.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto">
            {t('programs.subtitle')}
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {programs.map((program, index) => (
              <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className={index % 2 !== 0 ? 'lg:order-2' : ''}>
                  <img 
                    src={program.image} 
                    alt={program.title}
                    className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                  />
                </div>
                <div className={index % 2 !== 0 ? 'lg:order-1' : ''}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${program.color} rounded-2xl mb-6`}>
                    <program.icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-saf-dark-900 mb-4">
                    {program.title}
                  </h2>
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    {program.description}
                  </p>
                  <div className="space-y-3">
                    {program.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-saf-dark-900 mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('cta.subtitle')}
          </p>
          <a href="/contact?tab=membership" className="btn-primary inline-block">
            {t('cta.contactUs')}
          </a>
        </div>
      </section>
    </div>
  )
}

export default Programs
