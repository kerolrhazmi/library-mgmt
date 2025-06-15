import React from 'react';
import librari from '../assets/libraroi.jpeg';
import { Link } from "react-router-dom";

const Login = ({ refProp }) => {
  return (
    <div ref={refProp}>
      <div className="relative min-h-screen w-full flex items-center justify-center">
        
        {/* Background Blur */}
        <div 
          className="absolute inset-0 bg-cover bg-center blur-[2px]"
          style={{ backgroundImage: `url(${librari})` }}
        ></div>

        {/* Content Container */}
        <div className="relative z-10 bg-gradient-to-r from-gray-200 to-gray-50 w-full max-w-[1100px] mx-4 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] flex items-center justify-center py-10">
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            
            {/* Admin Card */}
            <Link to="/login-admin">
              <div className="w-[300px] md:w-[400px] h-[450px] md:h-[500px] bg-white shadow-md hover:shadow-lg transition-shadow rounded-md flex items-center justify-center flex-col cursor-pointer">
                <svg 
                  className="h-[80px] w-[80px] md:h-[100px] md:w-[100px] text-red-500 mb-5 hover:scale-105 transition-transform"  
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="poppins-medium text-[17px] text-[#000000]">Login as Admin</p>
              </div>
            </Link>

            {/* Student Card */}
            <Link to="/login-student">
              <div className="w-[300px] md:w-[400px] h-[450px] md:h-[500px] bg-white shadow-md hover:shadow-lg transition-shadow rounded-md flex items-center justify-center flex-col cursor-pointer">
                <svg 
                  className="h-[80px] w-[80px] md:h-[100px] md:w-[100px] text-red-500 mb-5 hover:scale-105 transition-transform"  
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="poppins-medium text-[17px] text-[#000000]">Login as Student</p>
              </div>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
