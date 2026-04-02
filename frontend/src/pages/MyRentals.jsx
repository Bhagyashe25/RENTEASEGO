import React, { useEffect, useState, useMemo } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../components/context/AppContext';
import toast from 'react-hot-toast';

const MyRentals = () => {
  const { cartItems, user, fetchCart, currency, isAuthenticated, checkout } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Memoize filtered orders
  const pendingOrders = useMemo(() => {
    return cartItems?.filter(item => 
      item.status === 'pending' || item.status === 'processing'
    ) || [];
  }, [cartItems]);

  const activeRentals = useMemo(() => {
    return cartItems?.filter(item => item.status === 'confirmed') || [];
  }, [cartItems]);
  const { setShowLogin } = useAppContext();

  // ✅ ADDED: Missing Functions
  const handleCheckout = async (cartId) => {
    try {
      await checkout([cartId]); // Pass cart ID array
      toast.success("Order placed successfully");
      await fetchCart();
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order");
    }
  };

  const handleViewBilling = (orderId) => {
    navigate(`/billing-history?orderId=${orderId}`);
  };

  const handleRequestMaintenance = (orderId) => {
    navigate(`/maintenance-request?orderId=${orderId}`);
  };

  // Fetch cart ONLY if user is logged in
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated && !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        await fetchCart();
        setHasLoaded(true);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please try again.");
        toast.error("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchCart, isAuthenticated, user]);

  // Not Logged In State
  if (!isAuthenticated && !user) {
    return (
      <div className="pt-24 px-6 md:px-16 lg:px-24 xl:px-32 mt-16 text-sm max-w-7xl mx-auto">
        <Title title="My Rentals" subTitle="View and manage your orders" align="left" />
        <div className="text-center text-gray-500 mt-12 p-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Please log in</h2>
          <p className="text-lg mb-8">Sign in to view your orders and rentals</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowLogin(true)}
              className="px-8 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all"
            >
              Login
            </button>

          </div>
        </div>
      </div>
    );
  }

  // Loading
  if (loading && !hasLoaded) {
    return (
      <div className="pt-24 px-6 md:px-16 lg:px-24 xl:px-32 mt-16 text-sm max-w-7xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="pt-24 px-6 md:px-16 lg:px-24 xl:px-32 mt-16 text-sm max-w-7xl">
        <Title title="My Rentals" subTitle="View and manage your orders" align="left" />
        <div className="text-center text-red-500 mt-12 p-6 bg-red-50 rounded-lg">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="pt-24 px-6 md:px-16 lg:px-24 xl:px-32 mt-16 text-sm max-w-7xl">
        <Title title="My Rentals" subTitle="View and manage your orders" align="left" />
        <div className="text-center text-gray-500 mt-12 p-12 bg-gray-50 rounded-lg">
          <img src={assets.placeholder} alt="No Orders" className="w-24 h-24 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">You have no orders yet</p>
          <p className="text-sm mt-2">Start renting to see your orders here.</p>
          <div className="mt-6">
            <button 
              onClick={() => navigate('/products')}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ MAIN CONTENT - NOW WORKS!
  return (
    <div className="pt-24 px-6 md:px-16 lg:px-24 xl:px-32 mt-16 text-sm max-w-7xl">
      <Title 
        title="My Rentals"
        subTitle="View and manage your orders and active rentals"
        align="left"
      />

      {/* Pending Orders */}
      {pendingOrders.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-4">Pending Orders ({pendingOrders.length})</h3>
          <div className="space-y-6">
            {pendingOrders.map((cart, index) => (
              <div key={cart._id} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-all">
                <img
                  src={cart.product?.image || assets.placeholder}
                  className="w-full md:w-40 h-32 object-cover rounded-lg"
                  alt={cart.product?.name}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold">{cart.product?.name}</h3>
                      <p className="text-gray-500 text-sm mt-1">
                        Order #{index + 1} • {cart.product?.category || "N/A"}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                      {cart.status}
                    </span>
                  </div>
                  {/* Rest of pending order content... */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-gray-400 uppercase text-[10px] font-bold">Monthly Rent</p>
                      <p className="font-semibold text-lg">{currency}{cart.price || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 uppercase text-[10px] font-bold">Tenure</p>
                      <p className="font-medium">{cart.tenure || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 uppercase text-[10px] font-bold">Deposit</p>
                      <p className="font-medium">{currency}{cart.securityDeposit || 0}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 justify-center">
                  <button
                    onClick={() => handleCheckout(cart._id)}
                    className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all"
                  >
                    Checkout
                  </button>
                  <button
                    className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-all"
                    onClick={() => navigate(`/order-details/${cart._id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Rentals - SIMPLIFIED */}
      {activeRentals.length > 0 && (
        <div className="mt-16">
          <h3 className="text-lg font-semibold mb-4">Active Rentals ({activeRentals.length})</h3>
          <div className="space-y-6">
            {activeRentals.map((item) => (
              <div key={item._id} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-all">
                <img
                  src={item.product?.image || assets.placeholder}
                  className="w-full md:w-40 h-32 object-cover rounded-lg"
                  alt={item.product?.name}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold truncate">{item.product?.name}</h3>
                      <p className="text-gray-500 text-sm mt-1">Order ID: {item._id.slice(-6).toUpperCase()}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Active
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 justify-center min-w-35">
                  <button
                    onClick={() => handleRequestMaintenance(item._id)}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
                  >
                    Maintenance
                  </button>
                  <button
                    className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-all"
                    onClick={() => handleViewBilling(item._id)}
                  >
                    Billing History
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRentals;