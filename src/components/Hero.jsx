import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gambo3 from '../assets/UPM.png'; // your background image

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search-results?query=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      {/* Background image with gradient blur mask */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${gambo3})`,
          maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
        }}
      />

      {/* Bottom gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 z-10" />

      {/* Content */}
      <div className="relative z-20 flex items-center justify-start h-full px-4 sm:px-8 md:px-16">
        <div className="bg-white bg-opacity-80 p-6 sm:p-8 rounded-md max-w-xl shadow-md w-full mx-auto md:mx-0 md:w-auto">
          <h1 className="playfair-display-gg text-[40px] sm:text-[50px] md:text-[60px] text-black mb-4 text-center md:text-left">
            Search Your Book
          </h1>
          <p className="poppins-medium text-[16px] sm:text-[17px] text-black mb-6 text-center md:text-left">
            Discover books from every genre — fast, easy, and right at your fingertips. Powered by UPM’s digital library
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center md:items-start gap-4">
            <input
              type="text"
              name="search"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-md border border-black focus:outline-none focus:ring-2 focus:ring-[#E41B1B] w-full sm:w-64 h-[45px]"
            />
            <button
              type="submit"
              className="bg-[#E41B1B] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#C41717] transition duration-300 w-full sm:w-36"
            >
              SEARCH
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Hero;
