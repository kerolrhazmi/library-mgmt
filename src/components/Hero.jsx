import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gambo3 from '../assets/vector-Photoroom.png';

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search-results?query=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div>
      <div className="pt-10 bg-gradient-to-r from-gray-200 to-gray-50 h-[600px] w-full flex items-center px-6 justify-between ">
        <div>
          <div className="flex flex-col w-full">
            <h1 className="playfair-display-gg text-[80px] text-[#000000] mb-4 pl-5">
              Search Your Book
            </h1>
            <p className="poppins-medium text-[17px] text-[#000000] mb-4 pl-5">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima
              consequatur numquam ratione.
            </p>
            <form onSubmit={handleSubmit} className="flex mt-4 w-full pl-5">
              <input
                type="text"
                name="search"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex px-4 py-2 rounded-md border-black focus:outline-none focus:ring-2 focus:ring-[#E41B1B] w-80 h-[50px]"
              />
              <button
                type="submit"
                className="bg-[#E41B1B] text-[#ffffff] px-6 py-2 rounded-lg font-bold hover:bg-[#C41717] transition duration-300 w-40"
              >
                SEARCH
              </button>
            </form>
          </div>
        </div>
        <div>
          <img src={gambo3} alt="" width={1000} height={900} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
