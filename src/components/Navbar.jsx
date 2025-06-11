import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { UserAuth } from '../context/AuthContext';

const Navbar = ({ onGalleryClick, onLoginClick }) => {
  const [hasShadow, setHasShadow] = useState(false);
  const [displayName, setDisplayName] = useState(null);
  const [role, setRole] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { session, signOut } = UserAuth();

  // Scroll-based shadow effect
  useEffect(() => {
    const handleScroll = () => setHasShadow(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch profile info on session change
  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('display_name, role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error.message);
        } else {
          setDisplayName(data.display_name);
          setRole(data.role);
        }
      }
    };

    fetchProfile();
  }, [session]);

  // Navigation handlers
  const handleHomeClick = () => {
    location.pathname === '/'
      ? window.scrollTo({ top: 0, behavior: 'smooth' })
      : navigate('/');
  };

  const handleGalleryClick = () => {
    location.pathname === '/'
      ? onGalleryClick()
      : navigate('/', { state: { scrollTo: 'catalogue' } });
  };

  const handleAboutClick = () => {
    if (location.pathname === '/') {
      const aboutSection = document.getElementById('about-us');
      aboutSection?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: 'about-us' } });
    }
  };

  const handleAdminDashboardClick = () => {
    navigate('/dashboard-admin');
  };

  const handleLogout = async () => {
    try {
      await signOut(); // Properly sign out user
      setDisplayName(null);
      setRole(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <div className={`fixed top-0 left-0 w-full z-50 transition-shadow duration-300 ${hasShadow ? 'shadow-md' : ''}`}>
      <div className="bg-gradient-to-r from-gray-200 to-gray-50 h-[100px] flex items-center justify-between px-6">
        
        {/* Logo */}
        <div className="flex items-center">
          <span className="special-gothic-expanded-one-regular text-[30px] text-[#E41B1B]">Putra</span>
          <h1 className="special-gothic-expanded-one-regular text-[30px]">Lib</h1>
        </div>

        {/* Navigation */}
        <div className="flex items-center mr-[100px] space-x-5">
          <NavLink label="Home" onClick={handleHomeClick} />
          <NavLink label="Catalogue" onClick={handleGalleryClick} />
          <NavLink label="About" onClick={handleAboutClick} />
          {role === 'admin' && (
            <h1
              onClick={handleAdminDashboardClick}
              className="poppins-medium text-[17px] font-bold text-red-600 cursor-pointer hover:text-red-700"
            >
              Admin Dashboard
            </h1>
          )}
        </div>

        {/* Auth Info */}
        <div className="flex items-center space-x-4">
          {displayName ? (
            <>
              <h1 className="poppins-medium text-[17px] text-black">
                Hello, <span className="text-[#E41B1B] font-bold">{displayName}</span>
              </h1>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <h1
              className="poppins-medium text-[17px] pl-5 hover:text-[#E41B1B] cursor-pointer"
              onClick={onLoginClick}
            >
              Login
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};

// Small reusable nav link component
const NavLink = ({ label, onClick }) => (
  <h1
    className="poppins-medium text-[17px] hover:text-[#E41B1B] transition duration-300 cursor-pointer"
    onClick={onClick}
  >
    {label}
  </h1>
);

export default Navbar;
