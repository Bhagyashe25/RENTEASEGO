import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../components/context/AppContext";
import {motion} from 'motion/react'

const Hero = () => {
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const { serviceLocations, loadingLocations } = useAppContext();

  const handleSearch = (e) => {
    e.preventDefault();

    // Debug: Log what's being sent
    console.log("Hero Search - Category:", category);
    console.log("Hero Search - Location:", location);

    // Navigate to products page with filters
    navigate(`/products?category=${category}&location=${location}`);
  };

  return (
    <motion.div 
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    transition={{duration: 0.8}}
    className="min-h-screen flex flex-col items-center justify-center gap-14 text-center px-4 relative overflow-hidden">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${assets.all_img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl px-4">
        
        {/* Title */}
        <motion.h1
        initial={{y: 50, opacity: 0}}
        animate={{y: 0, opacity: 1}}
       transition={{duration: 0.8, delay: 0.2}}
        className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-4 drop-shadow-lg">
          Rent Furniture & Appliances Easily
        </motion.h1>
      </div>

      {/* Search Form */}
      <div className="relative z-10 w-full max-w-2xl px-4">
        <motion.form
        initial={{scale: 0.95, y: 50, opacity: 0}}
           animate={{scale: 1, y: 0, opacity: 1}}
         transition={{duration: 0.6, delay: 0.4}}
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row items-center gap-4 p-6 rounded-full w-full bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.2)] justify-center"
        >

          {/* Location */}
          <div className="flex flex-col items-start w-full md:w-auto">
            <label className="font-medium text-gray-700 text-sm">Location</label>

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="text-sm text-gray-600 outline-none bg-transparent w-full md:w-48"
            >
              <option value="">All Locations</option>
              
              {loadingLocations ? (
                <option>Loading...</option>
              ) : (
                serviceLocations?.map((loc) => (
                  <option key={loc._id} value={loc.area}>
                    {loc.area}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Category */}
          <div className="flex flex-col items-start w-full md:w-auto">
            <label className="font-medium text-gray-700 text-sm">Category</label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-sm text-gray-600 outline-none bg-transparent w-full md-w-48"
            >
              <option value="">All Products</option>

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

          {/* Search Button */}
          <motion.button
          whileHover={{scale: 1.05}}
          whileTap={{scale: 0.95}}
            type="submit"
            className="w-full md:w-auto flex items-center justify-center gap-5 px-9 py-3 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer transition-all duration-300"
          >
            <motion.img
            initial={{y: 100, opacity: 0}}
           animate={{y: 0, opacity: 1}}
           transition={{duration: 0.8, delay: 0.6}}
              src={assets.search_icon}
              alt="search"
              className="brightness-300 w-4"
            />
            Search
          </motion.button>

        </motion.form>
      </div>

    </motion.div>
  );
};

export default Hero;