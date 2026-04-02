// pages/admin/Analytics.js
import React, { useEffect, useState } from 'react';
import Title from '../../components/admin/Title';
import { useAppContext } from '../../components/context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Analytics = () => {
  const { user, fetchUser, dashboardData, fetchDashboardData } = useAppContext();
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!user) {
          await fetchUser();
        }
        setRole(user?.role || '');
        
        if (user?.role === 'admin') {
          await fetchDashboardData();
        }
      } catch (error) {
        console.error("Error loading analytics:", error);
        toast.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, fetchUser, fetchDashboardData]);

  // Handle PDF Download
  const handleDownloadPDF = async () => {
    if (role !== 'admin') {
      toast.error('Access denied - Admin only');
      return;
    }

    setDownloadLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/reports/pdf', {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `analytics_report_${new Date().toISOString().split('T')[0]}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('PDF Report downloaded successfully');
    } catch (err) {
      console.error('❌ PDF Download Error:', err);
      toast.error(err.response?.data?.message || 'Failed to download PDF report');
    } finally {
      setDownloadLoading(false);
    }
  };

  // Handle CSV Download
  const handleDownloadCSV = async () => {
    if (role !== 'admin') {
      toast.error('Access denied - Admin only');
      return;
    }

    setDownloadLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/reports/csv', {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `orders_report_${new Date().toISOString().split('T')[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('CSV Report downloaded successfully');
    } catch (err) {
      console.error('❌ CSV Download Error:', err);
      toast.error(err.response?.data?.message || 'Failed to download CSV report');
    } finally {
      setDownloadLoading(false);
    }
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect non-admin users
  if (role !== 'admin') {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
          <p className="text-gray-600 mt-2">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Title
        title="Reports & Insights"
        subTitle="Monitor platform revenue and rental trends."
      />

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-8">
        {/* Total Revenue */}
        <div className="p-6 bg-primary text-white rounded-xl shadow-lg">
          <p className="text-sm opacity-80">Total Revenue</p>
          <h2 className="text-3xl font-bold mt-2">
            ${dashboardData?.monthlyRevenue?.toLocaleString() || 0}
          </h2>
        </div>

        {/* Active Rentals */}
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Active Rentals</p>
          <h2 className="text-3xl font-bold mt-2 text-gray-800">
            {dashboardData?.totalCart || 0}
          </h2>
        </div>

        {/* Total Active Users */}
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Total Active Users</p>
          <h2 className="text-3xl font-bold mt-2 text-blue-600">
            {dashboardData?.totalUsers || 0}
          </h2>
        </div>

        {/* Total Vendors */}
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Total Vendors</p>
          <h2 className="text-3xl font-bold mt-2 text-green-600">
            {dashboardData?.totalVendors || 0}
          </h2>
        </div>

        {/* Total Products */}
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Total Products</p>
          <h2 className="text-3xl font-bold mt-2 text-purple-600">
            {dashboardData?.totalProducts || 0}
          </h2>
        </div>
      </div>

      
    </div>
  );
};

export default Analytics;