import React, { useState, useEffect } from 'react';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { FileSpreadsheet, RefreshCw, Filter, Calendar } from 'lucide-react';
import baseApiService from '../../services/baseApiService';
import './Reports.css';

const Reports = () => {
  const [reportData, setReportData] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [mandals, setMandals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const [filters, setFilters] = useState({
    district_id: '',
    mandal_id: '',
    date_from: '',
    date_to: '',
    date_range: '',
    payment_method: ''
  });

  const paymentMethods = [
    { value: '', label: 'All Payment Methods' },
    { value: 'cash', label: 'Cash' },
    { value: 'upi', label: 'UPI' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'online', label: 'Online Payment' }
  ];

  const dateRanges = [
    { value: '', label: 'Select Date Range' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last_7_days', label: 'Last 7 Days' },
    { value: 'last_30_days', label: 'Last 30 Days' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'this_year', label: 'This Year' }
  ];

  useEffect(() => {
    fetchDistricts();
    fetchReports();
  }, []);

  useEffect(() => {
    fetchReports();
  }, [filters]);

  useEffect(() => {
    if (filters.district_id) {
      fetchMandals(filters.district_id);
    } else {
      setMandals([]);
      setFilters(prev => ({ ...prev, mandal_id: '' }));
    }
  }, [filters.district_id]);

  useEffect(() => {
    if (filters.date_range) {
      applyDateRange(filters.date_range);
    }
  }, [filters.date_range]);

  const applyDateRange = (range) => {
    const today = new Date();
    let fromDate = '';
    let toDate = '';

    switch (range) {
      case 'today':
        fromDate = toDate = today.toISOString().split('T')[0];
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        fromDate = toDate = yesterday.toISOString().split('T')[0];
        break;
      case 'last_7_days':
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);
        fromDate = last7Days.toISOString().split('T')[0];
        toDate = today.toISOString().split('T')[0];
        break;
      case 'last_30_days':
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);
        fromDate = last30Days.toISOString().split('T')[0];
        toDate = today.toISOString().split('T')[0];
        break;
      case 'this_month':
        fromDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        toDate = today.toISOString().split('T')[0];
        break;
      case 'last_month':
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        fromDate = lastMonth.toISOString().split('T')[0];
        toDate = lastDayOfLastMonth.toISOString().split('T')[0];
        break;
      case 'this_year':
        fromDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
        toDate = today.toISOString().split('T')[0];
        break;
      default:
        return;
    }

    setFilters(prev => ({
      ...prev,
      date_from: fromDate,
      date_to: toDate
    }));
  };

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

  const fetchMandals = async (districtId) => {
    try {
      const response = await baseApiService.get(`/admin/get/mandals/${districtId}`);
      if (response.status === 200) {
        setMandals(response.data || []);
      } else {
        setMandals([]);
      }
    } catch (error) {
      console.error('Error fetching mandals:', error);
      setMandals([]);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.district_id) params.append('district_id', filters.district_id);
      if (filters.mandal_id) params.append('mandal_id', filters.mandal_id);
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
      if (filters.payment_method) params.append('payment_method', filters.payment_method);

      const queryString = params.toString();
      const url = `/reports/get${queryString ? '?' + queryString : ''}`;
      
      const response = await baseApiService.get(url);
      
      if (response && response.status === 200) {
        setReportData(response.data || []);
      } else {
        setReportData([]);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to fetch report data. Please try again.');
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      district_id: '',
      mandal_id: '',
      date_from: '',
      date_to: '',
      date_range: '',
      payment_method: ''
    });
    setSearchTerm('');
  };

  const handleExport = async () => {
    try {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Reports');

      // Define columns
      worksheet.columns = [
        { header: 'S.No', key: 'sno', width: 10 },
        { header: 'Member Name', key: 'member_name', width: 25 },
        { header: 'Phone', key: 'phone', width: 15 },
        { header: 'District', key: 'district_name', width: 20 },
        { header: 'Mandal', key: 'mandal_name', width: 20 },
        { header: 'Payment Method', key: 'payment_method', width: 18 },
        { header: 'Payment Amount', key: 'payment_amount', width: 18 },
        { header: 'Payment Date', key: 'payment_date', width: 18 },
        { header: 'Payment Status', key: 'payment_status', width: 18 }
      ];

      // Style header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE5E7EB' }
      };

      // Add data rows
      filteredData.forEach((row, index) => {
        worksheet.addRow({
          sno: index + 1,
          member_name: row.member_name || '-',
          phone: row.phone || '-',
          district_name: row.district_name || '-',
          mandal_name: row.mandal_name || '-',
          payment_method: row.payment_method ? row.payment_method.toUpperCase() : '-',
          payment_amount: row.payment_amount ? `₹${row.payment_amount}` : '₹0',
          payment_date: row.payment_date ? new Date(row.payment_date).toLocaleDateString() : '-',
          payment_status: row.payment_status || '-'
        });
      });

      // Generate buffer and save
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `Reports_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const filteredData = reportData.filter(row => {
    const searchLower = searchTerm.toLowerCase();
    return (
      !searchTerm ||
      (row.member_name && row.member_name.toLowerCase().includes(searchLower)) ||
      (row.district_name && row.district_name.toLowerCase().includes(searchLower)) ||
      (row.mandal_name && row.mandal_name.toLowerCase().includes(searchLower)) ||
      (row.payment_method && row.payment_method.toLowerCase().includes(searchLower)) ||
      (row.phone && row.phone.toString().includes(searchTerm))
    );
  });

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1 className="reports-title">Reports</h1>
        <p className="reports-subtitle">View and export payment and member reports</p>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-header">
          <Filter className="filter-icon" />
          <h2>Filters</h2>
          <button
            onClick={handleResetFilters}
            className="reset-filters-btn"
            title="Reset all filters"
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>

        <div className="filters-grid">
          {/* District Filter */}
          <div className="filter-group">
            <label htmlFor="district_filter">District</label>
            <select
              id="district_filter"
              value={filters.district_id}
              onChange={(e) => handleFilterChange('district_id', e.target.value)}
              className="filter-select"
            >
              <option value="">All Districts</option>
              {districts.map((district) => (
                <option key={district.dstrt_id} value={district.dstrt_id}>
                  {district.dstrt_nm}
                </option>
              ))}
            </select>
          </div>

          {/* Mandal Filter */}
          <div className="filter-group">
            <label htmlFor="mandal_filter">Mandal</label>
            <select
              id="mandal_filter"
              value={filters.mandal_id}
              onChange={(e) => handleFilterChange('mandal_id', e.target.value)}
              className="filter-select"
              disabled={!filters.district_id}
            >
              <option value="">All Mandals</option>
              {mandals.map((mandal) => (
                <option key={mandal.mndl_id} value={mandal.mndl_id}>
                  {mandal.mndl_nm}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="filter-group">
            <label htmlFor="date_range_filter">Date Range</label>
            <select
              id="date_range_filter"
              value={filters.date_range}
              onChange={(e) => handleFilterChange('date_range', e.target.value)}
              className="filter-select"
            >
              {dateRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* From Date */}
          <div className="filter-group">
            <label htmlFor="date_from_filter">From Date</label>
            <input
              type="date"
              id="date_from_filter"
              value={filters.date_from}
              onChange={(e) => handleFilterChange('date_from', e.target.value)}
              className="filter-input"
            />
          </div>

          {/* To Date */}
          <div className="filter-group">
            <label htmlFor="date_to_filter">To Date</label>
            <input
              type="date"
              id="date_to_filter"
              value={filters.date_to}
              onChange={(e) => handleFilterChange('date_to', e.target.value)}
              className="filter-input"
            />
          </div>

          {/* Payment Method Filter */}
          <div className="filter-group">
            <label htmlFor="payment_method_filter">Payment Method</label>
            <select
              id="payment_method_filter"
              value={filters.payment_method}
              onChange={(e) => handleFilterChange('payment_method', e.target.value)}
              className="filter-select"
            >
              {paymentMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Search and Export Section */}
      <div className="actions-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, district, mandal, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button
          onClick={handleExport}
          disabled={loading || !filteredData.length}
          className="export-btn"
        >
          <FileSpreadsheet size={18} />
          Export Excel
        </button>
      </div>

      {/* Report Table */}
      <div className="report-table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading report data...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
          </div>
        ) : filteredData.length > 0 ? (
          <>
            <div className="table-wrapper">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Member Name</th>
                    <th>Phone</th>
                    <th>District</th>
                    <th>Mandal</th>
                    <th>Payment Method</th>
                    <th>Payment Amount</th>
                    <th>Payment Date</th>
                    <th>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                    <tr key={index}>
                      <td>{(page * rowsPerPage) + index + 1}</td>
                      <td>{row.member_name || '-'}</td>
                      <td>{row.phone || '-'}</td>
                      <td>{row.district_name || '-'}</td>
                      <td>{row.mandal_name || '-'}</td>
                      <td>
                        <span className={`payment-method-badge ${row.payment_method || 'unknown'}`}>
                          {row.payment_method ? row.payment_method.toUpperCase() : '-'}
                        </span>
                      </td>
                      <td>₹{row.payment_amount || '0'}</td>
                      <td>{row.payment_date ? new Date(row.payment_date).toLocaleDateString() : '-'}</td>
                      <td>
                        <span className={`status-badge ${row.payment_status || 'unknown'}`}>
                          {row.payment_status || '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination-section">
              <div className="pagination-info">
                <label htmlFor="rowsPerPage">Rows per page:</label>
                <select
                  id="rowsPerPage"
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}
                  className="rows-select"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div className="pagination-info">
                Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredData.length)} of {filteredData.length} entries
              </div>
              <div className="pagination-controls">
                <button
                  onClick={(e) => handleChangePage(e, page - 1)}
                  disabled={page === 0}
                  className="pagination-btn"
                >
                  Previous
                </button>
                <span className="page-number">Page {page + 1}</span>
                <button
                  onClick={(e) => handleChangePage(e, page + 1)}
                  disabled={(page + 1) * rowsPerPage >= filteredData.length}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <p>No report data available. Please adjust your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;

