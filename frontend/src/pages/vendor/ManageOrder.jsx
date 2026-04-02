// pages/vendor/ManageOrder.js
import React, { useEffect, useState } from 'react';
import Title from '../../components/admin/Title';
import axios from 'axios';
import { useAppContext } from '../../components/context/AppContext';

const ManageOrder = () => {
  const { user } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(null);

  // Handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      const { data } = await axios.post("/api/vendor/update-order-status", {
        bookingId: orderId,
        status: newStatus,
      });

      if (data.success) {
        // Update local state so UI reflects change
        setOrders(prev =>
          prev.map(o => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err.response?.data || err.message);
    } finally {
      setUpdating(null);
    }
  };

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/vendor/orders');
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title
        title="Manage Orders"
        subTitle="View all customer orders, update their status, or manage order details."
      />

      {loading ? (
        <p className="text-gray-500 mt-4">Loading orders...</p>
      ) : (
        <div className='max-w-7xl w-full rounded-md overflow-auto border border-borderColor mt-6'>
          <table className='w-full border-collapse text-left text-sm text-gray-600'>
            <thead className='text-gray-500 bg-gray-50'>
              <tr>
                <th className="p-3 font-medium">Order ID</th>
                <th className="p-3 font-medium">Product</th>
                <th className="p-3 font-medium max-md:hidden">Ordered By</th>
                <th className="p-3 font-medium max-md:hidden">Location</th>
                <th className="p-3 font-medium max-md:hidden">Order Date</th>
                <th className="p-3 font-medium">Total</th>
                <th className="p-3 font-medium max-md:hidden">Payment</th>
                <th className="p-3 font-medium text-center">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className='border-t border-borderColor text-gray-600 hover:bg-gray-50'>
                    {/* Order ID */}
                    <td className='p-3 font-mono text-xs text-gray-500'>
                      {order._id?.substring(0, 8)}...
                    </td>

                    {/* Product */}
                    <td className='p-3 flex items-center gap-3'>
                      <img
                        src={order.product?.image}
                        alt={order.product?.name}
                        loading="lazy"
                        className='h-12 w-12 rounded-md object-cover'
                      />
                      <div className='max-md:hidden'>
                        <p className='font-medium'>{order.product?.name}</p>
                        <p className='text-xs text-gray-500'>{order.product?.category}</p>
                      </div>
                    </td>

                    {/* Ordered By */}
                    <td className='p-3 max-md:hidden'>
                      <p className='font-medium text-gray-800'>
                        {order.user?.name || 'Guest'}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {order.user?.email || 'N/A'}
                      </p>
                    </td>

                    {/* Location */}
                    <td className='p-3 max-md:hidden'>
                      <p className='text-sm text-gray-700'>
                        {order.address || order.location || 'No Address Provided'}
                      </p>
                    </td>

                    {/* Order Date */}
                    <td className='p-3 max-md:hidden whitespace-nowrap'>
                      {order.createdAt?.split('T')[0]}
                    </td>

                    {/* Total */}
                    <td className='p-3 whitespace-nowrap font-medium text-gray-800'>
                      {currency}{order.totalPrice || order.price}
                    </td>

                    {/* Payment */}
                    <td className='p-3 max-md:hidden'>
                      <span className='bg-gray-100 px-3 py-1 rounded-full text-xs'>
                        {order.paymentMethod || 'Cash'}
                      </span>
                    </td>

                    {/* Status - Always Editable */}
                    <td className='p-3 text-center'>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updating === order._id}
                        className={`px-2 py-1 text-sm border border-borderColor rounded-md outline-none cursor-pointer
                          ${updating === order._id ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        <option value='pending'>Pending</option>
                        <option value='confirmed'>Confirmed</option>
                        <option value='cancelled'>Cancelled</option>
                        <option value='delivered'>Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className='p-6 text-center text-gray-500'>
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageOrder;