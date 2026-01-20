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
import { DollarSign, Plus, X, Filter, RefreshCw, Eye, Edit, Trash2, Calendar, FileSpreadsheet, XCircle } from 'lucide-react';
import 'devextreme/dist/css/dx.light.css';
import './SAFDonations.css';
import baseApiService from '../../services/baseApiService';

const SAFDonations = () => {
  const [donations, setDonations] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [filterMandals, setFilterMandals] = useState([]);
  const [formMandals, setFormMandals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewSidebarOpen, setViewSidebarOpen] = useState(false);
  const [formSidebarOpen, setFormSidebarOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    payment_method: '',
    payment_status: '',
    district_id: '',
    mandal_id: '',
    date_from: '',
    date_to: ''
  });

  const [formData, setFormData] = useState({
    donor_name: '',
    donor_phone: '',
    donor_email: '',
    fund_amount: '',
    payment_method: 'cash',
    upi_id: '',
    transaction_id: '',
    bank_name: '',
    cheque_no: '',
    payment_status: 'completed',
    district_id: '',
    mandal_id: '',
    description: '',
    receipt_image: null,
    receipt_image_path: '',
    payment_date: ''
  });

  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [isEditMode, setIsEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ show: false, message: '' });

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'upi', label: 'UPI' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'online', label: 'Online Payment' }
  ];

  const paymentStatuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' }
  ];

  // Helper function to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string' || imagePath.trim() === '') {
      return null;
    }
    
    // If already a full URL, return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If path starts with /docs, use it directly
    if (imagePath.startsWith('/docs/')) {
      return `${baseApiService.apiUrl}${imagePath}`;
    }
    
    // If it's just a filename, prepend the full path
    return `${baseApiService.apiUrl}/docs/funds/${imagePath}`;
  };

  useEffect(() => {
    try {
      fetchDistricts();
      fetchDonations();
      
      // Hide DevExpress evaluation message
      const hideLicenseMessage = () => {
        try {
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
          console.warn('License message hiding failed:', error);
        }
      };
      
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

  useEffect(() => {
    fetchDonations();
  }, [filters]);

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

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.payment_method) params.append('payment_method', filters.payment_method);
      if (filters.payment_status) params.append('payment_status', filters.payment_status);
      if (filters.district_id) params.append('district_id', filters.district_id);
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
      
      const route = params.toString() ? 
        `/funds/list?${params}` : 
        '/funds/list';
      
      const response = await baseApiService.get(route);
      if (response && response.status === 200) {
        setDonations(response.data || []);
      } else {
        setDonations([]);
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'district_id') {
      setFilters(prev => ({ ...prev, district_id: value, mandal_id: '' }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleResetFilters = () => {
    setFilters({
      payment_method: '',
      payment_status: '',
      district_id: '',
      mandal_id: '',
      date_from: '',
      date_to: ''
    });
    setTimeout(fetchDonations, 100);
  };

  const handleViewDonation = async (donationId) => {
    try {
      const response = await baseApiService.get(`/funds/${donationId}`);
      if (response && response.status === 200) {
        const donation = response.data;
        // Store raw image path from API (will be processed in render)
        setSelectedDonation({
          ...donation,
          rcpt_img_pth: (donation.rcpt_img_pth && typeof donation.rcpt_img_pth === 'string') ? donation.rcpt_img_pth.trim() : null
        });
        setViewSidebarOpen(true);
      }
    } catch (error) {
      console.error('Error fetching donation details:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to load donation details'
      });
    }
  };

  const handleEditDonation = async (donationId) => {
    try {
      const response = await baseApiService.get(`/funds/${donationId}`);
      if (response && response.status === 200) {
        const donation = response.data;
        setFormData({
          donor_name: donation.dntr_nm || '',
          donor_phone: donation.dntr_phne_no || '',
          donor_email: donation.dntr_eml_tx || '',
          fund_amount: donation.fund_amnt || '',
          payment_method: donation.pymnt_mthd || 'cash',
          upi_id: donation.upi_id || '',
          transaction_id: donation.trnsctn_id || '',
          bank_name: donation.bnk_nm || '',
          cheque_no: donation.chq_no || '',
          payment_status: donation.pymnt_stts || 'completed',
          district_id: donation.dstrt_id || '',
          mandal_id: donation.mndl_id || '',
          description: donation.fund_dscrptn_tx || '',
          receipt_image: null,
          receipt_image_path: (donation.rcpt_img_pth && typeof donation.rcpt_img_pth === 'string') ? donation.rcpt_img_pth.trim() : '',
          payment_date: donation.pymnt_dt || ''
        });
        setIsEditMode(true);
        setSelectedDonation(donation);
        setFormSidebarOpen(true);
      }
    } catch (error) {
      console.error('Error fetching donation for editing:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to load donation for editing'
      });
    }
  };

  const handleAddNew = () => {
    setFormData({
      donor_name: '',
      donor_phone: '',
      donor_email: '',
      fund_amount: '',
      payment_method: 'cash',
      upi_id: '',
      transaction_id: '',
      bank_name: '',
      cheque_no: '',
      payment_status: 'completed',
      district_id: '',
      mandal_id: '',
      description: '',
      receipt_image: null,
      receipt_image_path: '',
      payment_date: ''
    });
    setSelectedDonation(null);
    setIsEditMode(false);
    setSubmitStatus({ type: '', message: '' });
    setFormSidebarOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'district_id') {
      setFormData(prev => ({ ...prev, district_id: value, mandal_id: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        receipt_image: file,
        receipt_image_path: '' // Clear existing path when new file is selected
      }));
    }
  };

  const handleDeleteImage = () => {
    setFormData(prev => ({
      ...prev,
      receipt_image: null,
      receipt_image_path: ''
    }));
    // Reset the file input
    const fileInput = document.getElementById('receipt-image-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus({ type: '', message: '' });

    // Validate required fields
    if (!formData.donor_name || !formData.fund_amount || !formData.payment_method || !formData.payment_date) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fill all required fields'
      });
      setLoading(false);
      return;
    }

    // Validate UPI ID if payment method is UPI
    if (formData.payment_method === 'upi' && !formData.upi_id) {
      setSubmitStatus({
        type: 'error',
        message: 'UPI ID is required for UPI payments'
      });
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('donor_name', formData.donor_name);
      formDataToSend.append('donor_phone', formData.donor_phone || '');
      formDataToSend.append('donor_email', formData.donor_email || '');
      formDataToSend.append('fund_amount', formData.fund_amount);
      formDataToSend.append('payment_method', formData.payment_method);
      formDataToSend.append('upi_id', formData.upi_id || '');
      formDataToSend.append('transaction_id', formData.transaction_id || '');
      formDataToSend.append('bank_name', formData.bank_name || '');
      formDataToSend.append('cheque_no', formData.cheque_no || '');
      formDataToSend.append('payment_status', formData.payment_status);
      formDataToSend.append('district_id', formData.district_id || '');
      formDataToSend.append('mandal_id', formData.mandal_id || '');
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('payment_date', formData.payment_date);
      
      // Add existing image path if not uploading new image (for edit mode)
      if (isEditMode && !formData.receipt_image && formData.receipt_image_path) {
        formDataToSend.append('receipt_image_path', formData.receipt_image_path);
      }
      
      // Add new image file
      if (formData.receipt_image) {
        formDataToSend.append('receipt_image', formData.receipt_image);
      }

      // Use baseApiService for FormData (it handles FormData automatically)
      const route = isEditMode 
        ? `/funds/${selectedDonation.saf_fund_id}`
        : '/funds/create';

      const response = isEditMode
        ? await baseApiService.put(route, formDataToSend)
        : await baseApiService.post(route, formDataToSend);

      // Check for HTTP status 200
      if (response && (response.status === 200 || response.data?.status === 200)) {
        const successMsg = isEditMode ? 'Donation updated successfully!' : 'Donation added successfully!';
        
        // Close sidebar immediately
        setFormSidebarOpen(false);
        setSubmitStatus({ type: '', message: '' });
        
        // Show success message outside sidebar
        setSuccessMessage({ show: true, message: successMsg });
        
        // Reload grid data
        fetchDonations();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage({ show: false, message: '' });
        }, 3000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: response?.err_message || response?.message || 'Failed to save donation'
        });
      }
    } catch (error) {
      console.error('Error submitting donation:', error);
      setSubmitStatus({
        type: 'error',
        message: error?.err_message || error?.message || 'Failed to save donation. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (donationId) => {
    if (!window.confirm('Are you sure you want to delete this donation?')) {
      return;
    }

    try {
      const response = await baseApiService.delete(`/funds/${donationId}`);
      if (response && response.status === 200) {
        // Show success message and reload data
        setSuccessMessage({ show: true, message: 'Donation deleted successfully!' });
        fetchDonations();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage({ show: false, message: '' });
        }, 3000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: 'Failed to delete donation'
        });
      }
    } catch (error) {
      console.error('Error deleting donation:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to delete donation. Please try again.'
      });
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    const num = parseFloat(amount);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(2)}K`;
    return `₹${num.toFixed(2)}`;
  };

  const getPaymentMethodLabel = (method) => {
    const methodObj = paymentMethods.find(m => m.value === method);
    return methodObj ? methodObj.label : method;
  };

  const getPaymentMethodColor = (method) => {
    switch(method) {
      case 'cash': return 'bg-green-500';
      case 'upi': return 'bg-blue-500';
      case 'bank_transfer': return 'bg-purple-500';
      case 'cheque': return 'bg-orange-500';
      case 'online': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading SAF Donations</h2>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Success Message Toast */}
      {successMessage.show && (
        <div className="fixed top-20 right-6 z-50 animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
            <div className="bg-white/20 rounded-full p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold">{successMessage.message}</p>
            </div>
            <button
              onClick={() => setSuccessMessage({ show: false, message: '' })}
              className="text-white hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Header Card */}
      <div className="bg-gradient-to-r from-saf-red-600 to-saf-red-700 rounded-xl shadow-2xl p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <DollarSign className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">SAF Donations Management</h1>
              <p className="text-white/90 mt-1 flex items-center gap-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {donations.length} Total Donations
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-white text-saf-red-600 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            <Plus className="h-5 w-5" />
            Add New Donation
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Payment Method:
            </label>
            <select
              name="payment_method"
              value={filters.payment_method}
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
            >
              <option value="">All Methods</option>
              {paymentMethods.map(method => (
                <option key={method.value} value={method.value}>{method.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Payment Status:
            </label>
            <select
              name="payment_status"
              value={filters.payment_status}
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
            >
              <option value="">All Statuses</option>
              {paymentStatuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
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
              <option value="">All Districts</option>
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
              <option value="">All Mandals</option>
              {filterMandals.map(mandal => (
                <option key={mandal.mndl_id} value={mandal.mndl_id}>
                  {mandal.mndl_nm}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date From:
            </label>
            <input
              type="date"
              name="date_from"
              value={filters.date_from}
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date To:
            </label>
            <input
              type="date"
              name="date_to"
              value={filters.date_to}
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
            />
          </div>
          <div>
            <button
              onClick={fetchDonations}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-saf-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-saf-red-700 transition-all shadow-md hover:shadow-lg font-medium disabled:opacity-50 h-[42px]"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Get Data
            </button>
          </div>
          <div>
            <button
              onClick={handleResetFilters}
              className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-300 transition-all font-medium h-[42px]"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-saf-red-600" />
              Donations List
              <span className="bg-saf-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold ml-2">
                {donations.length} Records
              </span>
            </h3>
          </div>
        </div>

        <div className="p-6">
          <DataGrid
            dataSource={donations}
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
              placeholder="Search donations..." 
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
            
            <Column 
              dataField="sno" 
              caption="S.No" 
              width={80} 
              alignment="center" 
              cellRender={(data) => (
                <div className="font-semibold text-gray-700">{data.value}</div>
              )} 
            />
            <Column 
              dataField="dntr_nm" 
              caption="Donor Name" 
              minWidth={180}
              cellRender={(data) => (
                <div className="font-medium text-gray-900">{data.value}</div>
              )} 
            />
            <Column 
              dataField="dntr_phne_no" 
              caption="Phone" 
              width={130} 
            />
            <Column 
              dataField="fund_amnt" 
              caption="Amount (₹)" 
              width={150}
              alignment="right"
              cellRender={(data) => (
                <span className="font-semibold text-green-600">{formatCurrency(data.value)}</span>
              )} 
            />
            <Column 
              dataField="pymnt_mthd" 
              caption="Payment Method" 
              width={150}
              cellRender={(data) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getPaymentMethodColor(data.value)}`}>
                  {getPaymentMethodLabel(data.value)}
                </span>
              )} 
            />
            <Column 
              dataField="pymnt_stts" 
              caption="Status" 
              width={120}
              cellRender={(data) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  data.value === 'completed' ? 'bg-green-100 text-green-700' :
                  data.value === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {data.value}
                </span>
              )} 
            />
            <Column 
              dataField="dstrt_nm" 
              caption="District" 
              width={150} 
            />
            <Column 
              dataField="pymnt_dt" 
              caption="Payment Date" 
              width={180} 
              alignment="center"
              cellRender={(data) => (
                <span className="text-xs text-gray-600">{data.value}</span>
              )} 
            />
            <Column 
              caption="Actions" 
              width={150}
              alignment="center"
              cellRender={(data) => (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleViewDonation(data.data.saf_fund_id)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEditDonation(data.data.saf_fund_id)}
                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(data.data.saf_fund_id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )} 
            />
          </DataGrid>
        </div>
      </div>

      {/* View Sidebar */}
      {viewSidebarOpen && selectedDonation && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setViewSidebarOpen(false)}
          ></div>
          <div className="fixed right-0 top-0 h-full w-full md:w-[700px] bg-white shadow-2xl z-50 overflow-y-auto animate-slide-in">
            <div className="bg-gradient-to-r from-saf-red-600 to-saf-red-700 p-6 sticky top-0 z-10 shadow-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Donation Details</h2>
                    <p className="text-white/80 text-sm">View donation information</p>
                  </div>
                </div>
                <button
                  onClick={() => setViewSidebarOpen(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-l-4 border-saf-red-600">
                <h3 className="font-bold text-gray-900 mb-1">Donor Information</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Donor Name:</label>
                  <p className="text-lg font-bold text-gray-900">{selectedDonation.dntr_nm}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone:</label>
                  <p className="text-gray-900">{selectedDonation.dntr_phne_no || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email:</label>
                  <p className="text-gray-900">{selectedDonation.dntr_eml_tx || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Amount:</label>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedDonation.fund_amnt)}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-l-4 border-saf-red-600">
                <h3 className="font-bold text-gray-900 mb-1">Payment Information</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Method:</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white ${getPaymentMethodColor(selectedDonation.pymnt_mthd)}`}>
                    {getPaymentMethodLabel(selectedDonation.pymnt_mthd)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Status:</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedDonation.pymnt_stts === 'completed' ? 'bg-green-100 text-green-700' :
                    selectedDonation.pymnt_stts === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {selectedDonation.pymnt_stts}
                  </span>
                </div>
                {selectedDonation.upi_id && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">UPI ID:</label>
                    <p className="text-gray-900">{selectedDonation.upi_id}</p>
                  </div>
                )}
                {selectedDonation.trnsctn_id && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Transaction ID:</label>
                    <p className="text-gray-900">{selectedDonation.trnsctn_id}</p>
                  </div>
                )}
                {selectedDonation.bnk_nm && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Bank Name:</label>
                    <p className="text-gray-900">{selectedDonation.bnk_nm}</p>
                  </div>
                )}
                {selectedDonation.chq_no && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Cheque Number:</label>
                    <p className="text-gray-900">{selectedDonation.chq_no}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Date:</label>
                  <p className="text-gray-900">{selectedDonation.pymnt_dt}</p>
                </div>
              </div>

              {(selectedDonation.dstrt_nm || selectedDonation.mndl_nm) && (
                <>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-l-4 border-saf-red-600">
                    <h3 className="font-bold text-gray-900 mb-1">Location Information</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedDonation.dstrt_nm && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">District:</label>
                        <p className="text-gray-900">{selectedDonation.dstrt_nm}</p>
                      </div>
                    )}
                    {selectedDonation.mndl_nm && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Mandal:</label>
                        <p className="text-gray-900">{selectedDonation.mndl_nm}</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {selectedDonation.fund_dscrptn_tx && (
                <>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-l-4 border-saf-red-600">
                    <h3 className="font-bold text-gray-900 mb-1">Description</h3>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedDonation.fund_dscrptn_tx}</p>
                  </div>
                </>
              )}

              {selectedDonation.rcpt_img_pth && selectedDonation.rcpt_img_pth.trim() !== '' && (
                <>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-l-4 border-saf-red-600">
                    <h3 className="font-bold text-gray-900 mb-1">Receipt Image</h3>
                  </div>
                  <div className="relative bg-gray-100 rounded-lg border-2 border-gray-300 overflow-hidden aspect-square flex items-center justify-center">
                    <img 
                      src={getImageUrl(selectedDonation.rcpt_img_pth)}
                      alt="Receipt"
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        console.error('❌ Error loading receipt image:', {
                          path: selectedDonation.rcpt_img_pth,
                          url: getImageUrl(selectedDonation.rcpt_img_pth),
                          baseUrl: baseApiService.apiUrl
                        });
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400">Image not found</div>';
                      }}
                      onLoad={() => {
                        console.log('✅ Successfully loaded receipt image:', getImageUrl(selectedDonation.rcpt_img_pth));
                      }}
                    />
                  </div>
                </>
              )}

              <div className="flex gap-4 pt-4 border-t-2">
                <button
                  onClick={() => {
                    setViewSidebarOpen(false);
                    handleEditDonation(selectedDonation.saf_fund_id);
                  }}
                  className="flex-1 bg-saf-red-600 text-white px-6 py-3 rounded-xl hover:bg-saf-red-700 transition-all font-bold"
                >
                  Edit Donation
                </button>
                <button
                  onClick={() => setViewSidebarOpen(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-all font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Form Sidebar */}
      {formSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setFormSidebarOpen(false)}
          ></div>
          <div className="fixed right-0 top-0 h-full w-full md:w-[700px] bg-white shadow-2xl z-50 overflow-y-auto animate-slide-in">
            <div className="bg-gradient-to-r from-saf-red-600 to-saf-red-700 p-6 sticky top-0 z-10 shadow-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {isEditMode ? 'Edit Donation' : 'Add New Donation'}
                    </h2>
                    <p className="text-white/80 text-sm">Fill in the details below</p>
                  </div>
                </div>
                <button
                  onClick={() => setFormSidebarOpen(false)}
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
                {/* Donor Information Section */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-l-4 border-saf-red-600">
                  <h3 className="font-bold text-gray-900 mb-1">Donor Information</h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Donor Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="donor_name"
                    value={formData.donor_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                    placeholder="Enter donor name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="donor_phone"
                      value={formData.donor_phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="donor_email"
                      value={formData.donor_email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                {/* Payment Information Section */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-l-4 border-saf-red-600">
                  <h3 className="font-bold text-gray-900 mb-1">Payment Information</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fund Amount (₹) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      name="fund_amount"
                      value={formData.fund_amount}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                      placeholder="Enter amount"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Payment Method <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="payment_method"
                      value={formData.payment_method}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                    >
                      {paymentMethods.map(method => (
                        <option key={method.value} value={method.value}>{method.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {formData.payment_method === 'upi' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      UPI ID <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="upi_id"
                      value={formData.upi_id}
                      onChange={handleInputChange}
                      required={formData.payment_method === 'upi'}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                      placeholder="Enter UPI ID"
                    />
                  </div>
                )}

                {formData.payment_method === 'bank_transfer' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="bank_name"
                      value={formData.bank_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                      placeholder="Enter bank name"
                    />
                  </div>
                )}

                {formData.payment_method === 'cheque' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cheque Number
                    </label>
                    <input
                      type="text"
                      name="cheque_no"
                      value={formData.cheque_no}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                      placeholder="Enter cheque number"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Transaction ID
                    </label>
                    <input
                      type="text"
                      name="transaction_id"
                      value={formData.transaction_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                      placeholder="Enter transaction ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Payment Status <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="payment_status"
                      value={formData.payment_status}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                    >
                      {paymentStatuses.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Payment Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    name="payment_date"
                    value={formData.payment_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                  />
                </div>

                {/* Location Information Section */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-l-4 border-saf-red-600">
                  <h3 className="font-bold text-gray-900 mb-1">Location Information (Optional)</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      District
                    </label>
                    <select
                      name="district_id"
                      value={formData.district_id}
                      onChange={handleInputChange}
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
                      Mandal
                    </label>
                    <select
                      name="mandal_id"
                      value={formData.mandal_id}
                      onChange={handleInputChange}
                      disabled={!formData.district_id}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Mandal</option>
                      {formMandals.map(mandal => (
                        <option key={mandal.mndl_id} value={mandal.mndl_id}>
                          {mandal.mndl_nm}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description Section */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-l-4 border-saf-red-600">
                  <h3 className="font-bold text-gray-900 mb-1">Description (Optional)</h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes/Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all resize-none"
                    placeholder="Enter any additional notes or description"
                  ></textarea>
                </div>

                {/* Receipt Image Section */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-l-4 border-saf-red-600">
                  <h3 className="font-bold text-gray-900 mb-1">Receipt Image (Optional)</h3>
                  <p className="text-xs text-gray-600">Upload receipt or proof of payment</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Receipt Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    id="receipt-image-input"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => document.getElementById('receipt-image-input')?.click()}
                    className="relative bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden aspect-square flex items-center justify-center cursor-pointer hover:border-saf-red-500 hover:bg-gray-50 transition-all group max-w-md"
                  >
                    {(formData.receipt_image_path && formData.receipt_image_path.trim() !== '' && !formData.receipt_image) ? (
                      <>
                        <img 
                          src={getImageUrl(formData.receipt_image_path)}
                          alt="Receipt" 
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            console.error('❌ Error loading receipt image:', {
                              path: formData.receipt_image_path,
                              url: getImageUrl(formData.receipt_image_path),
                              baseUrl: baseApiService.apiUrl
                            });
                            e.target.style.display = 'none';
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage();
                          }}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700 z-10"
                          title="Delete Image"
                        >
                          <XCircle size={20} />
                        </button>
                      </>
                    ) : formData.receipt_image ? (
                      <>
                        <img 
                          src={URL.createObjectURL(formData.receipt_image)}
                          alt="Receipt Preview" 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage();
                          }}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700 z-10"
                          title="Delete Image"
                        >
                          <XCircle size={20} />
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <Plus className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 font-medium">Click to upload</p>
                        <p className="text-xs text-gray-400 mt-1">Receipt Image</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-saf-red-600 text-white px-6 py-3 rounded-xl hover:bg-saf-red-700 transition-all font-bold disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (isEditMode ? 'Update Donation' : 'Add Donation')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormSidebarOpen(false)}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-all font-bold"
                  >
                    Cancel
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

export default SAFDonations;

