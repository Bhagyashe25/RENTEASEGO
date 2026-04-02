import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import {motion} from 'motion/react'

const Footer = () => {
  return (
    <motion.div
     initial={{y: 30, opacity: 0}}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 0.6}}
    className='relative overflow-hidden'>
      
      {/* Background Gradient */}
      <motion.div
       initial={{y: 20, opacity: 0}}
       whileInView={{opacity: 1, y: 0}}
      transition={{duration: 0.6, delay: 0.2}}
      className="absolute inset-0 z-0 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900"></motion.div>
      
      {/* Decorative Shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-pink-500/10 rounded-full blur-2xl"></div>
      
      {/* Content */}
      <div className="relative z-10 px-6 md:px-16 lg:px-24 xl:px-32 text-sm text-gray-400 pt-12">
        
        {/* Top Border */}
        <div className="flex flex-wrap justify-between items-start gap-8 pb-8 border-b border-gray-700">
          
          {/* Company Info */}
          <motion.div 
           initial={{opacity: 0}}
           whileInView={{opacity: 1}}
           transition={{duration: 0.5, delay: 0.3}}
          className="flex-1 min-w-64">
            <img src={assets.logo} alt="logo" className='h-8 md:h-9' />
            <motion.p
             initial={{opacity: 0}}
                 whileInView={{opacity: 1}}
             transition={{duration: 0.5, delay: 0.4}}
            className='max-w-80 mt-4 text-gray-300'>
              Premium Furniture rental service with a wide selection of luxury items for your home and office.
            </motion.p>
            <motion.div
             initial={{opacity: 0}}
             whileInView={{opacity: 1}}
             transition={{duration: 0.5, delay: 0.5}}
            className='flex items-center gap-4 mt-6'>
              <a href='#' className='hover:text-white transition-colors'>
                <img src={assets.facebook_logo} className='w-5 h-5' alt='' />
              </a>
              <a href='#' className='hover:text-white transition-colors'>
                <img src={assets.instagram_logo} className='w-5 h-5' alt='' />
              </a>
              <a href='#' className='hover:text-white transition-colors'>
                <img src={assets.twitter_logo} className='w-5 h-5' alt='' />
              </a>
              <a href='#' className='hover:text-white transition-colors'>
                <img src={assets.gmail_logo} className='w-5 h-5' alt='' />
              </a>
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <div className="flex-1 min-w-40">
            <h2 className='text-base font-medium text-white uppercase tracking-wide'>Quick Links</h2>
            <ul className='mt-4 flex flex-col gap-2'>
              <li><Link to="/" className='hover:text-white transition-colors'>Home</Link></li>
              <li><Link to="/products" className='hover:text-white transition-colors'>Browse Products</Link></li>
              <li><Link to="/list-product" className='hover:text-white transition-colors'>List Your Products</Link></li>
              <li><Link to="/about" className='hover:text-white transition-colors'>About Us</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex-1 min-w-40">
            <h2 className='text-base font-medium text-white uppercase tracking-wide'>Resources</h2>
            <ul className='mt-4 flex flex-col gap-2'>
              <li><Link to="/help" className='hover:text-white transition-colors'>Help Center</Link></li>
              <li><Link to="/terms" className='hover:text-white transition-colors'>Terms and Condition</Link></li>
              <li><Link to="/privacy" className='hover:text-white transition-colors'>Privacy Policy</Link></li>
              <li><Link to="/insurance" className='hover:text-white transition-colors'>Insurance</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex-1 min-w-40">
            <h2 className='text-base font-medium text-white uppercase tracking-wide'>Contact</h2>
            <ul className='mt-4 flex flex-col gap-2'>
              <li>123 Luxury Furniture</li>
              <li>San Francisco, CA 97812</li>
              <li>+91 1234567890</li>
              <li>info@example.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='flex flex-col md:flex-row gap-4 items-center justify-between py-6 border-t border-gray-700 mt-8'>
          <p className='text-gray-400'>© {new Date().getFullYear()} All rights reserved.</p>
          <ul className='flex items-center gap-4 text-gray-400'>
            <li><Link to="/privacy" className='hover:text-white transition-colors'>Privacy</Link></li>
            <li><span className='text-gray-600'>|</span></li>
            <li><Link to="/terms" className='hover:text-white transition-colors'>Terms</Link></li>
            <li><span className='text-gray-600'>|</span></li>
            <li><Link to="/cookies" className='hover:text-white transition-colors'>Cookies</Link></li>
          </ul>
        </div>

      </div>
    </motion.div>
  )
}

export default Footer