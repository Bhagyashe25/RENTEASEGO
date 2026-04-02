import React from 'react'
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const NavbarAdmin = () => {
  const { user } = useAppContext();

  return (
    <div className='flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-borderColor relative transition-all'>
      <Link to='/'>
        <img src={assets.logo} alt="logo" className="h-7" />
      </Link>
      <Link to='/'> 
        <button className="ml-auto flex items-center gap-2 px-9 py-3 bg-primary hover:bg-primary-dull text-white rounded-full" >Home</button>
      </Link>
    
    </div>
  );
}

export default NavbarAdmin;