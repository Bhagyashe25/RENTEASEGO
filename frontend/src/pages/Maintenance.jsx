// src/pages/user/Maintenance.jsx
import React, { useState, useEffect } from 'react';
import Title from '../components/Title'; 
import { useAppContext } from '../components/context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const MaintenanceRequest = () => {
  const { user, cartItems, fetchCart, token } = useAppContext();
  const [formData, setFormData] = useState({
    productId: '',
    issue: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [activeRentals, setActiveRentals] = useState([]);

  // Fetch active rentals from cart items
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const rentals = cartItems.filter(item => item.status === 'confirmed');
      setActiveRentals(rentals);
    }
  }, [cartItems]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validate form
    if (!formData.productId || !formData.issue || !formData.description) {
      toast.error('Please fill all fields');
      return;
    }
    
    if (!token) {
      toast.error('Please login first');
      return;
    }

    setLoading(true);

    try {
      // ✅ Call backend API
      const { data } = await axios.post('/api/user/maintenance-request', {
        productId: formData.productId, // This is the Cart ID
        issue: formData.issue,
        description: formData.description
      },{
        headers: {
             Authorization: `Bearer ${token}`, // ADD THIS
              },

        // Note: userId is automatically handled by backend via req.user
      });

      if (data.success) {
        toast.success('Maintenance request submitted successfully');
        setFormData({ productId: '', issue: '', description: '' });
      } else {
        toast.error(data.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Maintenance Request Error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 max-w-3xl'>
      <Title 
        title="Maintenance Support" 
        subTitle="Report an issue with your rented product." 
        align="left" 
      />
      
      <form 
        onSubmit={handleSubmit}
        className='mt-8 space-y-4 bg-light p-8 rounded-xl'
      >
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium'>Select Rented Product</label>
          <select
            name="productId"
            value={formData.productId}
            onChange={handleInputChange}
            className='border p-2 rounded-md'
            required
          >
            <option value="">Choose from active rentals...</option>
            {activeRentals.length === 0 ? (
              <option disabled>No active rentals found</option>
            ) : (
              activeRentals.map((rental) => (
                <option key={rental._id} value={rental._id}>
                  {rental.product?.name} - {rental.product?.category}
                </option>
              ))
            )}
          </select>
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium'>Nature of Issue</label>
          <input
            type="text"
            name="issue"
            value={formData.issue}
            onChange={handleInputChange}
            placeholder="e.g. Broken leg, Cooling issue"
            className='border p-2 rounded-md'
            required
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium'>Detailed Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className='border p-2 rounded-md'
            placeholder="Describe the problem in detail..."
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className='bg-primary text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default MaintenanceRequest;