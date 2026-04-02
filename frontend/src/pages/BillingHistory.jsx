// pages/BillingHistory.js
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Title from '../components/Title';
import axios from 'axios';

const BillingHistory = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [billingData, setBillingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`/api/billing?orderId=${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBillingData(data);
      } catch (error) {
        console.error("Failed to fetch billing:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchBilling();
  }, [orderId]);

  if (loading) return <p>Loading billing history...</p>;
  if (!billingData) return <p>No billing data found</p>;

  return (
    <div className="px-6 mt-16">
      <Title title="Billing History" subTitle={`Order #${orderId?.slice(-6)}`} />
      {/* Display billing data here */}
    </div>
  );
};

export default BillingHistory;