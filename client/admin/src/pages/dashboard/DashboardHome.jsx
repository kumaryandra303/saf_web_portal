import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  FileText, 
  Activity, 
  TrendingUp,
  DollarSign,
  MapPin,
  Award,
  Calendar,
  ArrowUp,
  ArrowDown,
  IndianRupee,
  Heart,
  FileSpreadsheet
} from 'lucide-react';
import DataGrid, {
  Column,
  Paging,
  Pager,
  SearchPanel,
  HeaderFilter,
  FilterRow,
  Export,
  Summary,
  TotalItem,
  Selection
} from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.light.css';
import baseApiService from '../../services/baseApiService';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import './DashboardHome.css';

const DashboardHome = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_members: 0,
    paid_members: 0,
    donation_amount: 0,
    donors_count: 0,
    total_updates: 0,
    saf_funds: 0,
    total_programs: 0,
    sabyatwam_amount: 0
  });
  const [topMembers, setTopMembers] = useState([]);
  const [keyPeople, setKeyPeople] = useState([]);
  const [districtData, setDistrictData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all dashboard data in parallel
      const [statsRes, membersRes, keyPeopleRes, districtRes] = await Promise.all([
        baseApiService.get('/dashboard/stats'),
        baseApiService.get('/dashboard/top-members'),
        baseApiService.get('/keypeople/top'),
        baseApiService.get('/dashboard/district-wise')
      ]);

      if (statsRes?.status === 200 && statsRes?.data) {
        setStats(statsRes.data);
      }

      if (membersRes?.status === 200 && membersRes?.data) {
        setTopMembers(membersRes.data || []);
      }

      if (keyPeopleRes?.status === 200 && keyPeopleRes?.data) {
        setKeyPeople(keyPeopleRes.data || []);
      }

      if (districtRes?.status === 200 && districtRes?.data) {
        setDistrictData(districtRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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

  const formatNumber = (num) => {
    if (!num) return '0';
    return parseFloat(num).toLocaleString('en-IN');
  };

  const statsCards = [
    {
      title: 'Total SAF Members',
      value: formatNumber(stats.total_members),
      subtitle: `${formatNumber(stats.paid_members)} Paid (Sabyatwam)`,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      amount: `₹${formatNumber(stats.paid_members * 20)}`
    },
    {
      title: 'Total Programs',
      value: formatNumber(stats.total_programs),
      subtitle: 'Active Programs',
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Updates',
      value: formatNumber(stats.total_updates),
      subtitle: 'Published Updates',
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Donors',
      value: formatNumber(stats.donors_count),
      subtitle: 'Members Donated',
      icon: Heart,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Donation Amount',
      value: formatCurrency(stats.donation_amount),
      subtitle: 'Donations Only',
      icon: IndianRupee,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'SAF Funds',
      value: formatCurrency(stats.saf_funds),
      subtitle: `Donations + Sabyatwam (₹${formatCurrency(stats.sabyatwam_amount)})`,
      icon: DollarSign,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-red-600 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.fullName || 'Administrator'}!</h1>
            <p className="text-white/90">Here's the overview of Settibalija Action Force Management</p>
          </div>
        </div>
      </div>

      {/* SAF Key People */}
      {keyPeople.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Award className="h-6 w-6 text-red-600" />
            SAF Key People
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {keyPeople.map((person) => (
              <div key={person.saf_key_prsn_id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 text-center">
                {/* Profile Image */}
                <div className="mb-4 flex justify-center relative">
                  {person.img_pth ? (
                    <>
                      <img 
                        src={person.img_pth.startsWith('http') ? person.img_pth : `/docs/keypeople/${person.img_pth}`}
                        alt={person.fll_nm}
                        className="w-24 h-24 rounded-full object-cover border-4 border-red-600 shadow-lg"
                        onError={(e) => {
                          // Fallback to skeleton avatar
                          e.target.style.display = 'none';
                          const placeholder = e.target.parentElement.querySelector('.avatar-placeholder');
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                      <div 
                        className="avatar-placeholder w-24 h-24 rounded-full bg-red-600 flex items-center justify-center border-4 border-red-600 shadow-lg hidden"
                      >
                        <Users className="h-12 w-12 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center border-4 border-red-600 shadow-lg">
                      <Users className="h-12 w-12 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Name */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {person.fll_nm}
                </h3>
                
                {/* Role */}
                <p className="text-red-600 font-semibold mb-3">
                  {person.dsgns_nm}
                </p>
                
                {/* Responsibilities */}
                {person.rspnsblty_tx && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {person.rspnsblty_tx}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className={`${stat.bgColor} px-3 py-1 rounded-full`}>
                <span className={`text-xs font-semibold ${stat.textColor}`}>{stat.subtitle}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
              {stat.amount && (
                <p className="text-sm text-gray-500">Sabyatwam Amount: {stat.amount}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* District-wise Statistics Grid */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 w-full overflow-hidden">
        {/* Title Section with Record Count and Export Button */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-600 flex-shrink-0" />
              <h2 className="text-lg font-semibold text-gray-900 whitespace-nowrap">
                District-wise Statistics
              </h2>
            </div>
            {districtData.length > 0 && (
              <span className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                {districtData.length} Records
              </span>
            )}
          </div>
          <button
            onClick={async () => {
              try {
                const workbook = new Workbook();
                const worksheet = workbook.addWorksheet('District Statistics');
                
                // Add headers
                worksheet.columns = [
                  { header: 'District Name', width: 25 },
                  { header: 'Total Members', width: 15 },
                  { header: 'Member Paid Amount (₹)', width: 20 },
                  { header: 'Donors Count', width: 15 },
                  { header: 'Total Donations (₹)', width: 20 },
                  { header: 'Avg Donation (₹)', width: 18 }
                ];
                
                // Style header
                worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
                worksheet.getRow(1).fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFDC2626' }
                };
                
                // Add data
                districtData.forEach((row) => {
                  worksheet.addRow([
                    row.dstrt_nm,
                    row.total_members,
                    parseFloat(row.member_paid_amnt || 0).toFixed(2),
                    row.donors_count,
                    parseFloat(row.total_donations || 0).toFixed(2),
                    parseFloat(row.avg_donation || 0).toFixed(2)
                  ]);
                });
                
                // Export
                const buffer = await workbook.xlsx.writeBuffer();
                saveAs(new Blob([buffer]), `District_Statistics_${new Date().toISOString().split('T')[0]}.xlsx`);
              } catch (error) {
                console.error('Export error:', error);
              }
            }}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm whitespace-nowrap flex-shrink-0"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export to Excel
          </button>
        </div>

        {/* Data Grid Container */}
        <div className="w-full overflow-x-auto">
          <DataGrid
            dataSource={districtData}
            showBorders={true}
            rowAlternationEnabled={true}
            className="saf-dashboard-grid"
            width="100%"
            height="auto"
            onExporting={(e) => {
              const workbook = new Workbook();
              const worksheet = workbook.addWorksheet('District Statistics');
              exportDataGrid({
                component: e.component,
                worksheet: worksheet,
                autoFilterEnabled: true
              }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                  saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `District_Statistics_${new Date().toISOString().split('T')[0]}.xlsx`);
                });
              });
              e.cancel = true;
            }}
          >
            <Selection mode="multiple" />
            <SearchPanel 
              visible={true}
              placeholder="Search districts..."
              width={300}
            />
            <Column 
              dataField="dstrt_nm" 
              caption="DISTRICT NAME" 
              width="auto"
              minWidth={180}
              allowSorting={true}
            />
            <Column 
              dataField="total_members" 
              caption="TOTAL MEMBERS" 
              dataType="number"
              width="auto"
              minWidth={140}
              allowSorting={true}
              alignment="center"
            />
            <Column 
              dataField="member_paid_amnt" 
              caption="MEMBER PAID AMOUNT (₹)" 
              dataType="number"
              width="auto"
              minWidth={180}
              format={{ type: 'currency', currency: 'INR', precision: 2 }}
              allowSorting={true}
              alignment="right"
              cellRender={(data) => (
                <span className="font-semibold text-blue-600">{formatCurrency(data.value)}</span>
              )}
            />
            <Column 
              dataField="donors_count" 
              caption="DONORS COUNT" 
              dataType="number"
              width="auto"
              minWidth={140}
              allowSorting={true}
              alignment="center"
            />
            <Column 
              dataField="total_donations" 
              caption="TOTAL DONATIONS (₹)" 
              dataType="number"
              width="auto"
              minWidth={170}
              format={{ type: 'currency', currency: 'INR', precision: 2 }}
              allowSorting={true}
              alignment="right"
              cellRender={(data) => (
                <span className="font-semibold text-green-600">{formatCurrency(data.value)}</span>
              )}
            />
            <Column 
              dataField="avg_donation" 
              caption="AVG DONATION (₹)" 
              dataType="number"
              width="auto"
              minWidth={160}
              format={{ type: 'currency', currency: 'INR', precision: 2 }}
              allowSorting={true}
              alignment="right"
              cellRender={(data) => (
                <span className="text-gray-700">{formatCurrency(data.value)}</span>
              )}
            />
            <Paging defaultPageSize={15} />
            <Pager 
              showPageSizeSelector={true}
              allowedPageSizes={[10, 15, 25, 50, 100]}
              showInfo={true}
              showNavigationButtons={true}
              displayMode="full"
            />
            <HeaderFilter visible={true} />
            <FilterRow visible={true} />
            <Export enabled={true} />
            <Summary>
              <TotalItem
                column="total_members"
                summaryType="sum"
                displayFormat="Total: {0}"
              />
               <TotalItem
                column="member_paid_amnt"
                summaryType="sum"
                displayFormat="Total: {0}"
                valueFormat={{ type: 'currency', currency: 'INR', precision: 2 }}
                cellRender={(data) => (
                  <span className="font-semibold text-blue-600">{formatCurrency(data.value)}</span>
                )}
              />
              <TotalItem
                column="total_donations"
                summaryType="sum"
                displayFormat="Total: {0}"
                valueFormat={{ type: 'currency', currency: 'INR', precision: 2 }}
              />
            </Summary>
          </DataGrid>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
