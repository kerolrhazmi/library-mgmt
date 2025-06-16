import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { UserAuth } from '../context/AuthContext';
import { FiBell } from 'react-icons/fi';

const Navbar = ({ onGalleryClick, onLoginClick }) => {
  const [hasShadow, setHasShadow] = useState(false);
  const [displayName, setDisplayName] = useState(null);
  const [role, setRole] = useState(null);
  const [showReminders, setShowReminders] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { session, signOut } = UserAuth();

  useEffect(() => {
    const handleScroll = () => setHasShadow(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('display_name, role')
          .eq('id', session.user.id)
          .single();

        if (!error && data) {
          setDisplayName(data.display_name);
          setRole(data.role);
        } else {
          console.error('Error fetching profile:', error?.message);
        }
      }
    };

    fetchProfile();
  }, [session]);

  useEffect(() => {
    const fetchReminders = async () => {
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from('borrow_requests')
        .select(`
          return_date,
          status,
          books (
            title
          )
        `)
        .eq('user_id', session.user.id)
        .eq('status', 'approved');

      if (error) {
        console.error('Error fetching reminders:', error.message);
        return;
      }

      const today = new Date();
      const fiveDaysLater = new Date();
      fiveDaysLater.setDate(today.getDate() + 5);

      const formatDate = (date) => date.toISOString().split('T')[0];
      const todayStr = formatDate(today);
      const fiveDaysLaterStr = formatDate(fiveDaysLater);

      const upcoming = data.filter((entry) => {
        const returnStr = formatDate(new Date(entry.return_date));
        return returnStr >= todayStr && returnStr <= fiveDaysLaterStr;
      });

      setReminders(upcoming);
    };

    fetchReminders();
  }, [session]);

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

  const handleProfileClick = () => {
    navigate('/profile-page');
  };

  const handleLogout = async () => {
    try {
      await signOut();
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center mr-[100px] space-x-5">
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
          {role === 'user' && (
            <NavLink label="Profile" onClick={handleProfileClick} />
          )}
        </div>

        {/* Hamburger (Mobile Only) */}
        <div className="md:hidden">
          <button onClick={() => setDrawerOpen(true)}>
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Desktop Auth Info */}
        <div className="hidden md:flex items-center space-x-4 relative">
          {displayName ? (
            <>
              <FiBell
                size={24}
                className="text-gray-700 hover:text-[#E41B1B] cursor-pointer"
                onClick={() => setShowReminders(!showReminders)}
              />
              {showReminders && (
                <div className="absolute right-0 top-12 bg-white border border-gray-300 rounded-xl shadow-xl w-72 p-4 z-50">
                  <h1 className="font-semibold mb-2 text-gray-800">Reminders</h1>
                  {reminders.length === 0 ? (
                    <p className="text-sm text-gray-600">No upcoming returns.</p>
                  ) : (
                    <ul className="space-y-3 max-h-52 overflow-y-auto pr-1">
                      {reminders.map((reminder, index) => {
                        const returnDate = new Date(reminder.return_date);
                        const today = new Date();
                        const daysLeft = Math.ceil((returnDate - today) / (1000 * 60 * 60 * 24));

                        let badgeColor = 'bg-green-200 text-green-800';
                        if (daysLeft <= 1) badgeColor = 'bg-red-200 text-red-800';
                        else if (daysLeft <= 3) badgeColor = 'bg-yellow-200 text-yellow-800';
                        else if (daysLeft <= 5) badgeColor = 'bg-orange-200 text-orange-800';

                        return (
                          <li key={index} className="border border-gray-200 rounded-md p-2 bg-gray-50 shadow-sm">
                            <p className="font-semibold text-gray-800">{reminder.books.title}</p>
                            <div className="flex items-center justify-between mt-1 text-sm">
                              <span className="text-gray-600">
                                Return by: {returnDate.toLocaleDateString()}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${badgeColor}`}>
                                {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}

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
              onClick={() => {
                navigate('/');
                onLoginClick();
              }}
            >
              Login
            </h1>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[250px] bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={() => setDrawerOpen(false)}>
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col px-4 pt-4 space-y-4">
          <NavLink label="Home" onClick={() => { setDrawerOpen(false); handleHomeClick(); }} />
          <NavLink label="Catalogue" onClick={() => { setDrawerOpen(false); handleGalleryClick(); }} />
          <NavLink label="About" onClick={() => { setDrawerOpen(false); handleAboutClick(); }} />
          {role === 'admin' && (
            <NavLink label="Admin Dashboard" onClick={() => { setDrawerOpen(false); handleAdminDashboardClick(); }} />
          )}
          {role === 'user' && (
            <NavLink label="Profile" onClick={() => { setDrawerOpen(false); handleProfileClick(); }} />
          )}
          {displayName ? (
            <button
              onClick={() => { setDrawerOpen(false); handleLogout(); }}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
            >
              Logout
            </button>
          ) : (
            <h1
              onClick={() => { setDrawerOpen(false); navigate('/'); onLoginClick(); }}
              className="poppins-medium text-[17px] text-black hover:text-[#E41B1B] cursor-pointer"
            >
              Login
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};

const NavLink = ({ label, onClick }) => (
  <h1
    className="poppins-medium text-[17px] hover:text-[#E41B1B] transition duration-300 cursor-pointer"
    onClick={onClick}
  >
    {label}
  </h1>
);

export default Navbar;
