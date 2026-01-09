import React, { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Users, Filter, Download, Search, RefreshCw } from 'lucide-react'
import safService from '../services/safService'

const Members = () => {
  const { t } = useLanguage()
  const [members, setMembers] = useState([])
  const [filteredMembers, setFilteredMembers] = useState([])
  const [districts, setDistricts] = useState([])
  const [mandals, setMandals] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    district_id: '',
    mandal_id: '',
    searchTerm: ''
  })

  // Fetch districts on mount
  useEffect(() => {
    fetchDistricts()
    fetchMembers()
  }, [])

  // Fetch mandals when district changes
  useEffect(() => {
    if (filters.district_id) {
      fetchMandals(filters.district_id)
    } else {
      setMandals([])
      setFilters(prev => ({ ...prev, mandal_id: '' }))
    }
  }, [filters.district_id])

  // Filter members when filters change
  useEffect(() => {
    filterMembers()
  }, [filters, members])

  const fetchDistricts = async () => {
    try {
      const response = await safService.getDistricts()
      if (response.status === 200 && response.data) {
        setDistricts(response.data)
      }
    } catch (error) {
      console.error('Error fetching districts:', error)
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

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const filterParams = {}
      if (filters.district_id) filterParams.district_id = filters.district_id
      if (filters.mandal_id) filterParams.mandal_id = filters.mandal_id

      const response = await safService.getMembersList(filterParams)
      if (response.status === 200 && response.data) {
        setMembers(response.data)
      }
    } catch (error) {
      console.error('Error fetching members:', error)
      setMembers([])
    } finally {
      setLoading(false)
    }
  }

  const filterMembers = () => {
    let filtered = [...members]

    // Search filter (client-side for better UX)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(member =>
        member.fll_nm?.toLowerCase().includes(searchLower) ||
        member.fthr_nm?.toLowerCase().includes(searchLower) ||
        member.phne_no?.includes(searchLower) ||
        member.dstrt_nm?.toLowerCase().includes(searchLower) ||
        member.mndl_nm?.toLowerCase().includes(searchLower)
      )
    }

    setFilteredMembers(filtered)
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleApplyFilters = () => {
    fetchMembers()
  }

  const handleResetFilters = () => {
    setFilters({
      district_id: '',
      mandal_id: '',
      searchTerm: ''
    })
    setTimeout(() => {
      fetchMembers()
    }, 100)
  }

  const exportToExcel = () => {
    if (filteredMembers.length === 0) {
      alert('No data to export')
      return
    }

    // Create CSV content
    const headers = [
      'S.No',
      'Member ID',
      'Full Name',
      'Father Name',
      'Date of Birth',
      'Gender',
      'Phone Number',
      'Email',
      'Address',
      'District',
      'Mandal',
      'Pincode',
      'Occupation',
      'Education',
      'Registration Date'
    ]

    const csvRows = []
    csvRows.push(headers.join(','))

    filteredMembers.forEach((member, index) => {
      const row = [
        index + 1,
        member.saf_mmbr_id,
        `"${member.fll_nm || ''}"`,
        `"${member.fthr_nm || ''}"`,
        member.dob_dt || '',
        member.gndr_cd || '',
        member.phne_no || '',
        member.eml_tx || '',
        `"${(member.adrs_tx || '').replace(/"/g, '""')}"`,
        `"${member.dstrt_nm || ''}"`,
        `"${member.mndl_nm || ''}"`,
        member.pncd_no || '',
        `"${member.occptn_tx || ''}"`,
        `"${member.edctn_tx || ''}"`,
        member.reg_dt || ''
      ]
      csvRows.push(row.join(','))
    })

    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    const timestamp = new Date().toISOString().split('T')[0]
    link.setAttribute('href', url)
    link.setAttribute('download', `SAF_Members_${timestamp}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="pt-20 pb-16 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-saf-red-500 to-saf-red-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Users className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            SAF Members
          </h1>
          <p className="text-xl text-gray-100">
            Complete list of Settibalija Action Force members
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-saf-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* District Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <select
                  name="district_id"
                  value={filters.district_id}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                >
                  <option value="">All Districts</option>
                  {districts.map(district => (
                    <option key={district.dstrt_id} value={district.dstrt_id}>
                      {district.dstrt_nm}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mandal Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mandal
                </label>
                <select
                  name="mandal_id"
                  value={filters.mandal_id}
                  onChange={handleFilterChange}
                  disabled={!filters.district_id}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">All Mandals</option>
                  {mandals.map(mandal => (
                    <option key={mandal.mndl_id} value={mandal.mndl_id}>
                      {mandal.mndl_nm}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="searchTerm"
                    value={filters.searchTerm}
                    onChange={handleFilterChange}
                    placeholder="Name, Phone..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-end gap-2">
                <button
                  onClick={handleApplyFilters}
                  disabled={loading}
                  className="flex-1 bg-saf-red-600 text-white px-4 py-2 rounded-lg hover:bg-saf-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Apply
                </button>
                <button
                  onClick={handleResetFilters}
                  disabled={loading}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats and Export Section */}
      <section className="py-4 bg-white border-t border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredMembers.length}</span> members
              {filters.district_id || filters.mandal_id || filters.searchTerm ? ' (filtered)' : ''}
            </div>
            <button
              onClick={exportToExcel}
              disabled={filteredMembers.length === 0}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export to Excel
            </button>
          </div>
        </div>
      </section>

      {/* Members Table */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 text-saf-red-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading members...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No members found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-saf-red-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">S.No</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Full Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Father Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">DOB</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Gender</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">District</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Mandal</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Occupation</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Registration</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMembers.map((member, index) => (
                      <tr 
                        key={member.saf_mmbr_id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {member.fll_nm}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {member.fthr_nm}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {member.dob_dt}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 capitalize">
                          {member.gndr_cd}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {member.phne_no}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {member.dstrt_nm}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {member.mndl_nm}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {member.occptn_tx || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {member.reg_dt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Members

