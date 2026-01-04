import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Bell, DollarSign, Calendar, Users2, TrendingUp, FileText } from 'lucide-react'

const Updates = () => {
  const { t } = useLanguage()

  const updates = [
    {
      type: t('transparency.announcement'),
      icon: Bell,
      title: t('about.anniversaryTitle'),
      date: t('about.anniversaryDate'),
      description: t('about.anniversaryDesc') + ' ' + t('about.bloodDonationDesc'),
      color: 'bg-red-500',
      image: '/assets/saf_update_img1.jpeg'
    },
    {
      type: t('transparency.announcement'),
      icon: Bell,
      title: 'New Skill Development Program Launched',
      date: 'November 25, 2025',
      description: 'SAF launches comprehensive digital skills training for 200+ youth members across Andhra Pradesh and Telangana.',
      color: 'bg-blue-500',
      image: '/assets/saf_update_img2.jpeg'
    },
    {
      type: t('transparency.fundsUtilization'),
      icon: DollarSign,
      title: 'Q4 2024 Financial Report',
      date: 'November 20, 2025',
      description: '₹25 lakhs distributed to 500 single women across AP & Telangana. Complete transparency report available.',
      color: 'bg-green-500',
      image: '/assets/saf_update_img3.jpeg'
    },
    {
      type: t('transparency.communityEvent'),
      icon: Calendar,
      title: 'Annual Community Gathering 2025',
      date: 'November 15, 2025',
      description: 'Over 1000 community members participated in the annual SAF meet. Minister Vasamsetti Subhash addressed the gathering.',
      color: 'bg-orange-500',
      image: '/assets/saf_peddalu.jpeg'
    },
    {
      type: t('transparency.announcement'),
      icon: Bell,
      title: 'Employment Fair Success',
      date: 'November 10, 2025',
      description: '150+ job placements achieved through SAF employment facilitation program. Major companies participated.',
      color: 'bg-blue-500',
      image: '/assets/saf_cmty_mmbr.jpeg'
    },
    {
      type: t('transparency.communityEvent'),
      icon: Users2,
      title: 'Women Empowerment Workshop',
      date: 'November 5, 2025',
      description: '300+ women attended skill development and entrepreneurship workshop organized by SAF.',
      color: 'bg-pink-500',
      image: '/assets/saf_peddalu.jpeg'
    },
    {
      type: t('transparency.fundsUtilization'),
      icon: DollarSign,
      title: 'Healthcare Support Initiative',
      date: 'October 28, 2025',
      description: 'Free medical camps organized in 10 villages. 500+ community members received healthcare support.',
      color: 'bg-green-500',
      image: '/assets/saf_cmty_mmbr.jpeg'
    }
  ]

  const stats = [
    { icon: Users2, value: '1,000+', label: t('transparency.beneficiaries'), color: 'text-blue-600' },
    { icon: DollarSign, value: '₹1Cr+', label: t('transparency.fundsDeployed'), color: 'text-green-600' },
    { icon: TrendingUp, value: '50+', label: t('transparency.activePrograms'), color: 'text-orange-600' },
    { icon: FileText, value: '95%', label: t('transparency.successRate'), color: 'text-purple-600' }
  ]

  return (
    <div className="pt-20 pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-saf-red-500 to-saf-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t('transparency.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto">
            {t('transparency.subtitle')}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
                <stat.icon className={`w-10 h-10 ${stat.color} mx-auto mb-3`} />
                <div className="text-3xl font-bold text-saf-dark-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Updates Feed */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {updates.map((update, index) => (
              <div key={index} className="card overflow-hidden hover:scale-[1.02] transition-all duration-300">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <img 
                      src={update.image} 
                      alt={update.title}
                      className="w-full h-full object-cover min-h-[200px]"
                    />
                  </div>
                  <div className="md:col-span-2 p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`${update.color} p-3 rounded-lg`}>
                        <update.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                          {update.type}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-saf-dark-900 mb-2">{update.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Calendar className="w-4 h-4 mr-2" />
                      {update.date}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{update.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency Commitment */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FileText className="w-16 h-16 text-saf-red-600 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-saf-dark-900 mb-6">
            {t('transparency.transparencyCommitment')}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            {t('transparency.transparencyDesc')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="btn-secondary">{t('transparency.downloadReport')}</a>
            <a href="#" className="btn-secondary">{t('transparency.viewFinancials')}</a>
            <a href="#" className="btn-secondary">{t('transparency.impactAssessment')}</a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Updates
