import React, { useState, useEffect } from 'react';
import DataGrid, {
  Column,
  Paging,
  Pager,
  SearchPanel,
  HeaderFilter,
  FilterRow,
  Export,
  Selection,
  ColumnChooser
} from 'devextreme-react/data-grid';
import { Users, Plus, X, Filter, Download, RefreshCw, FileSpreadsheet } from 'lucide-react';
import 'devextreme/dist/css/dx.light.css';
import './SAFMembers.css';
import baseApiService from '../../services/baseApiService';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';

const SAFMembers = () => {
  const [members, setMembers] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [filterMandals, setFilterMandals] = useState([]);
  const [formMandals, setFormMandals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    district_id: '',
    mandal_id: ''
  });
  
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
    education: '',
    payment_type: 'cash',
    upi_id: ''
  });

  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  // Error boundary - catch any rendering errors
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading SAF Members</h2>
          <p className="text-red-600">{error.toString()}</p>
          <button
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    try {
      // Fetch data
      fetchDistricts();
      fetchMembers();
      
      // Hide DevExpress evaluation message (simplified and safe)
      const hideLicenseMessage = () => {
        try {
          // Only hide specific license message elements, not all divs
          const licenseSelectors = [
            '.dx-license-message',
            '.dx-license-message-container',
            '[class*="dx-license"]',
            '[id*="dx-license"]',
            '[data-dx-license]'
          ];
          
          licenseSelectors.forEach(selector => {
            try {
              const elements = document.querySelectorAll(selector);
              elements.forEach(el => {
                if (el && el.parentNode) {
                  el.style.display = 'none';
                  el.style.visibility = 'hidden';
                  el.style.opacity = '0';
                  el.style.pointerEvents = 'none';
                }
              });
            } catch (e) {
              // Ignore selector errors
            }
          });
        } catch (error) {
          // Silently fail - don't break the component
          console.warn('License message hiding failed:', error);
        }
      };
      
      // Hide after component mounts
      const timer1 = setTimeout(hideLicenseMessage, 100);
      const timer2 = setTimeout(hideLicenseMessage, 500);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } catch (err) {
      console.error('Error in useEffect:', err);
      setError(err);
    }
  }, []);

  // Fetch mandals when filter district changes
  useEffect(() => {
    if (filters.district_id) {
      fetchMandalsForFilter(filters.district_id);
    } else {
      setFilterMandals([]);
      setFilters(prev => ({ ...prev, mandal_id: '' }));
    }
  }, [filters.district_id]);

  // Fetch mandals when form district changes
  useEffect(() => {
    if (formData.district_id) {
      fetchMandalsForForm(formData.district_id);
    } else {
      setFormMandals([]);
      setFormData(prev => ({ ...prev, mandal_id: '' }));
    }
  }, [formData.district_id]);

  const fetchDistricts = async () => {
    try {
      const response = await baseApiService.get('/admin/get/districts');
      if (response && response.status === 200) {
        setDistricts(response.data || []);
      } else {
        setDistricts([]);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
      setDistricts([]);
      // Don't show error in submit status for initial load
    }
  };

  const fetchMandalsForFilter = async (districtId) => {
    try {
      const response = await baseApiService.get(`/admin/get/mandals/${districtId}`);
      if (response.status === 200) {
        setFilterMandals(response.data);
      } else {
        setFilterMandals([]);
      }
    } catch (error) {
      console.error('Error fetching mandals for filter:', error);
      setFilterMandals([]);
    }
  };

  const fetchMandalsForForm = async (districtId) => {
    try {
      const response = await baseApiService.get(`/admin/get/mandals/${districtId}`);
      if (response.status === 200) {
        setFormMandals(response.data);
      } else {
        setFormMandals([]);
      }
    } catch (error) {
      console.error('Error fetching mandals for form:', error);
      setFormMandals([]);
    }
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.district_id) params.append('district_id', filters.district_id);
      if (filters.mandal_id) params.append('mandal_id', filters.mandal_id);
      
      const route = params.toString() ? 
        `/saf/members/list?${params}` : 
        '/saf/members/list';
      
      const response = await baseApiService.get(route);
      if (response && response.status === 200) {
        setMembers(response.data || []);
      } else {
        setMembers([]);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      setMembers([]);
      // Only show error in status if it's a user action, not initial load
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'district_id') {
      // Reset mandal when district changes
      setFilters(prev => ({ ...prev, district_id: value, mandal_id: '' }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleApplyFilters = () => {
    fetchMembers();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'district_id') {
      // Reset mandal when district changes
      setFormData(prev => ({ ...prev, district_id: value, mandal_id: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const response = await baseApiService.post('/saf/admin/register-member', formData);

      if (response.status === 200) {
        setSubmitStatus({
          type: 'success',
          message: response.data?.message || 'Member registered successfully!'
        });
        
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
          education: '',
          payment_type: 'cash',
          upi_id: ''
        });
        
        // Refresh members list
        fetchMembers();
        
        // Close sidebar after 2 seconds
        setTimeout(() => {
          setSidebarOpen(false);
          setSubmitStatus({ type: '', message: '' });
        }, 2000);
      }
    } catch (error) {
      console.error('Member registration error:', error);
      setSubmitStatus({
        type: 'error',
        message: error.err_message || error.message || 'Failed to register member. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };


  const onExporting = (e) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('SAF Members');

    exportDataGrid({
      component: e.component,
      worksheet: worksheet,
      autoFilterEnabled: true
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'SAF_Members.xlsx');
      });
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-saf-red-600 to-saf-red-700 rounded-xl shadow-2xl p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <Users className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">SAF Members Management</h1>
              <p className="text-white/90 mt-1 flex items-center gap-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {members.length} Total Members
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 bg-white text-saf-red-600 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            <Plus className="h-5 w-5" />
            Add New Member
          </button>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-saf-red-100 p-2 rounded-lg">
            <Filter className="h-5 w-5 text-saf-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Search Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              District:
            </label>
            <select
              name="district_id"
              value={filters.district_id}
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mandal:
            </label>
            <select
              name="mandal_id"
              value={filters.mandal_id}
              onChange={handleFilterChange}
              disabled={!filters.district_id}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select Mandal</option>
              {filterMandals.map(mandal => (
                <option key={mandal.mndl_id} value={mandal.mndl_id}>
                  {mandal.mndl_nm}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              onClick={handleApplyFilters}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-saf-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-saf-red-700 transition-all shadow-md hover:shadow-lg font-medium disabled:opacity-50 h-[42px]"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Get Data
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                setFilters({ district_id: '', mandal_id: '' });
                setTimeout(fetchMembers, 100);
              }}
              className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-300 transition-all font-medium h-[42px]"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-saf-red-600" />
              SAF Members Data
              <span className="bg-saf-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold ml-2">
                {members.length} Records
              </span>
            </h3>
            <div className="flex gap-2">
              {/* <button
                onClick={() => {
                  const dataStr = JSON.stringify(members, null, 2);
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  saveAs(dataBlob, 'SAF_Members.json');
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md text-sm font-medium"
              >
                <Download className="h-4 w-4" />
                Export to PDF
              </button> */}
              <button
                onClick={() => {
                  const headers = ['S.No', 'Full Name', 'Father Name', 'DOB', 'Gender', 'Phone', 'Email', 'District', 'Mandal', 'Pincode', 'Occupation', 'Registration'];
                  const csvRows = [headers.join(',')];
                  members.forEach((member, index) => {
                    const row = [
                      index + 1,
                      `"${member.fll_nm || ''}"`,
                      `"${member.fthr_nm || ''}"`,
                      member.dob_dt || '',
                      member.gndr_cd || '',
                      member.phne_no || '',
                      member.eml_tx || '',
                      `"${member.dstrt_nm || ''}"`,
                      `"${member.mndl_nm || ''}"`,
                      member.pncd_no || '',
                      `"${member.occptn_tx || ''}"`,
                      member.reg_dt || ''
                    ];
                    csvRows.push(row.join(','));
                  });
                  const csvBlob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
                  saveAs(csvBlob, 'SAF_Members.csv');
                }}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all shadow-md text-sm font-medium"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export to Excel
              </button>
            </div>
          </div>
        </div>

        {/* DataGrid */}
        <div className="p-6">
          <DataGrid
            dataSource={members}
            showBorders={true}
            showRowLines={true}
            showColumnLines={false}
            rowAlternationEnabled={true}
            hoverStateEnabled={true}
            columnAutoWidth={true}
            allowColumnResizing={true}
            allowColumnReordering={true}
            className="saf-custom-grid"
          >
            <SearchPanel 
              visible={true} 
              width={300} 
              placeholder="Search members..." 
              highlightSearchText={true}
            />
            <HeaderFilter visible={true} />
            <ColumnChooser enabled={true} mode="select" />
            <Selection mode="multiple" showCheckBoxesMode="always" />
            <Paging defaultPageSize={15} />
            <Pager
              visible={true}
              displayMode="full"
              showPageSizeSelector={true}
              allowedPageSizes={[10, 15, 25, 50, 100]}
              showInfo={true}
              showNavigationButtons={true}
              infoText="Page {0} of {1} ({2} items)"
            />
            <Export enabled={true} allowExportSelectedData={true} />
            
            <Column dataField="sno" caption="S.No" width={80} alignment="center" cellRender={(data) => (
              <div className="font-semibold text-gray-700">{data.value}</div>
            )} />
            <Column dataField="fll_nm" caption="Full Name" minWidth={180} cellRender={(data) => (
              <div className="font-medium text-gray-900">{data.value}</div>
            )} />
            <Column dataField="fthr_nm" caption="Father Name" minWidth={180} />
            <Column dataField="dob_dt" caption="DOB" width={120} alignment="center" />
            <Column dataField="gndr_cd" caption="Gender" width={100} alignment="center" cellRender={(data) => (
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                data.value === 'male' ? 'bg-blue-100 text-blue-700' :
                data.value === 'female' ? 'bg-pink-100 text-pink-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {data.value}
              </span>
            )} />
            <Column dataField="phne_no" caption="Phone" width={130} />
            <Column dataField="eml_tx" caption="Email" minWidth={200} />
            <Column dataField="dstrt_nm" caption="District" width={150} />
            <Column dataField="mndl_nm" caption="Mandal" width={180} />
            <Column dataField="pncd_no" caption="Pincode" width={100} alignment="center" />
            <Column dataField="occptn_tx" caption="Occupation" width={150} />
            <Column dataField="reg_dt" caption="Registration" width={180} cellRender={(data) => (
              <span className="text-xs text-gray-600">{data.value}</span>
            )} />
          </DataGrid>
        </div>
      </div>

      {/* Enhanced Sidebar Form */}
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="fixed right-0 top-0 h-full w-full md:w-[650px] bg-white shadow-2xl z-50 overflow-y-auto animate-slide-in">
            <div className="bg-gradient-to-r from-saf-red-600 to-saf-red-700 p-6 sticky top-0 z-10 shadow-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Add New Member</h2>
                    <p className="text-white/80 text-sm">Fill in the details below</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {submitStatus.message && (
                <div className={`mb-6 p-4 rounded-xl border-l-4 ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 border-green-500 text-green-800' 
                    : 'bg-red-50 border-red-500 text-red-800'
                }`}>
                  <p className="font-semibold flex items-center gap-2">
                    {submitStatus.type === 'success' ? '✓' : '✕'} 
                    {submitStatus.message}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Personal Information Section */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-l-4 border-saf-red-600">
                  <h3 className="font-bold text-gray-900 mb-1">Personal Information</h3>
                  <p className="text-xs text-gray-600">Basic details of the member</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Father's Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="father_name"
                      value={formData.father_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                      placeholder="Enter father's name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date of Birth <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gender <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      maxLength="10"
                      pattern="[0-9]{10}"
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                      placeholder="10 digit number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Aadhar Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="aadhar_no"
                      value={formData.aadhar_no}
                      onChange={handleInputChange}
                      required
                      maxLength="12"
                      pattern="[0-9]{12}"
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                      placeholder="12 digit Aadhar number"
                    />
                  </div>
                </div>

                {/* Address Section */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-l-4 border-saf-red-600">
                  <h3 className="font-bold text-gray-900 mb-1">Address Information</h3>
                  <p className="text-xs text-gray-600">Location and contact details</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Address <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all resize-none"
                    placeholder="Enter complete address"
                  ></textarea>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      District <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="district_id"
                      value={formData.district_id}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                    >
                      <option value="">Select</option>
                      {districts.map(district => (
                        <option key={district.dstrt_id} value={district.dstrt_id}>
                          {district.dstrt_nm}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mandal <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="mandal_id"
                      value={formData.mandal_id}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.district_id}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select</option>
                      {formMandals.map(mandal => (
                        <option key={mandal.mndl_id} value={mandal.mndl_id}>
                          {mandal.mndl_nm}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pincode <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      maxLength="6"
                      pattern="[0-9]{6}"
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                      placeholder="6 digits"
                    />
                  </div>
                </div>

                {/* Professional Details */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-l-4 border-saf-red-600">
                  <h3 className="font-bold text-gray-900 mb-1">Professional Details</h3>
                  <p className="text-xs text-gray-600">Occupation and education (optional)</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Occupation
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                      placeholder="e.g., Business, Teacher"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Education
                    </label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                      placeholder="e.g., Graduate, Post Graduate"
                    />
                  </div>
                </div>

                {/* Payment Section */}
                <div className="bg-gradient-to-r from-saf-red-50 to-orange-50 p-5 rounded-xl border-2 border-saf-red-200">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    💰 Payment Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Payment Type <span className="text-red-600">*</span>
                      </label>
                      <select
                        name="payment_type"
                        value={formData.payment_type}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all bg-white"
                      >
                        <option value="cash">💵 Cash</option>
                        <option value="upi">📱 UPI</option>
                      </select>
                    </div>

                    {formData.payment_type === 'upi' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          UPI ID <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="upi_id"
                          value={formData.upi_id}
                          onChange={handleInputChange}
                          required={formData.payment_type === 'upi'}
                          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all bg-white"
                          placeholder="example@upi"
                        />
                      </div>
                    )}
                  </div>
                  <div className="mt-4 p-4 bg-white rounded-lg border-2 border-saf-red-300">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Membership Fee:</span>
                      <span className="text-2xl font-bold text-saf-red-600">₹20</span>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-6 border-t-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-saf-red-600 to-saf-red-700 text-white px-6 py-4 rounded-xl hover:from-saf-red-700 hover:to-saf-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        Registering...
                      </span>
                    ) : (
                      '✓ Register Member'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-300 transition-all font-bold text-lg"
                  >
                    ✕ Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SAFMembers;

