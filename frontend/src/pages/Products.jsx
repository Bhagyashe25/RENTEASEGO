import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../components/context/AppContext";
import { motion } from 'motion/react';

const Products = () => {
  const { products, fetchProducts } = useAppContext(); // ✅ Add fetchProducts
  const [input, setInput] = useState("");

  const locationHook = useLocation();
  const queryParams = new URLSearchParams(locationHook.search);
  const categoryParam = queryParams.get("category");
  const locationParam = queryParams.get("location");
  const searchParam = queryParams.get("search");

  // ✅ FETCH PRODUCTS ON MOUNT
  useEffect(() => {
    if (!products || products.length === 0) {
      fetchProducts(); // ✅ Load products if empty
    }
  }, [fetchProducts, products]);

  useEffect(() => {
    if (searchParam) setInput(searchParam);
  }, [searchParam]);

  // ✅ FIXED Debug - Safe array handling
  useEffect(() => {
    console.log("=== Products Page Debug ===");
    console.log("Category Param:", categoryParam);
    console.log("Location Param:", locationParam);
    console.log("Total Products:", products?.length || 0);
    
    if (products?.length > 0) {
      console.log("✅ First Product:", products[0]);
      const allCategories = [...new Set(products.map(p => p.category))];
      const allLocations = [...new Set(products.flatMap(p => p.location || []))];
      console.log("Categories:", allCategories);
      console.log("Locations:", allLocations);
    } else {
      console.log("❌ No products - check AppContext/fetchProducts");
    }
  }, [products, categoryParam, locationParam]);

  // ✅ FIXED SAFE FILTERING
  const filteredProducts = (products || []).filter((product) => {
    // Safe search
    const normalizedInput = input.toLowerCase().trim();
    const normalizedName = (product.name || '').toLowerCase().trim();
    const normalizedCategory = (product.category || '').toLowerCase().trim();

    const matchesSearch = !input || 
      normalizedName.includes(normalizedInput) || 
      normalizedCategory.includes(normalizedInput);

    // Safe category
    const normalizedCategoryParam = (categoryParam || '').toLowerCase().trim();
    const matchesCategory = !categoryParam || 
      normalizedCategory === normalizedCategoryParam;

    // ✅ FIXED SAFE LOCATION ARRAY HANDLING
    const normalizedLocationParam = (locationParam || '').toLowerCase().trim();
    const matchesLocation = !locationParam || 
      (Array.isArray(product.location) ? 
        product.location.some(loc => (loc || '').toLowerCase().trim() === normalizedLocationParam) :
        (product.location || '').toLowerCase().trim() === normalizedLocationParam
      );

    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="pt-29 flex flex-col items-center py-13 bg-light max-md:px-4"
      >
        <Title
          title="Available Products"
          subTitle="Browse our selection of premium furniture and appliances available for your residency"
        />
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow"
        >
          <img src={assets.search_icon} className="w-4.5 h-4.5 mr-2" />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search by product name or category"
            className="w-full h-full outline-none text-gray-500"
          />
          <img src={assets.filter_icon} className="w-4.5 h-4.5 ml-2" />
        </motion.div>
      </motion.div>

      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
        <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
          Showing {filteredProducts.length} of {products?.length || 0} Products
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto"
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : products?.length > 0 ? (
            <p className="text-gray-400 col-span-full text-center py-20">
              No products match your search. Try different keywords.
            </p>
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-400 text-xl mb-4">No products available</p>
              <p className="text-sm text-gray-500">
                Products are loading... Check if vendor has added inventory.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Products;