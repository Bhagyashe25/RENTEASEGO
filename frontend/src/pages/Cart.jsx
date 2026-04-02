import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import { useAppContext } from '../components/context/AppContext'

const Cart = () => {
  const { cartItems, fetchCart, checkout, currency, removeCartItem } = useAppContext()
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    fetchCart() // fetch real cart items on load
  }, [])

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0), 0)
  const totalDeposit = cartItems.reduce((sum, item) => sum + (item.securityDeposit || 0), 0)

  // Handle single checkout for all items
  const handleCheckout = async () => {
    if (cartItems.length === 0) return

    try {
      setLoading(true)
      // Call checkout with all cart item IDs
      await checkout(cartItems.map(item => item._id))
      fetchCart() // refresh cart after checkout
    } catch (error) {
      console.log(error)
      alert("Failed to place order")
    } finally {
      setLoading(false)
    }
  }

  // Handle remove item
  const handleRemoveItem = async (cartId) => {
    try {
      await removeCartItem(cartId)
      fetchCart() // refresh cart after removal
    } catch (error) {
      console.log(error)
      alert("Failed to remove item")
    }
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className='pt-24 px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl'>
        <Title title='My Cart' subTitle='View and manage your cart items' align="left" />
        <div className='text-center text-gray-500 mt-12'>
          <p className='text-lg'>Your cart is empty</p>
          <button
            onClick={() => window.location.href = '/products'}
            className='mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dull transition'
          >
            Browse Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='pt-24 px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl'>

      <Title 
        title='My Cart'
        subTitle='View and manage your cart items'
        align="left"
      />

      <div>
        {cartItems.map((cart, index) => (
          <div key={cart._id} className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12'>

            {/* Product Info */}
            <div className='md:col-span-1'>
              <div className='rounded-md overflow-hidden mb-3 relative'>
                <img 
                  src={cart.product?.image} 
                  alt="" 
                  className='w-full h-auto aspect-video object-cover'
                />
                <button
                  onClick={() => handleRemoveItem(cart._id)}
                  className='absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition'
                  title="Remove item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <p className='text-lg font-medium mt-2'>
                {cart.product?.name}
              </p>

              <p className='text-gray-500'>
                {cart.product?.category} • {cart.product?.type || "N/A"}
              </p>
            </div>

            {/* Cart Info */}
            <div className='md:col-span-2'>
              <div className='flex items-center gap-2'>
                <p className='px-3 py-1.5 bg-light rounded'>
                  Order #{index + 1}
                </p>
                <p className={`px-3 py-1 text-xs rounded-full
                  ${cart.status === 'confirmed'
                    ? 'bg-green-400/15 text-green-600'
                    : 'bg-yellow-400/15 text-yellow-600'
                  }`}>
                  {cart.status}
                </p>
              </div>

              <div className='flex items-start gap-2 mt-3'>
                <img 
                  src={assets.calendar_icon_colored} 
                  alt="" 
                  className='w-4 h-4 mt-1'
                />
                <div>
                  <p className='text-gray-500'>Rental Tenure</p>
                  <p>{cart.tenure || `${cart.deliveryDate?.split('T')[0]} - ${cart.pickupDate?.split('T')[0]}`}</p>
                </div>
              </div>

              <div className='flex items-start gap-2 mt-3'>
                <img 
                  src={assets.cautionIconColored} 
                  alt="" 
                  className='w-4 h-4 mt-1'
                />
                <div>
                  <p className='text-gray-500'>Security Deposit</p>
                  <p>{currency}{cart.securityDeposit || 0}</p>
                </div>
              </div>

              <div className='flex items-start gap-2 mt-3'>
                <img 
                  src={assets.date_icon} 
                  alt="" 
                  className='w-4 h-4 mt-1'
                />
                <div>
                  <p className='text-gray-500'>Added on</p>
                  <p>{cart.createdAt ? new Date(cart.createdAt).toLocaleDateString() : "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className='md:col-span-1 flex flex-col justify-between gap-6'>
              <div className='text-sm text-gray-500 text-right'>
                <p>Rental Price</p>
                <h1 className='text-2xl font-semibold text-primary'>
                  {currency}{cart.price || 0}
                </h1>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Checkout Summary Section */}
      <div className='mt-12 p-6 border border-borderColor rounded-lg bg-gray-50'>
        <h2 className='text-xl font-semibold mb-4'>Order Summary</h2>
        
        <div className='flex justify-between items-center mb-2'>
          <p className='text-gray-600'>Total Items</p>
          <p className='font-medium'>{cartItems.length}</p>
        </div>

        <div className='flex justify-between items-center mb-2'>
          <p className='text-gray-600'>Rental Price</p>
          <p className='font-medium'>{currency}{totalPrice}</p>
        </div>

        <div className='flex justify-between items-center mb-2'>
          <p className='text-gray-600'>Security Deposit</p>
          <p className='font-medium'>{currency}{totalDeposit}</p>
        </div>

        <div className='border-t border-gray-300 my-4'></div>

        <div className='flex justify-between items-center mb-6'>
          <p className='text-lg font-semibold'>Total Amount</p>
          <p className='text-2xl font-bold text-primary'>{currency}{totalPrice + totalDeposit}</p>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-medium transition
            ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-primary hover:bg-primary-dull'
            }`}
        >
          {loading ? 'Processing...' : 'Proceed to Checkout'}
        </button>

        <p className='text-xs text-gray-500 mt-3 text-center'>
          By proceeding, you agree to our Terms and Conditions
        </p>
      </div>

    </div>
  )
}

export default Cart