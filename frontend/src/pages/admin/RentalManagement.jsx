// pages/admin/RentalManagement.js
import React, { useEffect, useState } from 'react';
import Title from '../../components/admin/Title';
import { useAppContext } from '../../components/context/AppContext';
import axios from 'axios';

const RentalManagement = () => {
  const { user, fetchUser, rentals, fetchRentals } = useAppContext();
  const [role, setRole] = useState(user?.role || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) fetchUser();
    else setRole(user.role);
  }, [user, fetchUser]);

  useEffect(() => {
    if (role === 'admin') {
      fetchRentals();
    }
  }, [role, fetchRentals]);

  if (loading || !rentals) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <p className="text-gray-500">Loading rentals...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Title
        title="Rental Management"
        subTitle="View and manage all platform rentals."
      />
      <div className="bg-white border border-borderColor rounded-xl p-6 mt-8">
        <h3 className="text-xl font-semibold mb-4">All Rentals ({rentals.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-borderColor">
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental) => (
                <tr key={rental._id} className="border-b border-borderColor">
                  <td className="py-3 px-4">
                    {rental.product?.name || 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    {rental.user?.name || 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      rental.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                      rental.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {rental.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">${rental.price || 0}</td>
                  <td className="py-3 px-4">
                    {new Date(rental.createdAt).toLocaleDateString()}
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

export default RentalManagement;