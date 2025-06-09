import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const LoginStudent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');

  const { session, signInUser} = UserAuth();
  const navigate = useNavigate();
  console.log(session);
  

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInUser(email, password);

      if (result.success) {
        navigate('/');
      }
    } catch (err) {
      setError('an error occured ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-200 to-gray-50 h-[600px] w-full flex items-center justify-center">
      <div className="bg-white shadow-md rounded-2xl p-10 w-[400px] text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Log in </h1>
        <p className="text-gray-600 mb-6">Welcome back! dont have an account?<Link className='text-red-500' to="/signup-admin "> SignUp</Link> </p>

        <form onSubmit={handleSignIn} className="space-y-4">
          <input onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <input onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Create a Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button type="submit" disabled={loading} className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition duration-300">
            Log In
          </button>
          { error && <p className='text-red-600 text-center pt=4'>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginStudent;
