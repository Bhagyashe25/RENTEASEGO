import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const currency = import.meta.env.VITE_CURRENCY

  // 🔍 DEBUG - Check your data
  console.log('🔍 Product:', product)
  console.log('📱 Category:', product?.category)
  console.log('📱 Type:', product?.type)

  return (
    <div
      onClick={() => {
        navigate(`/product-details/${product._id}`)
        window.scrollTo(0, 0) // ✅ Fixed scrollTo
      }}
      className='group rounded-xl overflow-hidden shadow-lg 
      hover:-translate-y-1 transition-all duration-500 cursor-pointer
      bg-linear-to-br from-white to-gray-50' // ✅ Fixed: bg-linear-to-br → bg-gradient-to-br
    >
      {/* Image */}
      <div className='relative h-48 overflow-hidden'>
        <img
          src={product.image}
          alt={product.name}
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
        />

        {product.isAvailable && (
          <p className='absolute top-4 left-4 bg-blue-500 text-white text-xs px-2.5 py-1 rounded-full'> {/* ✅ Fixed bg-primary */}
            Available
          </p>
        )}

        <div className='absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg z-10'>
          <span className='font-semibold'>{currency}{product.pricePerMonth}</span>
          <span className='text-sm text-white/80'> /month</span>
        </div>
      </div>

      {/* Content */}
      <div className='p-4 sm:p-5'>
        <h3 className='text-lg font-medium text-gray-800 mb-2'>{product.name}</h3>

        {/* Category & Type Row */}
        <p className='text-sm text-gray-600 mb-4 font-medium'>
          {product.category || 'No Category'} • {product.type || 'No Type'}
        </p>

        {/* Details Grid */}
        <div className='grid grid-cols-2 gap-y-3 text-sm text-gray-700 space-y-1'>
          
 

          {/* 2️ CATEGORY - THIS WILL SHOW "Furniture" or "Appliances" */}
          <div className='flex items-center py-1'>
            <img 
              src={assets.category_icon} 
              alt="Category icon"
              className='h-4 w-4 mr-2 shrink-0'
              onError={(e) => console.error('❌ category_icon failed:', assets.category_icon)}
            />
            <span className='font-medium bg-gray-100 px-2 py-1 rounded-md'>
              {product.category || 'Category N/A'}
            </span>
          </div>

          {/* 3️ TENURE */}
          <div className='flex items-center py-1'>
            <img src={assets.tenure_icon} alt="Tenure" className='h-4 w-4 mr-2 shrink-0'/>
            <span>{product.tenureOptions?.[0] || 'N/A'}</span>
          </div>

          {/* 4️ DEPOSIT */}
          <div className='flex items-center py-1'>
            <img src={assets.check_icon} alt="Deposit" className='h-4 w-4 mr-2 shrink-0'/>
            <span>Deposit: {currency}{product.securityDeposit || 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard