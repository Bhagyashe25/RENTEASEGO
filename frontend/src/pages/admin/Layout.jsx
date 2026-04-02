import React, { useEffect, useState } from 'react';
import NavbarAdmin from '../../components/admin/NavbarAdmin';
import Sidebar from '../../components/admin/Sidebar';
import { Outlet } from 'react-router-dom';
import { useAppContext } from '../../components/context/AppContext';

const Layout = () => {
  const { user, fetchUser } = useAppContext(); // get user from context
  const [role, setRole] = useState(user?.role || '');

  // Sync role when user updates
  useEffect(() => {
    if (!user) {
      fetchUser(); // fetch user from backend if not loaded
    } else {
      setRole(user.role); // update local role
    }
  }, [user, fetchUser]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation Bar */}
      <NavbarAdmin />

      <div className="flex flex-1">
        {/* Sidebar receives role from context */}
        <Sidebar role={role} />

        {/* Main Content Area */}
        <main className="flex-1 bg-gray-50 overflow-y-auto">
          <div className="p-4 md:p-8">
            <Outlet context={{ role }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;