import React, { useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { useLocation, NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const Sidebar = () => {
  const { user, fetchUser } = useAppContext();
  const location = useLocation();
  const [image, setImage] = useState(null); // preview before save
  const [displayImage, setDisplayImage] = useState(user?.image || assets.defaultProfile); // actual profile image

  useEffect(() => {
    if (user?.image) setDisplayImage(user.image); // sync after fetchUser
  }, [user?.image]);

  // Upload and save profile image
  const updateImage = async () => {
    if (!image) return;

    try {
      const formData = new FormData();
      formData.append('image', image);

      const { data } = await axios.post('/api/vendor/update-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        // Update local display image immediately
        setDisplayImage(`${data.newImageUrl}?t=${Date.now()}`);
        toast.success(data.message);
        setImage(null); // clear preview
        fetchUser(); // optional: refresh context
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Sidebar links (vendor/admin) – same as your existing code
  const vendorLinks = [
    { name: 'Dashboard', path: '/vendor', icon: assets.dashboardIcon, coloredIcon: assets.dashboardIconColored },
    { name: 'Add Product', path: '/vendor/add-product', icon: assets.addIcon, coloredIcon: assets.addIconColored },
    { name: 'Inventory & Pricing', path: '/vendor/manage-products', icon: assets.listIcon, coloredIcon: assets.listIconColored },
    { name: 'Orders & Rentals', path: '/vendor/manage-orders', icon: assets.order_img, coloredIcon: assets.order_img },
    { name: 'Delivery & Pickup', path: '/vendor/logistics', icon: assets.location_icon, coloredIcon: assets.location_icon_colored },
    { name: 'Maintenance & Damages', path: '/vendor/maintenance', icon: assets.maintain_img, coloredIcon: assets.maintain_img },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin', icon: assets.dashboardIcon, coloredIcon: assets.dashboardIconColored },
    { name: 'Manage Users', path: '/admin/users', icon: assets.users_icon, coloredIcon: assets.users_icon_colored },
    { name: 'Disputes & Claims', path: '/admin/disputes', icon: assets.dispute_icon, coloredIcon: assets.dispute_icon},
    { name: 'Reports & Analytics', path: '/admin/analytics', icon: assets.report_icon, coloredIcon: assets.report_icon },
    { name: 'Service Areas', path: '/admin/service-areas', icon: assets.service_img, coloredIcon: assets.service_img },
  ];

  const renderLinks = (links) =>
    links.map((link, index) => (
      <NavLink
        key={index}
        to={link.path}
        end={link.path === '/admin' || link.path === '/vendor'}
        className={({ isActive }) =>
          `relative flex items-center gap-2 w-full py-3 pl-4 ${
            isActive ? 'bg-primary/10 text-primary' : 'text-gray-600'
          }`
        }
      >
        <img
          src={location.pathname === link.path ? link.coloredIcon : link.icon}
          alt={link.name}
          className="w-5 h-5"
        />
        <span className="max-md:hidden">{link.name}</span>
        {location.pathname === link.path && (
          <div className="bg-primary w-1.5 h-8 rounded-l right-0 absolute" />
        )}
      </NavLink>
    ));

  return (
    <div className="relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm">
      {/* Profile Section */}
      <div className="group relative">
        <label htmlFor="image">
          <img
            src={image ? URL.createObjectURL(image) : displayImage}
            alt="profile"
            className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto object-cover"
          />
          <input
            type="file"
            id="image"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        {image && (
          <button
            onClick={updateImage}
            className="bg-blue-600 text-white text-xs px-2 py-1 rounded mt-2 block mx-auto"
            disabled={!image}
          >
            Save
          </button>
        )}
      </div>

      <p className="mt-2 text-base max-md:hidden font-medium">
        {user?.name} ({user?.role})
      </p>

      <div className="w-full mt-6">
        {user?.role === 'admin' ? (
          <>
            <p className="text-[10px] font-bold text-gray-400 px-4 mb-2 max-md:hidden uppercase">
              Admin Control
            </p>
            {renderLinks(adminLinks)}
          </>
        ) : (
          <>
            <p className="text-[10px] font-bold text-gray-400 px-4 mb-2 max-md:hidden uppercase">
              Vendor Menu
            </p>
            {renderLinks(vendorLinks)}
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;