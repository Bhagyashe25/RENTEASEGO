// pages/admin/UserManagement.js
import React, { useEffect, useState } from 'react';
import Title from '../../components/admin/Title';
import { useAppContext } from '../../components/context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const { user, fetchUser, users, fetchUsers, isAdmin } = useAppContext();
  const [role, setRole] = useState(user?.role || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!user) {
      fetchUser();
    } else {
      setRole(user.role);
    }
  }, [user, fetchUser, isAdmin]);

  useEffect(() => {
      console.log("🔍 UserManagement: role =", role);
    console.log("🔍 UserManagement: isAdmin =", isAdmin);
    console.log("🔍 UserManagement: users =", users);
    // ✅ Only fetch users if user is admin
       if (isAdmin && role === 'admin' && !hasFetched) {
      console.log("🔍 UserManagement: Fetching users...");
      setLoading(true);
      fetchUsers()
        .then(() => {
          console.log("✅ Users fetched successfully");
          setLoading(false);
          setHasFetched(true); // ✅ Mark as fetched
        })
        .catch((err) => {
          console.error("❌ Fetch users error:", err);
          setError(err.message);
          setLoading(false);
        });
    } else if (role !== 'admin') {
      console.log("❌ User is not admin");
      setLoading(false);
      setError('Access denied - Admin only');
    }
  }, [role, isAdmin, hasFetched]);

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const { data } = await axios.post('/api/admin/delete-user', { userId });
      if (data.success) {
        toast.success(data.message);
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Show empty state
  if (!users || users.length === 0) {
    return (
      <div className="w-full">
        <Title
          title="User Management"
          subTitle="View and manage all platform users."
        />
        <div className="bg-white border border-borderColor rounded-xl p-6 mt-8">
          <p className="text-gray-500 text-center">No users found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Title
        title="User Management"
        subTitle="View and manage all platform users."
      />
      <div className="bg-white border border-borderColor rounded-xl p-6 mt-8">
        <h3 className="text-xl font-semibold mb-4">All Users ({users.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-borderColor">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Join Date</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-borderColor">
                  <td className="py-3 px-4">{u.name}</td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      u.role === 'admin' ? 'bg-red-100 text-red-600' :
                      u.role === 'vendor' ? 'bg-green-100 text-green-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;