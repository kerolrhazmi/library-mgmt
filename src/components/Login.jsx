import React from 'react';
import librari from '../assets/libraroi.jpeg';
import { Link } from "react-router-dom"; // Import Link for navigation

const Login = ({ refProp }) => {
  return (
    <div ref={refProp}>
      <div 
        className='relative h-[800px] w-full flex items-center justify-center flex-col'
      >
        
        <div 
          className='absolute inset-0 bg-cover bg-center h-full w-full blur-[2px]'
          style={{ backgroundImage: `url(${librari})` }}
        >
        </div>

        
        <div className='relative z-10 bg-gradient-to-r from-gray-200 to-gray-50 w-[1000px] h-[600px] flex items-center justify-center shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
          
          <div className='flex flex-row gap-[100px]'>
            
            <Link to="/login-admin">
            <div className='bg-transparent to-gray-50 shadow-[0_3px_10px_rgb(0,0,0,0.2)] transition-shadow duration-800 cursor-pointer hover:shadow-lg hover:shadow-gray-600'>
              <div className='bg-transparent w-[400px] h-[500px] flex items-center justify-center flex-col'>
                
                <svg 
                  className="h-[100px] w-[100px] text-red-500 mb-5 cursor-pointer hover:scale-105 transition-transform"  
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
            </div>
            </Link>

            <Link to="/login-student">
            <div className='bg-transparent to-gray-50 shadow-[0_3px_10px_rgb(0,0,0,0.2)] transition-shadow duration-800 cursor-pointer hover:shadow-lg hover:shadow-gray-600'>
              <div className='bg-transparent w-[400px] h-[500px] flex items-center justify-center flex-col'>
                <svg 
                  className="h-[100px] w-[100px] text-red-500 mb-5 cursor-pointer hover:scale-105 transition-transform"  
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
            </div>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
