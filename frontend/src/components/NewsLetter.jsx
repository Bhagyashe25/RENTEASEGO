import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import {easeOut, motion} from 'motion/react'

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    try {
      setStatus('loading');
      
      
      const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
      if (!subscribers.includes(email.toLowerCase())) {
        subscribers.push(email.toLowerCase());
        localStorage.setItem('subscribers', JSON.stringify(subscribers));
      }

      setStatus('success');
      setMessage('✅ Successfully subscribed! Check your inbox for welcome email.');
      setEmail('');
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 4000);

    } catch (error) {
      console.error('Subscription error:', error);
      setStatus('error');
      setMessage('❌ Failed to subscribe. Please try again.');
    }
  };

  return (
    <motion.div
     initial={{y: 30, opacity: 0}}
       whileInView={{opacity: 1, y: 0}}
      transition={{duration: 0.6, ease: 'easeOut'}}
      viewport={{once: true, amount: 0.3}}
    className="py-20 px-6 md:px-16 lg:px-24 xl:px-32 bg-linear-to-b from-gray-50/50 to-white">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-blue-600 text-lg font-semibold bg-blue-100/60 px-4 py-2 rounded-full mx-auto backdrop-blur-sm">
            <Mail className="w-5 h-5" />
            <span>Newsletter</span>
          </div>
          <motion.h1 
           initial={{y: 20, opacity: 0}}
             whileInView={{opacity: 1, y: 0}}
           transition={{duration: 0.5, delay: 0.2}}
          className="text-3xl md:text-4xl lg:text-5xl font-black bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
            Never Miss a Deal!
          </motion.h1>
          <motion.p
           initial={{y: 20, opacity: 0}}
             whileInView={{opacity: 1, y: 0}}
         transition={{duration: 0.5, delay: 0.3}}
          className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Subscribe to get the latest offers, new arrivals, and exclusive discounts
          </motion.p>
        </div>

        {/* Form */}
        <motion.form 
         initial={{y: 20, opacity: 0}}
         whileInView={{opacity: 1, y: 0}}
          transition={{duration: 0.5, delay: 0.4}}
        onSubmit={handleSubmit} className="max-w-2xl w-full mx-auto">
          <div className={`relative group ${status === 'success' ? 'bg-green-50/80' : status === 'error' ? 'bg-red-50/80' : 'bg-white/70'}`}>
            <input
              className="w-full h-14 px-6 pr-0 text-lg border-2 border-gray-200/50 rounded-2xl rounded-r-none focus:border-blue-400 focus:outline-none transition-all bg-white/60 backdrop-blur-sm peer placeholder:text-gray-500"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === 'loading' || status === 'success'}
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className={`absolute right-1 top-0.5 h-12 px-8 rounded-2xl rounded-l-none font-semibold text-lg transition-all duration-300 transform group-hover:scale-105 ${
                status === 'loading'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : status === 'success'
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-linear-to-r from-primary to-primary-dull hover:from-primary-dull hover:to-primary shadow-lg hover:shadow-xl'
              } text-white flex items-center justify-center gap-2`}
            >
              {status === 'loading' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Subscribing...
                </>
              ) : status === 'success' ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Subscribed!
                </>
              ) : (
                'Subscribe'
              )}
            </button>
          </div>

          {/* Status Message */}
          {status !== 'idle' && (
            <div className={`mt-4 p-4 rounded-2xl backdrop-blur-sm border transition-all ${
              status === 'success' 
                ? 'bg-green-50/80 border-green-200 text-green-800' 
                : 'bg-red-50/80 border-red-200 text-red-800'
            }`}>
              {message}
            </div>
          )}
        </motion.form>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 pt-12 border-t border-gray-200/50 max-w-2xl mx-auto text-sm md:text-base">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">10K+</div>
            <div className="text-gray-600 mt-1">Subscribers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">50%</div>
            <div className="text-gray-600 mt-1">Avg Discount</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">Daily</div>
            <div className="text-gray-600 mt-1">Deals</div>
          </div>
        </div>

        {/* Privacy */}
        <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
          We respect your privacy. Unsubscribe at any time.{' '}
          <a href="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</a>
        </p>
      </div>
    </motion.div>
  );
};

export default NewsLetter;