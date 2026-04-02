// pages/admin/DashBoard.js
import React, { useEffect, useState } from 'react';
import Title from '../../components/admin/Title';
import { useAppContext } from '../../components/context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const DashBoard = () => {
  const { user, fetchUser } = useAppContext();
  const [role, setRole] = useState('');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    confirmed: 0,
    pending: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalVendors: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch user if not loaded
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!user) {
          await fetchUser();
        }
        setRole(user?.role || '');
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [user, fetchUser]);

  // Fetch dashboard stats
  useEffect(() => {
    if (!role || loading) return;

    const fetchStats = async () => {
      try {
        let ordersRes, productsRes, usersRes;

        if (role === 'admin') {
          // Fetch admin dashboard data
          ordersRes = await axios.get('/api/admin/dashboard');
          // Fetch products
          productsRes = await axios.get('/api/products');
          // Fetch users for total count
          usersRes = await axios.get('/api/admin/users');
        } else if (role === 'vendor') {
          ordersRes = await axios.get('/api/vendor/orders');
          productsRes = await axios.get('/api/vendor/products');
        }

        if (role === 'admin') {
          // ✅ Fix: Use 'dashboard' instead of 'dashboardData'
          if (ordersRes.data.dashboard) {
            const { totalCart, pendingCart, completedCart, monthlyRevenue } = ordersRes.data.dashboard;
            
            setStats({
              totalRevenue: monthlyRevenue || 0,
              totalOrders: totalCart || 0,
              confirmed: completedCart || 0,
              pending: pendingCart || 0,
              totalProducts: productsRes.data.products?.length || 0,
              totalUsers: usersRes.data.users?.length || 0,
              totalVendors: usersRes.data.users?.filter(u => u.role === 'vendor').length || 0,
            });
          } else {
            console.error("Dashboard data not found in response:", ordersRes.data);
          }

        } else if (role === 'vendor') {
          const orders = ordersRes.data.orders || [];
          const totalOrders = orders.length;
          const confirmed = orders.filter(o => o.status === 'confirmed').length;
          const pending = orders.filter(o => o.status === 'pending').length;
          const totalRevenue = orders.reduce(
            (sum, order) => sum + (order.totalPrice || 0),
            0
          );

          const totalProducts = productsRes.data.products?.length || 0;

          setStats({ totalRevenue, totalOrders, confirmed, pending, totalProducts });
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [role, loading]);

  // Show loading spinner
  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error if no role
  if (!role) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {role === 'admin' ? (
        <>
          <Title
            title="System Administrator"
            subTitle="Platform-wide performance and user oversight."
          />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-8">
            <div className="p-6 bg-white border border-borderColor rounded-xl shadow-sm">
              <p className="text-gray-500">Total Revenue</p>
              <h2 className="text-3xl font-bold text-primary">
                ${stats.totalRevenue.toLocaleString()}
              </h2>
            </div>
            <div className="p-6 bg-white border border-borderColor rounded-xl shadow-sm">
              <p className="text-gray-500">Total Orders</p>
              <h2 className="text-3xl font-bold text-gray-800">{stats.totalOrders}</h2>
            </div>
            <div className="p-6 bg-white border border-borderColor rounded-xl shadow-sm">
              <p className="text-gray-500">Confirmed Orders</p>
              <h2 className="text-3xl font-bold text-green-600">{stats.confirmed}</h2>
            </div>
            <div className="p-6 bg-white border border-borderColor rounded-xl shadow-sm">
              <p className="text-gray-500">Pending Orders</p>
              <h2 className="text-3xl font-bold text-yellow-600">{stats.pending}</h2>
            </div>
            <div className="p-6 bg-white border border-borderColor rounded-xl shadow-sm">
              <p className="text-gray-500">Total Products</p>
              <h2 className="text-3xl font-bold text-purple-600">{stats.totalProducts}</h2>
            </div>
          </div>

          {/* Additional Admin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="p-6 bg-white border border-borderColor rounded-xl shadow-sm">
              <p className="text-gray-500">Total Users</p>
              <h2 className="text-3xl font-bold text-blue-600">{stats.totalUsers}</h2>
            </div>
            <div className="p-6 bg-white border border-borderColor rounded-xl shadow-sm">
              <p className="text-gray-500">Total Vendors</p>
              <h2 className="text-3xl font-bold text-green-600">{stats.totalVendors}</h2>
            </div>
          </div>
        </>
      ) : (
        <>
          <Title
            title="Vendor Dashboard"
            subTitle="Manage your inventory and rental performance."
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="p-6 bg-white border border-borderColor rounded-xl shadow-sm">
              <p className="text-gray-500">My Revenue</p>
              <h2 className="text-3xl font-bold text-primary">
                ${stats.totalRevenue.toLocaleString()}
              </h2>
            </div>
            <div className="p-6 bg-white border border-borderColor rounded-xl shadow-sm">
              <p className="text-gray-500">My Total Orders</p>
              <h2 className="text-3xl font-bold text-gray-800">{stats.totalOrders}</h2>
            </div>
            <div className="p-6 bg-white border border-borderColor rounded-xl shadow-sm">
              <p className="text-gray-500">Confirmed Rentals</p>
              <h2 className="text-3xl font-bold text-green-600">{stats.confirmed}</h2>
            </div>
            <div className="p-6 bg-white border border-borderColor rounded-xl shadow-sm">
              <p className="text-gray-500">Pending Rentals</p>
              <h2 className="text-3xl font-bold text-yellow-600">{stats.pending}</h2>
            </div>
            <div className="p-6 bg-white border border-borderColor rounded-xl shadow-sm">
              <p className="text-gray-500">Total Products</p>
              <h2 className="text-3xl font-bold text-purple-600">{stats.totalProducts}</h2>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashBoard;