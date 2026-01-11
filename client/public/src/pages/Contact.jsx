import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { Mail, Phone, MapPin, Send, User, Calendar, Users } from 'lucide-react'
import safService from '../services/safService'

const Contact = () => {
  const { t } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('contact')
  const [formData, setFormData] = useState({
    full_name: '',
    father_name: '',
    dob: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    district_id: '',
    mandal_id: '',
    pincode: '',
    aadhar_no: '',
    occupation: '',
    education: ''
  })
  
  const [districts, setDistricts] = useState([])
  const [mandals, setMandals] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' })
  const [districtsLoaded, setDistrictsLoaded] = useState(false)

  // Check URL parameter on mount to open membership tab
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam === 'membership') {
      setActiveTab('membership')
      // Remove the query parameter from URL after setting the tab
      setSearchParams({}, { replace: true })
      // Scroll to membership form after a short delay
      setTimeout(() => {
        const membershipSection = document.getElementById('membership-form')
        if (membershipSection) {
          membershipSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }, [searchParams, setSearchParams])

  // Fetch districts only when membership tab is opened for the first time
  useEffect(() => {
    if (activeTab === 'membership' && !districtsLoaded) {
      fetchDistricts()
    }
  }, [activeTab, districtsLoaded])

  // Fetch mandals when district changes
  useEffect(() => {
    if (formData.district_id) {
      fetchMandals(formData.district_id)
    } else {
      setMandals([])
      setFormData(prev => ({ ...prev, mandal_id: '' }))
    }
  }, [formData.district_id])

  const fetchDistricts = async () => {
    try {
      const response = await safService.getDistricts()
      if (response.status === 200 && response.data) {
        setDistricts(response.data)
        setDistrictsLoaded(true) // Mark as loaded to prevent duplicate fetches
      }
    } catch (error) {
      console.error('Error fetching districts:', error)
      setSubmitStatus({
        type: 'error',
        message: 'Failed to load districts. Please refresh the page.'
      })
    }
  }

  const fetchMandals = async (districtId) => {
    try {
      const response = await safService.getMandalsByDistrict(districtId)
      if (response.status === 200 && response.data) {
        setMandals(response.data)
      }
    } catch (error) {
      console.error('Error fetching mandals:', error)
      setMandals([])
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()
    alert('Contact form submitted! (This is a demo)')
  }

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleMembershipSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSubmitStatus({ type: '', message: '' })

    try {
      // Load Razorpay SDK
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.')
      }

      // Create Razorpay order
      const orderResponse = await safService.createPaymentOrder()
      
      if (orderResponse.status !== 200 || !orderResponse.data) {
        throw new Error('Failed to create payment order. Please try again.')
      }

      const { order_id, amount, currency, key_id } = orderResponse.data

      // Razorpay payment options
      const options = {
        key: key_id,
        amount: amount * 100, // Amount in paise
        currency: currency,
        name: 'SAF Sabyam Membership',
        description: 'Settibalija Action Force Membership Fee',
        image: '/assets/saf_logo.jpeg',
        order_id: order_id,
        handler: async function (response) {
          try {
            // Payment successful, verify and submit membership
            const verifyResponse = await safService.verifyPaymentAndSubmit({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              memberData: formData
            })

            if (verifyResponse.status === 200) {
              setSubmitStatus({
                type: 'success',
                message: verifyResponse.data?.message || 'Payment successful! Welcome to SAF Sabyam.'
              })

              // Reset form
              setFormData({
                full_name: '',
                father_name: '',
                dob: '',
                gender: '',
                phone: '',
                email: '',
                address: '',
                district_id: '',
                mandal_id: '',
                pincode: '',
                aadhar_no: '',
                occupation: '',
                education: ''
              })

              // Scroll to top to show success message
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          } catch (verifyError) {
            console.error('Payment verification error:', verifyError)
            setSubmitStatus({
              type: 'error',
              message: verifyError.err_message || 'Payment verification failed. Please contact support.'
            })
            window.scrollTo({ top: 0, behavior: 'smooth' })
          } finally {
            setLoading(false)
          }
        },
        prefill: {
          name: formData.full_name,
          email: formData.email || '',
          contact: formData.phone
        },
        notes: {
          aadhar: formData.aadhar_no,
          district_id: formData.district_id,
          mandal_id: formData.mandal_id
        },
        theme: {
          color: '#DC2626' // SAF red color
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
            setSubmitStatus({
              type: 'error',
              message: 'Payment cancelled. Please try again to complete your membership.'
            })
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }
        }
      }

      // Open Razorpay payment modal
      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', function (response) {
        setLoading(false)
        setSubmitStatus({
          type: 'error',
          message: `Payment failed: ${response.error.description}. Please try again.`
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
      razorpay.open()
      
    } catch (error) {
      console.error('Membership submission error:', error)
      
      const errorMessage = error.message || 
                          error.err_message || 
                          'Failed to initiate payment. Please try again.'
      
      setSubmitStatus({
        type: 'error',
        message: errorMessage
      })
      
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      full_name: '',
      father_name: '',
      dob: '',
      gender: '',
      phone: '',
      email: '',
      address: '',
      district_id: '',
      mandal_id: '',
      pincode: '',
      aadhar_no: '',
      occupation: '',
      education: ''
    })
    setSubmitStatus({ type: '', message: '' })
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
                <form onSubmit={handleContactSubmit} className="space-y-6">
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
        <section id="membership-form" className="py-16 bg-gray-50">
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

              {/* Payment Info Banner */}
              <div className="mb-6 bg-gradient-to-r from-saf-red-50 to-saf-red-100 border-l-4 border-saf-red-600 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-saf-red-900">Membership Fee</h3>
                    <p className="text-sm text-saf-red-700">One-time registration payment</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-saf-red-600">₹20</p>
                    <p className="text-xs text-saf-red-600">Pay via UPI/Card/Net Banking</p>
                  </div>
                </div>
              </div>

              {/* Status Messages */}
              {submitStatus.message && (
                <div className={`mb-6 p-4 rounded-lg ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-100 border border-green-400 text-green-700' 
                    : 'bg-red-100 border border-red-400 text-red-700'
                }`}>
                  <p className="font-medium">{submitStatus.message}</p>
                </div>
              )}

              <form onSubmit={handleMembershipSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('membership.fullName')} *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
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
                      name="father_name"
                      value={formData.father_name}
                      onChange={handleInputChange}
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
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('membership.gender')} *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
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
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      maxLength="10"
                      pattern="[0-9]{10}"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                      placeholder="10 digit mobile number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('membership.email')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                      placeholder={t('membership.email')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aadhar Number *
                    </label>
                    <input
                      type="text"
                      name="aadhar_no"
                      value={formData.aadhar_no}
                      onChange={handleInputChange}
                      required
                      maxLength="12"
                      pattern="[0-9]{12}"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                      placeholder="12 digit Aadhar number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('membership.address')} *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                    placeholder={t('membership.address')}
                  ></textarea>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('membership.district')} *
                    </label>
                    <select
                      name="district_id"
                      value={formData.district_id}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                    >
                      <option value="">Select District</option>
                      {districts.map(district => (
                        <option key={district.dstrt_id} value={district.dstrt_id}>
                          {district.dstrt_nm}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mandal *
                    </label>
                    <select
                      name="mandal_id"
                      value={formData.mandal_id}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.district_id}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {formData.district_id ? 'Select Mandal' : 'First select district'}
                      </option>
                      {mandals.map(mandal => (
                        <option key={mandal.mndl_id} value={mandal.mndl_id}>
                          {mandal.mndl_nm}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('membership.pincode')} *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      maxLength="6"
                      pattern="[0-9]{6}"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                      placeholder="6 digit pincode"
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
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
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
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                      placeholder={t('membership.education')}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary flex-1 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Pay ₹20 & {t('membership.submit')}
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={handleReset}
                    disabled={loading}
                    className="btn-secondary flex-1 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {t('membership.reset')}
                  </button>
                </div>
                
                {/* Payment Security Info */}
                <div className="mt-4 text-center text-sm text-gray-600">
                  <p className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Secure payment powered by Razorpay
                  </p>
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
