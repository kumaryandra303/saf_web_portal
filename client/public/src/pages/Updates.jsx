import React, { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Bell, DollarSign, Calendar, Users2, TrendingUp, FileText, X, ChevronLeft, ChevronRight } from 'lucide-react'
import safService from '../services/safService'

const Updates = () => {
  const { t, language } = useLanguage()
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUpdate, setSelectedUpdate] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    fetchUpdates()
  }, [])

  const fetchUpdates = async () => {
    setLoading(true)
    try {
      const response = await safService.getUpdatesList()
      if (response && response.status === 200 && response.data) {
        // Map API data to component format
        const mappedUpdates = response.data.map(update => {
          // Get icon and color based on type
          let icon = Bell
          let color = 'bg-red-500'
          
          switch(update.updt_typ_cd) {
            case 'announcement':
              icon = Bell
              color = 'bg-red-500'
              break
            case 'fundsUtilization':
              icon = DollarSign
              color = 'bg-green-500'
              break
            case 'communityEvent':
              icon = Calendar
              color = 'bg-orange-500'
              break
            default:
              icon = Bell
              color = 'bg-blue-500'
          }

          // Format date
          const dateObj = new Date(update.updt_dt)
          const formattedDate = dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })

          // Get API base URL for images
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4901';
          const getImageUrl = (imgPath) => {
            if (!imgPath) return '/assets/saf_update_img1.jpeg';
            if (imgPath.startsWith('http')) return imgPath;
            return `${API_BASE_URL}${imgPath}`;
          };

          // Filter out default placeholder images
          const allImages = [
            update.img_1_pth ? getImageUrl(update.img_1_pth) : null,
            update.img_2_pth ? getImageUrl(update.img_2_pth) : null,
            update.img_3_pth ? getImageUrl(update.img_3_pth) : null
          ].filter(img => img !== null && !img.includes('/assets/saf_update_img1.jpeg'))

          return {
            type: t(`transparency.${update.updt_typ_cd}`) || update.updt_typ_cd,
            icon: icon,
            title: language === 'te' ? update.updt_ttl_te : update.updt_ttl_en,
            date: formattedDate,
            description: language === 'te' ? update.updt_cntnt_te : update.updt_cntnt_en,
            color: color,
            image: allImages.length > 0 ? allImages[0] : '/assets/saf_update_img1.jpeg',
            images: allImages.length > 0 ? allImages : ['/assets/saf_update_img1.jpeg']
          }
        })
        setUpdates(mappedUpdates)
      } else {
        setUpdates([])
      }
    } catch (error) {
      console.error('Error fetching updates:', error)
      setUpdates([])
    } finally {
      setLoading(false)
    }
  }

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
          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-saf-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-saf-dark-700 font-semibold">Loading updates...</p>
            </div>
          ) : updates.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No updates available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {updates.map((update, index) => (
                <div 
                  key={index} 
                  className="card overflow-hidden hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    setSelectedUpdate(update)
                    setCurrentImageIndex(0)
                  }}
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <img 
                        src={update.image} 
                        alt={update.title}
                        className="w-full h-full object-cover min-h-[200px]"
                        onError={(e) => {
                          e.target.src = '/assets/saf_update_img1.jpeg'
                        }}
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
                      <p className="text-gray-700 leading-relaxed line-clamp-3">{update.description}</p>
                      <button className="mt-4 text-saf-red-600 font-semibold hover:text-saf-red-700 transition-colors">
                        {t('transparency.readMore') || 'Read More'} →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

      {/* Update Detail Modal */}
      {selectedUpdate && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 overflow-y-auto"
          onClick={() => setSelectedUpdate(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full my-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              onClick={() => setSelectedUpdate(null)}
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>

            {/* Modal Content */}
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className={`${selectedUpdate.color} p-3 rounded-lg`}>
                  <selectedUpdate.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {selectedUpdate.type}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  {selectedUpdate.date}
                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-saf-dark-900 mb-6">
                {selectedUpdate.title}
              </h2>

              {/* Images Gallery */}
              {selectedUpdate.images && selectedUpdate.images.length > 0 && (
                <div className="mb-6">
                  <div className="relative">
                    <img 
                      src={selectedUpdate.images[currentImageIndex] || selectedUpdate.images[0]} 
                      alt={selectedUpdate.title}
                      className="w-full h-auto rounded-lg object-cover max-h-[500px]"
                      onError={(e) => {
                        e.target.src = '/assets/saf_update_img1.jpeg'
                      }}
                    />
                    
                    {/* Image Navigation */}
                    {selectedUpdate.images.length > 1 && (
                      <>
                        {currentImageIndex > 0 && (
                          <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                            onClick={(e) => {
                              e.stopPropagation()
                              setCurrentImageIndex(prev => prev - 1)
                            }}
                          >
                            <ChevronLeft className="w-6 h-6 text-gray-700" />
                          </button>
                        )}
                        {currentImageIndex < selectedUpdate.images.length - 1 && (
                          <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                            onClick={(e) => {
                              e.stopPropagation()
                              setCurrentImageIndex(prev => prev + 1)
                            }}
                          >
                            <ChevronRight className="w-6 h-6 text-gray-700" />
                          </button>
                        )}
                        
                        {/* Image Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                          {selectedUpdate.images.map((_, index) => (
                            <button
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setCurrentImageIndex(index)
                              }}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Gallery */}
                  {selectedUpdate.images.length > 1 && (
                    <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
                      {selectedUpdate.images.map((img, index) => (
                        <button
                          key={index}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            index === currentImageIndex 
                              ? 'border-saf-red-600 ring-2 ring-saf-red-200' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setCurrentImageIndex(index)
                          }}
                        >
                          <img 
                            src={img} 
                            alt={`${selectedUpdate.title} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/assets/saf_update_img1.jpeg'
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {selectedUpdate.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Updates
