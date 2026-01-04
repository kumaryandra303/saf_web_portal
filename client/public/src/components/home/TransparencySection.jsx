import React from 'react'
import { Link } from 'react-router-dom'
import { Bell, DollarSign, Calendar, TrendingUp, ArrowRight, FileText, Users2, Award } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const TransparencySection = () => {
  const { t } = useLanguage()
  
  const updates = [
    {
      type: t('transparency.announcement'),
      icon: Bell,
      title: 'New Skill Development Program Launched',
      date: 'November 25, 2025',
      description: 'SAF launches comprehensive digital skills training for 200+ youth members.',
      color: 'bg-blue-500'
    },
    {
      type: t('transparency.fundsUtilization'),
      icon: DollarSign,
      title: 'Q4 2024 Financial Report',
      date: 'November 20, 2025',
      description: '₹25 lakhs distributed to 500 single women across AP & Telangana.',
      color: 'bg-green-500'
    },
    {
      type: t('transparency.communityEvent'),
      icon: Calendar,
      title: 'Annual Community Gathering 2025',
      date: 'November 15, 2025',
      description: 'Over 1000 community members participated in the annual SAF meet.',
      color: 'bg-orange-500'
    }
  ]

  const stats = [
    { icon: Users2, value: '1,000+', label: t('transparency.beneficiaries'), color: 'text-blue-600' },
    { icon: DollarSign, value: '₹1Cr+', label: t('transparency.fundsDeployed'), color: 'text-green-600' },
    { icon: Award, value: '50+', label: t('transparency.activePrograms'), color: 'text-orange-600' },
    { icon: TrendingUp, value: '95%', label: t('transparency.successRate'), color: 'text-purple-600' }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mb-4">
            <FileText className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-green-600">{t('transparency.title')}</span>
          </div>
          <h2 className="section-title">{t('transparency.title')}</h2>
          <p className="section-subtitle mt-4">
            {t('transparency.subtitle')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <stat.icon className={`w-10 h-10 ${stat.color} mx-auto mb-3`} />
              <div className="text-3xl font-bold text-saf-dark-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Updates Feed */}
        <div className="space-y-6">
          {updates.map((update, index) => (
            <div key={index} className="card hover:scale-[1.02] transition-all duration-300">
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className={`${update.color} p-4 rounded-xl flex-shrink-0`}>
                    <update.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-grow space-y-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                          {update.type}
                        </span>
                        <h3 className="text-xl font-bold text-saf-dark-900">{update.title}</h3>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {update.date}
                      </div>
                    </div>
                    <p className="text-gray-600">{update.description}</p>
                  </div>

                  <Link to="/updates" className="btn-secondary whitespace-nowrap">
                    {t('transparency.readMore')}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/updates" className="btn-primary inline-flex items-center group">
            {t('transparency.viewAllUpdates')}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Transparency Commitment */}
        <div className="mt-16 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <FileText className="w-12 h-12 text-green-600 mx-auto" />
            <h3 className="text-2xl font-bold text-saf-dark-900">{t('transparency.transparencyCommitment')}</h3>
            <p className="text-gray-700 leading-relaxed">
              {t('transparency.transparencyDesc')}
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a href="#" className="text-green-600 font-semibold hover:underline">{t('transparency.downloadReport')}</a>
              <span className="text-gray-400">•</span>
              <a href="#" className="text-green-600 font-semibold hover:underline">{t('transparency.viewFinancials')}</a>
              <span className="text-gray-400">•</span>
              <a href="#" className="text-green-600 font-semibold hover:underline">{t('transparency.impactAssessment')}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TransparencySection
