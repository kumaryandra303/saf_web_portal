import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Heart, Users, Briefcase } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const HeroSection = () => {
  const { t } = useLanguage()
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-saf-red-500 via-saf-red-600 to-saf-red-700">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 pattern-overlay opacity-20"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-saf-gold-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Shield className="w-5 h-5 text-saf-gold-400" />
              <span className="text-sm font-medium">{t('home.heroSubtitle')}</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                {t('home.heroTitle')}
              </h1>
              <div className="h-1 w-24 bg-saf-gold-400 rounded-full"></div>
            </div>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-100 leading-relaxed max-w-2xl">
              {t('home.heroSubtitle')}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-6">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">₹1Cr+</div>
                <div className="text-sm text-gray-200 mt-1">{t('home.corpusFund')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">1000+</div>
                <div className="text-sm text-gray-200 mt-1">{t('home.familiesSupported')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">50+</div>
                <div className="text-sm text-gray-200 mt-1">{t('home.programsActive')}</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/about"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white text-saf-red-600 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                {t('home.aboutSAF')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact?tab=membership"
                className="group inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-saf-red-600 transition-all duration-300"
              >
                {t('home.joinMission')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-8 border-t border-white/20">
              <p className="text-sm text-gray-200 mb-3">{t('home.patronage')}</p>
              <p className="text-lg font-semibold text-white">{t('home.minister')}</p>
            </div>
          </div>

          {/* Right Content - Logo Card */}
          <div className="relative hidden lg:block">
            <div className="relative">
              {/* Glowing Background */}
              <div className="absolute inset-0 bg-white/20 rounded-3xl blur-3xl"></div>
              
              {/* White Card with SAF Logo */}
              <div className="relative bg-white rounded-3xl p-12 shadow-2xl">
                <div className="space-y-8">
                  {/* SAF Logo Centered */}
                  <div className="flex justify-center">
                    <img 
                      src="/assets/saf_logo.jpeg" 
                      alt="SAF Logo" 
                      className="w-64 h-64 object-contain"
                    />
                  </div>

                  {/* Feature Icons */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center p-4 bg-saf-red-50 rounded-xl hover:bg-saf-red-100 transition-colors">
                      <Heart className="w-8 h-8 text-saf-red-600 mb-2" />
                      <span className="text-xs text-center text-saf-dark-900 font-medium">{t('home.welfare')}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-saf-red-50 rounded-xl hover:bg-saf-red-100 transition-colors">
                      <Users className="w-8 h-8 text-saf-red-600 mb-2" />
                      <span className="text-xs text-center text-saf-dark-900 font-medium">{t('home.community')}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-saf-red-50 rounded-xl hover:bg-saf-red-100 transition-colors">
                      <Briefcase className="w-8 h-8 text-saf-red-600 mb-2" />
                      <span className="text-xs text-center text-saf-dark-900 font-medium">{t('home.employment')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
