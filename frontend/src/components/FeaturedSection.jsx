import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../components/context/AppContext";
import {motion} from 'motion/react'

const FeaturedSection = () => {

  const navigate = useNavigate();

  const { products = [], loadingProducts } = useAppContext();

  const featuredProducts = products.filter((p) => p.available);

  return (
    <motion.div
    initial={{y: 40, opacity: 0}}
    whileInView={{opacity: 1, y: 0}}
    transition={{duration: 1, ease: 'easeOut'}}
    className="flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32 relative overflow-hidden">
      
      {/* Combined Gradient Background - Lighter */}
      <div className="absolute inset-0 z-0 bg-linear-to-br from-white via-gray-50 to-gray-100"></div>
      
      {/* Subtle Pattern Overlay - Increased Opacity */}
      <div className="absolute inset-0 z-0 opacity-15"
        style={{
          backgroundImage: `url(${assets.all_img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>

      {/* Content */}
      <motion.div
       initial={{y: 20, opacity: 0}}
       whileInView={{opacity: 1, y: 0}}
      transition={{duration: 1, delay: 0.5}}
      className="relative z-10 w-full">

        <Title
          title="Featured Products"
          subTitle="Explore our selection of furniture and appliances available for rent."
        />

        {loadingProducts ? (
          <p className="mt-8 text-gray-500">Loading products...</p>
        ) : (

          <motion.div 
           initial={{y: 100, opacity: 0}}
           whileInView={{opacity: 1, y: 0}}
          transition={{duration: 1, delay: 0.5}}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">

            {featuredProducts.length > 0 ? (
              featuredProducts.slice(0,6).map((product)=>(
                <ProductCard key={product._id} product={product}/>
              ))
            ) : (
              <p className="text-gray-400">No products available</p>
            )}

          </motion.div>

        )}

        <motion.button
        initial={{opacity: 0 , y: 20}}
        whileInView={{opacity: 1, y: 0}}
        transition={{delay: 0.6, duration: 0.4}}
          onClick={()=>{
            navigate("/products")
            window.scrollTo(0,0)
          }}
          className="flex items-center justify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md mt-16 cursor-pointer"
        >
          Explore all products
          <img src={assets.arrow_icon} alt="arrow"/>
        </motion.button>

      </motion.div>

    </motion.div>
  );
};

export default FeaturedSection;