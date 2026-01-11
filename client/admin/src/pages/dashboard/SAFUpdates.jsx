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
import { FileText, Plus, X, Filter, RefreshCw, Eye, Edit, Trash2, Calendar } from 'lucide-react';
import 'devextreme/dist/css/dx.light.css';
import './SAFUpdates.css';
import baseApiService from '../../services/baseApiService';
import axios from 'axios';

const SAFUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewSidebarOpen, setViewSidebarOpen] = useState(false);
  const [formSidebarOpen, setFormSidebarOpen] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    year: '',
    month: ''
  });

  const [formData, setFormData] = useState({
    updt_ttl_en: '',
    updt_ttl_te: '',
    updt_cntnt_en: '',
    updt_cntnt_te: '',
    updt_typ_cd: 'announcement',
    updt_dt: '',
    img_1: null,
    img_2: null,
    img_3: null,
    img_1_pth: '',
    img_2_pth: '',
    img_3_pth: ''
  });

  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [isEditMode, setIsEditMode] = useState(false);

  const updateTypes = [
    { value: 'announcement', label: 'Announcement' },
    { value: 'fundsUtilization', label: 'Funds Utilization' },
    { value: 'communityEvent', label: 'Community Event' }
  ];

  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  useEffect(() => {
    fetchAvailableYears();
    fetchUpdates();
  }, []);

  useEffect(() => {
    fetchUpdates();
  }, [filters]);

  const fetchAvailableYears = async () => {
    try {
      const response = await baseApiService.get('/updates/years');
      if (response && response.status === 200) {
        setAvailableYears(response.data.map(item => item.year));
      }
    } catch (error) {
      console.error('Error fetching years:', error);
    }
  };

  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.year) params.append('year', filters.year);
      if (filters.month) params.append('month', filters.month);
      
      const route = params.toString() ? 
        `/updates/list?${params}` : 
        '/updates/list';
      
      const response = await baseApiService.get(route);
      if (response && response.status === 200) {
        setUpdates(response.data || []);
      } else {
        setUpdates([]);
      }
    } catch (error) {
      console.error('Error fetching updates:', error);
      setUpdates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleViewUpdate = async (updateId) => {
    try {
      const response = await baseApiService.get(`/updates/${updateId}`);
      if (response && response.status === 200) {
        setSelectedUpdate(response.data);
        setViewSidebarOpen(true);
      }
    } catch (error) {
      console.error('Error fetching update details:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to load update details'
      });
    }
  };

  const handleEditUpdate = async (updateId) => {
    try {
      const response = await baseApiService.get(`/updates/${updateId}`);
      if (response && response.status === 200) {
        const update = response.data;
        setFormData({
          updt_ttl_en: update.updt_ttl_en || '',
          updt_ttl_te: update.updt_ttl_te || '',
          updt_cntnt_en: update.updt_cntnt_en || '',
          updt_cntnt_te: update.updt_cntnt_te || '',
          updt_typ_cd: update.updt_typ_cd || 'announcement',
          updt_dt: update.updt_dt || '',
          img_1: null,
          img_2: null,
          img_3: null,
          img_1_pth: update.img_1_pth || '',
          img_2_pth: update.img_2_pth || '',
          img_3_pth: update.img_3_pth || ''
        });
        setSelectedUpdate(update);
        setIsEditMode(true);
        setFormSidebarOpen(true);
      }
    } catch (error) {
      console.error('Error fetching update for edit:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to load update for editing'
      });
    }
  };

  const handleAddNew = () => {
    setFormData({
      updt_ttl_en: '',
      updt_ttl_te: '',
      updt_cntnt_en: '',
      updt_cntnt_te: '',
      updt_typ_cd: 'announcement',
      updt_dt: '',
      img_1: null,
      img_2: null,
      img_3: null,
      img_1_pth: '',
      img_2_pth: '',
      img_3_pth: ''
    });
    setSelectedUpdate(null);
    setIsEditMode(false);
    setSubmitStatus({ type: '', message: '' });
    setFormSidebarOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, imageNumber) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [`img_${imageNumber}`]: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus({ type: '', message: '' });

    // Validate required fields
    if (!formData.updt_ttl_en || !formData.updt_ttl_te || !formData.updt_cntnt_en || 
        !formData.updt_cntnt_te || !formData.updt_typ_cd || !formData.updt_dt) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fill all required fields'
      });
      setLoading(false);
      return;
    }

    // Validate at least one image is uploaded (for new updates)
    if (!isEditMode && !formData.img_1 && !formData.img_2 && !formData.img_3) {
      setSubmitStatus({
        type: 'error',
        message: 'Please upload at least one image'
      });
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('updt_ttl_en', formData.updt_ttl_en);
      formDataToSend.append('updt_ttl_te', formData.updt_ttl_te);
      formDataToSend.append('updt_cntnt_en', formData.updt_cntnt_en);
      formDataToSend.append('updt_cntnt_te', formData.updt_cntnt_te);
      formDataToSend.append('updt_typ_cd', formData.updt_typ_cd);
      formDataToSend.append('updt_dt', formData.updt_dt);
      
      // Add existing image paths if not uploading new images (for edit mode)
      if (isEditMode) {
        if (!formData.img_1 && formData.img_1_pth) {
          formDataToSend.append('img_1_pth', formData.img_1_pth);
        }
        if (!formData.img_2 && formData.img_2_pth) {
          formDataToSend.append('img_2_pth', formData.img_2_pth);
        }
        if (!formData.img_3 && formData.img_3_pth) {
          formDataToSend.append('img_3_pth', formData.img_3_pth);
        }
      }
      
      // Add new image files
      if (formData.img_1) formDataToSend.append('img_1', formData.img_1);
      if (formData.img_2) formDataToSend.append('img_2', formData.img_2);
      if (formData.img_3) formDataToSend.append('img_3', formData.img_3);

      // Log FormData contents for debugging
      console.log('=== SUBMITTING UPDATE ===');
      console.log('Mode:', isEditMode ? 'Edit' : 'Create');
      console.log('Form Data:', {
        updt_ttl_en: formData.updt_ttl_en,
        updt_ttl_te: formData.updt_ttl_te,
        updt_typ_cd: formData.updt_typ_cd,
        updt_dt: formData.updt_dt,
        has_img_1: !!formData.img_1,
        has_img_2: !!formData.img_2,
        has_img_3: !!formData.img_3
      });

      // Use axios directly for FormData
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4901';
      const token = localStorage.getItem('saf_admin_token');
      
      const config = {
        headers: {
          // Don't set Content-Type - let axios set it automatically for FormData
          ...(token && { 'x-access-token': token })
        }
      };

      let response;
      const url = isEditMode 
        ? `${API_BASE_URL}/apiv1/updates/${selectedUpdate.saf_updt_id}`
        : `${API_BASE_URL}/apiv1/updates/create`;
      
      console.log('API URL:', url);
      console.log('Method:', isEditMode ? 'PUT' : 'POST');

      if (isEditMode && selectedUpdate) {
        // Update existing
        response = await axios.put(url, formDataToSend, config);
      } else {
        // Create new
        response = await axios.post(url, formDataToSend, config);
      }
      
      console.log('=== RESPONSE ===');
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      
      const responseData = response.data || response;

      if (responseData && (responseData.status === 200 || response.status === 200)) {
        setSubmitStatus({
          type: 'success',
          message: isEditMode ? 'Update modified successfully!' : 'Update created successfully!'
        });
        
        // Reset form
        setFormData({
          updt_ttl_en: '',
          updt_ttl_te: '',
          updt_cntnt_en: '',
          updt_cntnt_te: '',
          updt_typ_cd: 'announcement',
          updt_dt: '',
          img_1: null,
          img_2: null,
          img_3: null,
          img_1_pth: '',
          img_2_pth: '',
          img_3_pth: ''
        });
        
        // Refresh updates list
        fetchUpdates();
        
        // Close sidebar after 2 seconds
        setTimeout(() => {
          setFormSidebarOpen(false);
          setSubmitStatus({ type: '', message: '' });
          setIsEditMode(false);
        }, 2000);
      } else {
        throw new Error(responseData?.err_message || responseData?.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('=== UPDATE SUBMISSION ERROR ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Failed to save update. Please try again.';
      
      if (error.response) {
        // Server responded with error
        const errorData = error.response.data;
        errorMessage = errorData?.err_message || errorData?.message || errorMessage;
        console.error('Server error status:', error.response.status);
        console.error('Server error data:', errorData);
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'No response from server. Please check your connection.';
        console.error('No response received');
      } else {
        // Error in request setup
        errorMessage = error.message || errorMessage;
        console.error('Request setup error:', error.message);
      }
      
      setSubmitStatus({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (updateId) => {
    if (!window.confirm('Are you sure you want to delete this update?')) {
      return;
    }

    try {
      const response = await baseApiService.delete(`/updates/${updateId}`);
      if (response && response.status === 200) {
        setSubmitStatus({
          type: 'success',
          message: 'Update deleted successfully!'
        });
        fetchUpdates();
        setTimeout(() => setSubmitStatus({ type: '', message: '' }), 3000);
      }
    } catch (error) {
      console.error('Error deleting update:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to delete update. Please try again.'
      });
    }
  };

  const getUpdateTypeLabel = (type) => {
    const typeObj = updateTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  const getUpdateTypeColor = (type) => {
    switch(type) {
      case 'announcement': return 'bg-red-500';
      case 'fundsUtilization': return 'bg-green-500';
      case 'communityEvent': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading SAF Updates</h2>
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
      {/* Header Card */}
      <div className="bg-gradient-to-r from-saf-red-600 to-saf-red-700 rounded-xl shadow-2xl p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">SAF Updates Management</h1>
              <p className="text-white/90 mt-1 flex items-center gap-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {updates.length} Total Updates
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-white text-saf-red-600 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            <Plus className="h-5 w-5" />
            Add New Update
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Year:
            </label>
            <select
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
            >
              <option value="">All Years</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Month:
            </label>
            <select
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
            >
              <option value="">All Months</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>
          <div>
            <button
              onClick={fetchUpdates}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-saf-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-saf-red-700 transition-all shadow-md hover:shadow-lg font-medium disabled:opacity-50 h-[42px]"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Get Data
            </button>
          </div>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-saf-red-600" />
              Updates List
              <span className="bg-saf-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold ml-2">
                {updates.length} Records
              </span>
            </h3>
          </div>
        </div>

        <div className="p-6">
          <DataGrid
            dataSource={updates}
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
              placeholder="Search updates..." 
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
              dataField="updt_ttl_en" 
              caption="Title (English)" 
              minWidth={200}
              cellRender={(data) => (
                <div className="font-medium text-gray-900">{data.value}</div>
              )} 
            />
            <Column 
              dataField="updt_ttl_te" 
              caption="Title (Telugu)" 
              minWidth={200} 
            />
            <Column 
              dataField="updt_typ_cd" 
              caption="Type" 
              width={150}
              cellRender={(data) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getUpdateTypeColor(data.value)}`}>
                  {getUpdateTypeLabel(data.value)}
                </span>
              )} 
            />
            <Column 
              dataField="updt_dt" 
              caption="Date" 
              width={120} 
              alignment="center" 
            />
            <Column 
              dataField="crte_dt" 
              caption="Created" 
              width={180}
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
                    onClick={() => handleViewUpdate(data.data.saf_updt_id)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEditUpdate(data.data.saf_updt_id)}
                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(data.data.saf_updt_id)}
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
      {viewSidebarOpen && selectedUpdate && (
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
                    <h2 className="text-2xl font-bold text-white">Update Details</h2>
                    <p className="text-white/80 text-sm">View update information</p>
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
                <h3 className="font-bold text-gray-900 mb-1">Basic Information</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Type:</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white ${getUpdateTypeColor(selectedUpdate.updt_typ_cd)}`}>
                    {getUpdateTypeLabel(selectedUpdate.updt_typ_cd)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Date:</label>
                  <p className="text-gray-900">{selectedUpdate.updt_dt}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title (English):</label>
                <p className="text-lg font-bold text-gray-900">{selectedUpdate.updt_ttl_en}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title (Telugu):</label>
                <p className="text-lg font-bold text-gray-900">{selectedUpdate.updt_ttl_te}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Content (English):</label>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedUpdate.updt_cntnt_en}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Content (Telugu):</label>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedUpdate.updt_cntnt_te}</p>
                </div>
              </div>

              {(selectedUpdate.img_1_pth || selectedUpdate.img_2_pth || selectedUpdate.img_3_pth) && (
                <>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-l-4 border-saf-red-600">
                    <h3 className="font-bold text-gray-900 mb-1">Images</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {selectedUpdate.img_1_pth && (
                      <div>
                        <img 
                          src={selectedUpdate.img_1_pth.startsWith('http') ? selectedUpdate.img_1_pth : `${baseApiService.apiUrl}${selectedUpdate.img_1_pth}`}
                          alt="Update Image 1"
                          className="w-full h-auto rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.src = '/assets/saf_update_img1.jpeg';
                          }}
                        />
                      </div>
                    )}
                    {selectedUpdate.img_2_pth && (
                      <div>
                        <img 
                          src={selectedUpdate.img_2_pth.startsWith('http') ? selectedUpdate.img_2_pth : `${baseApiService.apiUrl}${selectedUpdate.img_2_pth}`}
                          alt="Update Image 2"
                          className="w-full h-auto rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.src = '/assets/saf_update_img2.jpeg';
                          }}
                        />
                      </div>
                    )}
                    {selectedUpdate.img_3_pth && (
                      <div>
                        <img 
                          src={selectedUpdate.img_3_pth.startsWith('http') ? selectedUpdate.img_3_pth : `${baseApiService.apiUrl}${selectedUpdate.img_3_pth}`}
                          alt="Update Image 3"
                          className="w-full h-auto rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.src = '/assets/saf_update_img3.jpeg';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="flex gap-4 pt-4 border-t-2">
                <button
                  onClick={() => {
                    setViewSidebarOpen(false);
                    handleEditUpdate(selectedUpdate.saf_updt_id);
                  }}
                  className="flex-1 bg-saf-red-600 text-white px-6 py-3 rounded-xl hover:bg-saf-red-700 transition-all font-bold"
                >
                  Edit Update
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
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {isEditMode ? 'Edit Update' : 'Add New Update'}
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
                {/* Basic Information */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-l-4 border-saf-red-600">
                  <h3 className="font-bold text-gray-900 mb-1">Basic Information</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Update Type <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="updt_typ_cd"
                      value={formData.updt_typ_cd}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                    >
                      {updateTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Update Date <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      name="updt_dt"
                      value={formData.updt_dt}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                    />
                  </div>
                </div>

                {/* Title Section */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-l-4 border-saf-red-600">
                  <h3 className="font-bold text-gray-900 mb-1">Title</h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title (English) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="updt_ttl_en"
                    value={formData.updt_ttl_en}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                    placeholder="Enter title in English"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title (Telugu) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="updt_ttl_te"
                    value={formData.updt_ttl_te}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                    placeholder="Enter title in Telugu"
                  />
                </div>

                {/* Content Section */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-l-4 border-saf-red-600">
                  <h3 className="font-bold text-gray-900 mb-1">Content</h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Content (English) <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    name="updt_cntnt_en"
                    value={formData.updt_cntnt_en}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all resize-none"
                    placeholder="Enter content in English"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Content (Telugu) <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    name="updt_cntnt_te"
                    value={formData.updt_cntnt_te}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all resize-none"
                    placeholder="Enter content in Telugu"
                  ></textarea>
                </div>

                {/* Images Section */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-l-4 border-saf-red-600">
                  <h3 className="font-bold text-gray-900 mb-1">Images (3 Required)</h3>
                  <p className="text-xs text-gray-600">Upload up to 3 images for this update</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Image 1 <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 1)}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                    />
                    {formData.img_1_pth && !formData.img_1 && (
                      <div className="mt-2">
                        <img 
                          src={formData.img_1_pth.startsWith('http') ? formData.img_1_pth : `${baseApiService.apiUrl}${formData.img_1_pth}`}
                          alt="Current" 
                          className="w-full h-24 object-cover rounded-lg" 
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Image 2 <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 2)}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                    />
                    {formData.img_2_pth && !formData.img_2 && (
                      <div className="mt-2">
                        <img 
                          src={formData.img_2_pth.startsWith('http') ? formData.img_2_pth : `${baseApiService.apiUrl}${formData.img_2_pth}`}
                          alt="Current" 
                          className="w-full h-24 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Image 3 <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 3)}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-saf-red-500 focus:border-saf-red-500 transition-all"
                    />
                    {formData.img_3_pth && !formData.img_3 && (
                      <div className="mt-2">
                        <img 
                          src={formData.img_3_pth.startsWith('http') ? formData.img_3_pth : `${baseApiService.apiUrl}${formData.img_3_pth}`}
                          alt="Current" 
                          className="w-full h-24 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
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
                        {isEditMode ? 'Updating...' : 'Creating...'}
                      </span>
                    ) : (
                      isEditMode ? '✓ Update Changes' : '✓ Create Update'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormSidebarOpen(false)}
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

export default SAFUpdates;

