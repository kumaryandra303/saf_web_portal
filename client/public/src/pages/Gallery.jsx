import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Image as ImageIcon, Play, X } from 'lucide-react'

const Gallery = () => {
  const { t } = useLanguage()
  const [selectedMedia, setSelectedMedia] = useState(null)

  const images = [
    { src: '/assets/saf_logo.jpeg', title: 'SAF Logo', type: 'image' },
    { src: '/assets/saf_cmty_mmbr.jpeg', title: 'Community Members', type: 'image' },
    { src: '/assets/saf_peddalu.jpeg', title: 'Community Event', type: 'image' },
  ]

  const videos = [
    { src: '/assets/saf_v_1.mp4', title: 'SAF Video 1', type: 'video' },
    { src: '/assets/saf_v_2.mp4', title: 'SAF Video 2', type: 'video' },
    { src: '/assets/saf_v_3.mp4', title: 'SAF Video 3', type: 'video' },
    { src: '/assets/saf_v_4.mp4', title: 'SAF Video 4', type: 'video' },
  ]

  const allMedia = [...images, ...videos]

  return (
    <div className="pt-20 pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-saf-red-500 to-saf-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t('gallery.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-100">
            {t('gallery.subtitle')}
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allMedia.map((media, index) => (
              <div
                key={index}
                className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                onClick={() => setSelectedMedia(media)}
              >
                {media.type === 'image' ? (
                  <img
                    src={media.src}
                    alt={media.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="relative w-full h-64 bg-gray-900">
                    <video
                      src={media.src}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Play className="w-16 h-16 text-white" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold">{media.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setSelectedMedia(null)}>
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setSelectedMedia(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            {selectedMedia.type === 'image' ? (
              <img src={selectedMedia.src} alt={selectedMedia.title} className="w-full h-auto rounded-lg" />
            ) : (
              <video src={selectedMedia.src} controls className="w-full h-auto rounded-lg" autoPlay />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery
