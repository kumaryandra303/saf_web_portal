import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Mail, Phone, MapPin, Send, User, Calendar, Users } from 'lucide-react'

const Contact = () => {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('contact')
  const [formData, setFormData] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Form submitted! (This is a demo)')
  }

  return (
    <div className="pt-20 pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-saf-red-500 to-saf-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t('contact.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-100">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === 'contact' 
                  ? 'bg-saf-red-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('contact.title')}
            </button>
            <button
              onClick={() => setActiveTab('membership')}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === 'membership' 
                  ? 'bg-saf-red-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('membership.title')}
            </button>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      {activeTab === 'contact' && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-saf-dark-900 mb-6">
                    {t('contact.title')}
                  </h2>
                  <p className="text-lg text-gray-700 mb-8">
                    {t('contact.subtitle')}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-saf-red-100 p-3 rounded-lg">
                      <MapPin className="w-6 h-6 text-saf-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-saf-dark-900 mb-1">{t('contact.address')}</h3>
                      <p className="text-gray-600">Andhra Pradesh & Telangana, India</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-saf-red-100 p-3 rounded-lg">
                      <Phone className="w-6 h-6 text-saf-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-saf-dark-900 mb-1">{t('contact.callUs')}</h3>
                      <p className="text-gray-600">+91 XXXX-XXXXXX</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-saf-red-100 p-3 rounded-lg">
                      <Mail className="w-6 h-6 text-saf-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-saf-dark-900 mb-1">{t('contact.emailUs')}</h3>
                      <p className="text-gray-600">info@saf.org</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <img src="/assets/saf_logo.jpeg" alt="SAF Logo" className="w-32 h-32 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-center text-saf-dark-900 mb-2">
                    Settibalija Action Force
                  </h3>
                  <p className="text-center text-gray-600">
                    {t('home.heroSubtitle')}
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-saf-dark-900 mb-6">
                  {t('contact.send')}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.name')}
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                      placeholder={t('contact.name')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.email')}
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                      placeholder={t('contact.email')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.phone')}
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                      placeholder={t('contact.phone')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.message')}
                    </label>
                    <textarea
                      rows="5"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                      placeholder={t('contact.message')}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary w-full flex items-center justify-center">
                    <Send className="w-5 h-5 mr-2" />
                    {t('contact.send')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Membership Form (SAF Sabyam) */}
      {activeTab === 'membership' && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg">
              <div className="text-center mb-8">
                <Users className="w-16 h-16 text-saf-red-600 mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold text-saf-dark-900 mb-4">
                  {t('membership.title')}
                </h2>
                <p className="text-lg text-gray-600">
                  {t('membership.subtitle')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('membership.fullName')} *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                      placeholder={t('membership.fullName')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('membership.fatherName')} *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                      placeholder={t('membership.fatherName')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('membership.dateOfBirth')} *
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('membership.gender')} *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                    >
                      <option value="">{t('membership.gender')}</option>
                      <option value="male">{t('membership.male')}</option>
                      <option value="female">{t('membership.female')}</option>
                      <option value="other">{t('membership.other')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('membership.phone')} *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                      placeholder={t('membership.phone')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('membership.email')}
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                      placeholder={t('membership.email')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('membership.address')} *
                  </label>
                  <textarea
                    rows="3"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                    placeholder={t('membership.address')}
                  ></textarea>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('membership.city')} *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                      placeholder={t('membership.city')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('membership.district')} *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                      placeholder={t('membership.district')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('membership.pincode')} *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                      placeholder={t('membership.pincode')}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('membership.occupation')}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                      placeholder={t('membership.occupation')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('membership.education')}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                      placeholder={t('membership.education')}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="submit" className="btn-primary flex-1">
                    {t('membership.submit')}
                  </button>
                  <button type="reset" className="btn-secondary flex-1">
                    {t('membership.reset')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Contact
