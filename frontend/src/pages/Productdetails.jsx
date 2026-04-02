import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Loader from "../components/Loader";
import { useAppContext } from "../components/context/AppContext";
import toast from 'react-hot-toast';
import {motion} from 'motion/react'

const Productdetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    products, 
    addToCart, 
    fetchCart,  
    setDeliveryDate,
    setPickupDate,
    currency 
  } = useAppContext();

  const [product, setProduct] = useState(null);
  const [tenure, setTenure] = useState("");
  const [deliveryDate, setLocalDeliveryDate] = useState("");
  const [location, setLocation] = useState("");
  const [orderType, setOrderType] = useState("");
  const [loading, setLoading] = useState(false); 

  // Calculate pickup date
  const calculatePickupDate = (deliveryDate, tenure) => {
    if (!deliveryDate || !tenure) return "";
    const start = new Date(deliveryDate);
    let daysToAdd = 0;
    if (tenure.includes("Day")) daysToAdd = parseInt(tenure);
    else if (tenure.includes("Week")) daysToAdd = parseInt(tenure) * 7;
    else if (tenure.includes("Month")) daysToAdd = parseInt(tenure) * 30;
    const end = new Date(start);
    end.setDate(end.getDate() + daysToAdd);
    return end.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!tenure || !deliveryDate || !location || !orderType) {
        toast.error("Please fill all required fields");
        return;
      }

      const pickupDate = calculatePickupDate(deliveryDate, tenure);
      const tenureString = tenure.includes("Day") ? `${tenure} Day(s)` :
                          tenure.includes("Week") ? `${tenure} Week(s)` :
                          `${tenure} Month(s)`;

      
      setDeliveryDate(deliveryDate);
      setPickupDate(pickupDate);

    
      await addToCart(product._id, location, tenureString, deliveryDate, pickupDate, orderType);
      
      toast.success("✅ Added to cart successfully!");
      
      
      await fetchCart();
      
      
      navigate("/cart");

    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (products?.length > 0) {
      const foundProduct = products.find(item => item._id === id);
      setProduct(foundProduct);
    }
  }, [id, products]);

  if (!product) {
    return <Loader />;
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16 max-w-7xl mx-auto">
      
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-8 text-gray-600 hover:text-gray-900 font-medium transition-colors"
      >
        <img src={assets.arrow_icon} alt="Back" className="rotate-180 w-5 h-5 opacity-70" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Product Gallery */}
        <div
        className="space-y-8">
          <motion.div
              initial={{y: 30, opacity: 0}}
           animate={{y: 0, opacity: 1}}
           transition={{duration: 0.6}}
          className="bg-linear-to-br from-white/80 to-gray-50/50 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50">
            <motion.img
                initial={{scale: 0.98, opacity: 0}}
           animate={{scale: 1, opacity: 1}}
           transition={{duration: 0.5}}
              src={product.image}
              alt={product.name}
              className="w-full h-96 lg:h object-cover rounded-2xl shadow-2xl"
            />
          </motion.div>

          {/* Product Info */}
          <motion.div 
              initial={{opacity: 0}}
           animate={{opacity: 1}}
           transition={{duration: 0.5, delay: 0.2}}
          className="space-y-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-black bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
                {product.name}
              </h1>
              <p className="text-xl text-gray-600 mt-3 font-semibold">{product.category}</p>
            </div>

            <hr className="border-gray-200" />

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-6 bg-linear-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200/50 shadow-sm">
                <img src={assets.dashboardIcon} alt="Category" className="h-6 mb-2" />
                <span className="font-semibold text-emerald-800">{product.category}</span>
              </div>
              
              <div className="flex flex-col items-center p-6 bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200/50 shadow-sm">
                <img src={assets.tick_icon} alt="Status" className="h-6 mb-2" />
                <span className={`font-semibold ${product.isAvailable ? 'text-green-800' : 'text-red-800'}`}>
                  {product.isAvailable ? "Available Now" : "Not Available"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-gray-200/50 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Description
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Tenure Options */}
            <div className="bg-linear-to-r from-indigo-50 to-purple-50 p-8 rounded-3xl border border-indigo-200/50 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-indigo-900">Rental Plans</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {product.tenureOptions?.map((item, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-2xl border-2 border-gray-200 hover:border-indigo-400 transition-all hover:shadow-md">
                    <motion.div
                        initial={{y: 10, opacity: 0}}
                       animate={{y: 0, opacity: 1}}
                      transition={{duration: 0.4}}
                    className="flex items-center gap-2 mb-2">
                      <img src={assets.check_icon} className="h-5" alt="" />
                      <span className="font-semibold text-indigo-900">{item}</span>
                    </motion.div>
                    <p className="text-sm text-gray-600">Flexible rental period</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Rental Form - Sticky */}
        <div
         className="lg:col-span-1">
          <div className="bg-linear-to-b from-white/90 to-gray-50/90 backdrop-blur-xl sticky top-24 rounded-3xl p-9 shadow-2xl border border-gray-200/50 lg:max-h w-full overflow-y-auto">
            
            {/* Price */}
            <div className="text-center mb-8 pt-4 pb-6 border-b-2 border-gray-200">
              <div className="inline-flex items-baseline gap-2 bg-linear-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-3xl shadow-2xl">
                <span className="text-4xl font-black">{currency}</span>
                <span className="text-5xl font-black">{product.pricePerMonth}</span>
                <span className="text-xl font-semibold">/month</span>
              </div>
              <p className="text-sm text-gray-600 mt-3 font-medium">
                Security Deposit: <span className="font-bold text-2xl text-gray-900">{currency}{product.securityDeposit}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Order Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Order Type *</label>
                <select
                  required
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-white/60 backdrop-blur-sm"
                  disabled={loading}
                >
                  <option value="">Select delivery option</option>
                  <option value="Delivery">🚚 Delivery</option>
                  <option value="Pickup">🏪 Self Pickup</option>
                </select>
              </div>

              {/* Tenure */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rental Duration *</label>
                <select
                  required
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-white/60 backdrop-blur-sm"
                  disabled={loading}
                >
                  <option value="">Choose rental period</option>
                  {product.tenureOptions?.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              {/* Delivery Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setLocalDeliveryDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-white/60 backdrop-blur-sm text-lg"
                  required
                  disabled={loading}
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Address *</label>
                <input
                  type="text"
                  placeholder="Enter full address (street, city, pincode)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-white/60 backdrop-blur-sm text-lg"
                  required
                  disabled={loading}
                />
              </div>

              {/* Add to Cart Button */}
              <button
                type="submit"
                disabled={loading || !tenure || !deliveryDate || !location || !orderType}
                className={`w-full py-5 px-8 rounded-3xl text-xl font-bold shadow-2xl transition-all duration-300 transform flex items-center justify-center gap-3 ${
                  loading || !tenure || !deliveryDate || !location || !orderType
                    ? 'bg-gray-400 cursor-not-allowed shadow-none'
                    : 'bg-linear-to-r from-emerald-500 to-green-600 hover:from-green-600 hover:to-emerald-500 hover:shadow-3xl hover:-translate-y-1 text-white'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <img src={assets.cart} alt="Cart" className="w-6 h-6" />
                    Add to Cart
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
                🔒 No credit card required to reserve
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Productdetails;