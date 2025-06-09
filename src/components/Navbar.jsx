import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const Navbar = ({ onGalleryClick, onLoginClick }) => {
  const [hasShadow, setHasShadow] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { session, signOut } = UserAuth();

  const displayName = session?.user?.user_metadata?.display_name || null;

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const handleGalleryClick = () => {
    if (location.pathname === '/') {
      onGalleryClick();
    } else {
      navigate('/', { state: { scrollTo: 'catalogue' } });
    }
  };

  const handleAboutClick = () => {
    if (location.pathname === '/') {
      const aboutSection = document.getElementById('about-us');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollTo: 'about-us' } });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => setHasShadow(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <div
        className={`fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-gray-200 to-gray-50 h-[100px] flex items-center px-6 justify-between transition-shadow duration-300 ${
          hasShadow ? 'shadow-md' : ''
        }`}
      >
        <div className="flex">
          <span className="special-gothic-expanded-one-regular text-[30px] text-[#E41B1B]">Putra</span>
          <h1 className="special-gothic-expanded-one-regular text-[30px]">Lib</h1>
        </div>

        <div className="flex mr-[100px]">
          <h1
            className="poppins-medium text-[17px] pl-5 hover:text-[#E41B1B] transition duration-300 cursor-pointer"
            onClick={handleHomeClick}
          >
            Home
          </h1>

          <h1
            className="poppins-medium text-[17px] pl-5 hover:text-[#E41B1B] transition duration-300 cursor-pointer"
            onClick={handleGalleryClick}
          >
            Catalogue
          </h1>

          <h1
            className="poppins-medium text-[17px] pl-5 hover:text-[#E41B1B] transition duration-300 cursor-pointer"
            onClick={handleAboutClick}
          >
            About
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {displayName ? (
            <>
              <h1 className="poppins-medium text-[17px] text-black">
                Hello,{' '}
                <span className="poppins-medium text-[17px] text-[#E41B1B] font-bold">
                  {displayName}
                </span>
              </h1>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded cursor-pointer transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <h1
              className="poppins-medium text-[17px] pl-5 hover:text-[#E41B1B] transition duration-300 cursor-pointer"
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

export default Navbar;
