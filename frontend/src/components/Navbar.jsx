// components/Navbar.js
import React, { useState } from "react";
import { assets, menuLinks } from "../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "./context/AppContext";
import {motion} from 'motion/react'

const Navbar = () => {

  const { setShowLogin, user, logout, isAdmin, isVendor, changeRole, setLoginType, loginType, } = useAppContext()

  const location = useLocation()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("") 

  // Check if we should show fixed navbar (exclude vendor and admin dashboards)
  const isFixedNavbar = !location.pathname.startsWith("/vendor") && 
                        !location.pathname.startsWith("/admin")

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); 
    }
  };

  return (

    <motion.div 
    initial={{y: -20, opacity: 0}}
    animate={{y: 0, opacity: 1}}
    transition={{duration: 0.5}}
    className={`w-full border-b border-borderColor ${location.pathname === "/" ? "bg-light" : "bg-white"} ${isFixedNavbar ? "fixed top-0 left-0 z-50" : ""}`}>

      <div className="max-w-8xl mx-auto flex items-center justify-between px-6 py-4">

        {/* LOGO */}
        <Link to="/" className="flex items-center justify-start gap-9">
            <motion.img whileHover={{scale: 1.05}} src={assets.logo} alt="logo" className="h-20 w-70" />
          </Link>

        {/* MENU + SEARCH */}
        <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">

          {menuLinks.map((link, index) => (
            <Link key={index} to={link.path}>
              {link.name}
            </Link>
          ))}

          {/* SEARCH BAR */}
          <form onSubmit={handleSearch} className="flex items-center border border-gray-300 rounded-full px-4 py-1.5 w-44 gap-3 ml-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Products"
              className="outline-none bg-transparent w-full text-sm"
            />
            <button type="submit">
              <img src={assets.search_icon} alt="search" className="w-4" />
            </button>
          </form>
        </div>

        {/* ADMIN DASHBOARD */}
        {isAdmin && (
          <button
            onClick={() => navigate("/admin")}
            className="font-medium text-gray-800"
          >
            Admin Dashboard
          </button>
        )}

        {/* VENDOR DASHBOARD */}
        {isVendor && (
          <button
            onClick={() => navigate("/vendor")}
            className="font-medium text-gray-800"
          >
            Vendor Dashboard
          </button>
        )}

        {/* LOGIN / USER */}
        {!user ? (
          <button
            onClick={() => {
              setLoginType("user");
              setShowLogin(true);
            }}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dull transition"
          >
            Login
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <p className="font-medium text-gray-700">
              Hi, {user.name}
            </p>
            {!isVendor && !isAdmin && (
              <button
                onClick={changeRole}
                className="bg-green-600 text-white px-2 py-1 rounded-lg"
              >
                Become Vendor
              </button>
            )}
            <button
              onClick={logout}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        )}

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
        </button>

      </div>

    </motion.div>
  )
}

export default Navbar