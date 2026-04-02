// pages/admin/AddProduct.js
import React, { useState, useEffect } from 'react';
import Title from '../../components/admin/Title';
import { useAppContext } from '../../components/context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const { user } = useAppContext();
  const [product, setProduct] = useState({
    name: '',
    category: '',
    description: '',
    pricePerDay: '',
    pricePerWeek: '',
    pricePerMonth: '',
    securityDeposit: '',
    image: null,
    tenureOptions: [],
    locations: [],
    orderType: 'Delivery',
  });
  const [loading, setLoading] = useState(false);
  const [serviceAreas, setServiceAreas] = useState([]); 
  const [loadingAreas, setLoadingAreas] = useState(true);

  // ✅ Fetch service areas on component mount
  useEffect(() => {
    const fetchServiceAreas = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/admin/service-areas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) {
          setServiceAreas(data.areas || []);
        }
      } catch (error) {
        console.error("Failed to fetch service areas:", error);
      } finally {
        setLoadingAreas(false);
      }
    };

    fetchServiceAreas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleTenure = (option) => {
    setProduct(prev => ({
      ...prev,
      tenureOptions: prev.tenureOptions.includes(option)
        ? prev.tenureOptions.filter(t => t !== option)
        : [...prev.tenureOptions, option],
    }));
  };

  // ✅ Handle multiple location selection
  const handleLocationChange = (location) => {
    setProduct(prev => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location],
    }));
  };

  const handleFileChange = (e) => {
    setProduct(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("=== Form State Before Submit ===");
    console.log("Product State:", product);
    console.log("Image File:", product.image);
    console.log("Selected Locations:", product.locations);

    if (!product.name || !product.category || !product.description || !product.image || product.locations.length === 0 || !product.orderType) {
      alert("Please fill in all required fields, select locations, and add an image.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("category", product.category);
      formData.append("pricePerDay", product.pricePerDay || 0);
      formData.append("pricePerWeek", product.pricePerWeek || 0);
      formData.append("pricePerMonth", product.pricePerMonth || 0);
      formData.append("securityDeposit", product.securityDeposit || 0);
      formData.append("tenureOptions", JSON.stringify(product.tenureOptions));
      formData.append("locations", JSON.stringify(product.locations)); 
      formData.append("orderType", product.orderType);
      formData.append("image", product.image);

      console.log("=== FormData Entries ===");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const { data } = await axios.post("/api/vendor/add-product", formData, {
        headers: { "Content-Type": "multipart/form-data" , 
           Authorization: `Bearer ${token}`
         },
       
      });

      if (data.success) {
        toast.success("Product added successfully");
        setProduct({
          name: '',
          category: '',
          description: '',
          pricePerDay: '',
          pricePerWeek: '',
          pricePerMonth: '',
          securityDeposit: '',
          image: null,
          tenureOptions: [],
          locations: [], 
          orderType: 'Delivery',
        });
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Add Product Error:", err);
      console.error("Error Response:", err.response?.data);
      alert("Failed to add product. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full max-w-4xl">
      <Title title="Add New Inventory" subTitle="Set pricing, deposits, and available rental durations." />
      <form className="mt-8 space-y-6 text-gray-600" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="border p-2 rounded"
            required
          />
          
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Category</option>
            <optgroup label="Furniture">
              <option value="Bed">Bed</option>
              <option value="Sofa">Sofa</option>
              <option value="Table">Table</option>
            </optgroup>
            <optgroup label="Appliances">
              <option value="Fridge">Fridge</option>
              <option value="Washing Machine">Washing Machine</option>
              <option value="TV">TV</option>
            </optgroup>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <input
            type="number"
            name="pricePerDay"
            value={product.pricePerDay}
            onChange={handleChange}
            placeholder="Price/Day"
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="pricePerWeek"
            value={product.pricePerWeek}
            onChange={handleChange}
            placeholder="Price/Week"
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="pricePerMonth"
            value={product.pricePerMonth}
            onChange={handleChange}
            placeholder="Price/Month"
            className="border p-2 rounded"
          />
        </div>
        
        {/* ✅ Multi-select Service Areas */}
        <div>
          <label className="block mb-2 font-medium">Service Areas <span className="text-red-500">*</span></label>
          {loadingAreas ? (
            <p className="text-gray-500">Loading service areas...</p>
          ) : serviceAreas.length === 0 ? (
            <p className="text-gray-500">No service areas available. Please contact admin.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2 border rounded-lg bg-gray-50">
              {serviceAreas.map((area) => (
                <button
                  key={area._id}
                  type="button"
                  onClick={() => handleLocationChange(area.area)}
                  className={`px-3 py-2 rounded-full text-sm border transition-all ${
                    product.locations.includes(area.area)
                      ? 'bg-primary text-white border-primary shadow-md'
                      : 'bg-white border-gray-300 hover:border-primary hover:bg-gray-50'
                  }`}
                >
                  {area.area}
                </button>
              ))}
            </div>
          )}
          {product.locations.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: <span className="font-medium">{product.locations.join(', ')}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="orderType"
            value={product.orderType}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          >
            <option value="Delivery">Delivery</option>
            <option value="Pickup">Pickup</option>
          </select>

          <input
            type="number"
            name="securityDeposit"
            value={product.securityDeposit}
            onChange={handleChange}
            placeholder="Security Deposit Amount"
            className="border p-2 rounded"
            required
          />
        </div>

        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Product Description"
          rows="4"
          className="w-full border p-2 rounded"
          required
        />

        <div>
          <label className="block mb-2 font-medium">Available Tenure Options</label>
          <div className="flex gap-4 flex-wrap">
            {['3 Months', '6 Months', '12 Months'].map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => handleTenure(opt)}
                className={`px-4 py-2 rounded-full border ${
                  product.tenureOptions.includes(opt) 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-white border-gray-300 hover:border-primary'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">Product Image</label>
          <input type="file" accept="image/*" onChange={handleFileChange} required />
        </div>

        <button 
          type="submit" 
          className="bg-primary text-white px-10 py-3 rounded-md hover:bg-primary-dull transition-all w-full md:w-auto" 
          disabled={loading}
        >
          {loading ? "Listing..." : "List Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;