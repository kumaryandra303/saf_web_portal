import React from 'react'
import { Link } from 'react-router-dom'
import { Image, ArrowRight } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const GalleryPreview = () => {
  const { t } = useLanguage()
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">{t('gallery.title')}</h2>
          <p className="section-subtitle mt-4">{t('gallery.subtitle')}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-square bg-gradient-to-br from-saf-red-100 to-saf-red-200 rounded-xl hover:scale-105 transition-all duration-300 flex items-center justify-center">
              <Image className="w-12 h-12 text-saf-red-400" />
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/gallery" className="btn-primary inline-flex items-center">
            {t('gallery.viewFullGallery')} <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default GalleryPreview
