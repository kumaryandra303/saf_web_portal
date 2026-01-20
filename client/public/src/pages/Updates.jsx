import React, { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Bell, DollarSign, Calendar, Users2, TrendingUp, FileText, X, ChevronLeft, ChevronRight } from 'lucide-react'
import safService from '../services/safService'

const Updates = () => {
  const { t, language } = useLanguage()
  const [updates, setUpdates] = useState([])
  const [rawUpdates, setRawUpdates] = useState([]) // Store raw API data
  const [loading, setLoading] = useState(true)
  const [selectedUpdate, setSelectedUpdate] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Map raw updates to display format based on current language
  const mapUpdatesToDisplay = (rawData) => {
    return rawData.map(update => {
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
            if (!imgPath || typeof imgPath !== 'string') return null;
            const trimmedPath = imgPath.trim();
            if (trimmedPath === '' || trimmedPath === 'null' || trimmedPath === 'undefined') return null;
            if (trimmedPath.startsWith('http://') || trimmedPath.startsWith('https://')) return trimmedPath;
            // If path starts with /docs, use it directly with API_BASE_URL
            if (trimmedPath.startsWith('/docs/')) {
              return `${API_BASE_URL}${trimmedPath}`;
            }
            // If it's just a filename, prepend the full path
            return `${API_BASE_URL}/docs/updates/${trimmedPath}`;
          };

          // Get all valid images from API response
          // Use the exact field names from API: img_1_pth, img_2_pth, img_3_pth
          const imgPaths = [
            update.img_1_pth,
            update.img_2_pth,
            update.img_3_pth
          ];
          
          console.log('🖼️ Processing images for update ID:', update.saf_updt_id, {
            'Raw img_1_pth': update.img_1_pth,
            'Raw img_2_pth': update.img_2_pth,
            'Raw img_3_pth': update.img_3_pth,
            'img_1_pth type': typeof update.img_1_pth,
            'img_1_pth truthy': !!update.img_1_pth,
            'All update keys': Object.keys(update)
          });
          
          // Process each image path
          const allImages = imgPaths
            .map((imgPath, index) => {
              if (!imgPath) {
                console.log(`  Image ${index + 1}: null/undefined`);
                return null;
              }
              
              const pathType = typeof imgPath;
              if (pathType !== 'string') {
                console.log(`  Image ${index + 1}: not a string (${pathType})`, imgPath);
                return null;
              }
              
              const trimmed = imgPath.trim();
              if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') {
                console.log(`  Image ${index + 1}: empty or invalid string`);
                return null;
              }
              
              const url = getImageUrl(trimmed);
              console.log(`  ✅ Image ${index + 1}: "${trimmed}" → "${url}"`);
              return url;
            })
            .filter(url => url !== null);

          // Debug logging
          console.log(`📊 Update ${update.saf_updt_id} - Found ${allImages.length} valid images:`, allImages);
          
          if (allImages.length === 0) {
            console.warn(`⚠️ No valid images for update ${update.saf_updt_id}`);
          }

      const mappedUpdate = {
        ...update, // Keep all original fields for reference (including img_1_pth, img_2_pth, img_3_pth)
        type: t(`transparency.${update.updt_typ_cd}`) || update.updt_typ_cd,
        icon: icon,
        title: language === 'te' ? (update.updt_ttl_te || update.updt_ttl_en) : (update.updt_ttl_en || update.updt_ttl_te),
        date: formattedDate,
        description: language === 'te' ? (update.updt_cntnt_te || update.updt_cntnt_en) : (update.updt_cntnt_en || update.updt_cntnt_te),
        color: color,
        image: allImages.length > 0 ? allImages[0] : null,
        images: allImages.length > 0 ? allImages : []
      };
      
      // Final verification
      if (allImages.length > 0) {
        console.log(`✅ Mapped update ${update.saf_updt_id}:`, {
          'image property': mappedUpdate.image,
          'images array length': mappedUpdate.images.length,
          'first image URL': mappedUpdate.images[0]
        });
      }
      
      return mappedUpdate;
    })
  }

  useEffect(() => {
    fetchUpdates()
  }, [])

  // Re-map updates when language changes
  useEffect(() => {
    if (rawUpdates.length > 0) {
      const remappedUpdates = mapUpdatesToDisplay(rawUpdates)
      setUpdates(remappedUpdates)
      
      // Update selected update if one is selected
      if (selectedUpdate) {
        const updatedSelected = remappedUpdates.find(u => u.saf_updt_id === selectedUpdate.saf_updt_id)
        if (updatedSelected) {
          setSelectedUpdate(updatedSelected)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, rawUpdates])

  const fetchUpdates = async () => {
    setLoading(true)
    try {
      const response = await safService.getUpdatesList()
      
      console.log('🔍 Raw API Response:', JSON.stringify(response, null, 2));
      console.log('🔍 Response Type:', typeof response);
      console.log('🔍 Is Array:', Array.isArray(response));
      if (response && typeof response === 'object') {
        console.log('🔍 Response Keys:', Object.keys(response));
      }
      
      // Handle different response structures
      // baseApiService.get() returns response.data from axios
      // The API likely returns {status: 200, data: [...]} format
      let updatesData = []
      
      // Try all possible structures
      if (Array.isArray(response)) {
        // Direct array
        updatesData = response
        console.log('✅ Using direct array response, count:', updatesData.length);
      } else if (response && response.status === 200 && Array.isArray(response.data)) {
        // {status: 200, data: [...]}
        updatesData = response.data
        console.log('✅ Using response.data (status 200), count:', updatesData.length);
      } else if (response && Array.isArray(response.data)) {
        // {data: [...]}
        updatesData = response.data
        console.log('✅ Using response.data, count:', updatesData.length);
      } else if (response && response.data && Array.isArray(response.data.data)) {
        // {data: {data: [...]}}
        updatesData = response.data.data
        console.log('✅ Using response.data.data, count:', updatesData.length);
      } else {
        console.error('❌ Could not extract updates array from response');
        console.error('Response structure:', response);
        updatesData = []
      }
      
      // Log first update to see structure and images
      if (updatesData.length > 0) {
        const firstUpdate = updatesData[0];
        console.log('📋 First Update (Full):', JSON.stringify(firstUpdate, null, 2));
        console.log('📋 First Update Images Check:', {
          'has img_1_pth': !!firstUpdate.img_1_pth,
          'img_1_pth value': firstUpdate.img_1_pth,
          'img_1_pth type': typeof firstUpdate.img_1_pth,
          'has img_2_pth': !!firstUpdate.img_2_pth,
          'img_2_pth value': firstUpdate.img_2_pth,
          'has img_3_pth': !!firstUpdate.img_3_pth,
          'img_3_pth value': firstUpdate.img_3_pth,
          'all keys': Object.keys(firstUpdate)
        });
      } else {
        console.warn('⚠️ No updates data found in response');
      }
      
      if (updatesData.length > 0) {
        // Store raw data (preserve original structure)
        setRawUpdates(updatesData)
        // Map to display format
        const mappedUpdates = mapUpdatesToDisplay(updatesData)
        console.log('📸 Mapped Updates Summary:', mappedUpdates.map(u => ({
          saf_updt_id: u.saf_updt_id,
          title: u.title,
          image: u.image,
          imagesCount: u.images ? u.images.length : 0,
          'has images': u.images && u.images.length > 0
        })));
        setUpdates(mappedUpdates)
      } else {
        console.warn('⚠️ Setting empty updates array');
        setUpdates([])
        setRawUpdates([])
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
                      {update.image ? (
                        <img 
                          src={update.image} 
                          alt={update.title}
                          className="w-full h-full object-cover min-h-[200px]"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            console.error('❌ Error loading image:', {
                              'update.image': update.image,
                              'update.images[0]': update.images?.[0],
                              'update.img_1_pth': update.img_1_pth,
                              'update.saf_updt_id': update.saf_updt_id,
                              'attempted src': e.target.src
                            });
                            e.target.style.display = 'none';
                          }}
                          onLoad={(e) => {
                            console.log('✅ Successfully loaded image:', e.target.src, 'for update:', update.saf_updt_id);
                          }}
                        />
                      ) : (
                        <div className="w-full h-full min-h-[200px] bg-gray-200 flex items-center justify-center">
                          <FileText className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
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
                      crossOrigin="anonymous"
                      onError={(e) => {
                        console.error('❌ Error loading modal image:', e.target.src);
                        e.target.style.display = 'none';
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
                            crossOrigin="anonymous"
                            onError={(e) => {
                              console.error('❌ Error loading thumbnail:', e.target.src);
                              e.target.style.display = 'none';
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
