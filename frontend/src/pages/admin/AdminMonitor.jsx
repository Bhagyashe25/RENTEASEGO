// pages/admin/AdminMonitor.js
import React, { useEffect, useState } from 'react';
import Title from '../../components/admin/Title';
import { useAppContext } from '../../components/context/AppContext';

const AdminMonitor = () => {
  const { user, fetchUser, dashboardData, fetchDashboardData } = useAppContext();
  const [role, setRole] = useState(user?.role || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) fetchUser();
    else setRole(user.role);
  }, [user, fetchUser]);

  useEffect(() => {
    if (role === 'admin') {
      fetchDashboardData();
    }
  }, [role, fetchDashboardData]);

  if (loading || !dashboardData) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <p className="text-gray-500">Loading monitor...</p>
      </div>
    );
  }

  const stats = [
    { title: "Active Users", value: 120 },
    { title: "Active Rentals", value: dashboardData.totalCart || 0 },
    { title: "Pending Orders", value: dashboardData.pendingCart || 0 },
    { title: "Completed Rentals", value: dashboardData.completedCart || 0 }
  ];

  return (
    <div className="w-full">
      <Title
        title="System Monitor"
        subTitle="Real-time platform performance metrics."
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-borderColor rounded-xl p-6 text-center"
          >
            <h3 className="text-gray-500 text-sm mb-2">{item.title}</h3>
            <p className="text-3xl font-bold text-gray-800">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMonitor;