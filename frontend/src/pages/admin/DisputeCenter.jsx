// pages/admin/DisputeCenter.js
import React, { useEffect, useState } from 'react';
import Title from '../../components/admin/Title';
import { useAppContext } from '../../components/context/AppContext';
import axios from 'axios';

const DisputeCenter = () => {
  const { user, fetchUser } = useAppContext();
  const [role, setRole] = useState(user?.role || '');
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) fetchUser();
    else setRole(user.role);
  }, [user, fetchUser]);

  const fetchDisputes = async () => {
    try {
      const { data } = await axios.get('/api/admin/disputes');
      if (data.success) {
        setDisputes(data.disputes);
      }
    } catch (err) {
      console.log('Fetch disputes error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === 'admin') {
      fetchDisputes();
    }
  }, [role]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <p className="text-gray-500">Loading disputes...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Title
        title="Dispute & Damage Claims"
        subTitle="Mediate between customers and vendors."
      />
      <div className="mt-8 space-y-4">
        {disputes.length === 0 ? (
          <p className="text-gray-500 text-center">No disputes found.</p>
        ) : (
          disputes.map((dispute) => (
            <div
              key={dispute._id}
              className="p-4 border-l-4 border-red-500 bg-white shadow-sm rounded-r-lg"
            >
              <p className="font-bold">Case #{dispute.caseNumber || 'N/A'}</p>
              <p className="text-sm text-gray-600">{dispute.description}</p>
              <button className="mt-2 text-xs bg-primary text-white px-3 py-1 rounded">
                Review Evidence
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DisputeCenter;