import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import gambo from '../assets/temple-of-books-6.jpg'; // background image

const LoginAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { session, signInUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInUser(email, password);
      if (result.success) {
        navigate('/');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full">
      {/* Blurred Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm brightness-75"
        style={{ backgroundImage: `url(${gambo})` }}
      ></div>

      {/* Foreground Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="bg-white bg-opacity-90 shadow-xl backdrop-blur-md rounded-2xl p-10 w-[400px] text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Admin Login</h1>
          <p className="text-gray-600 mb-6">
            Welcome back!
            <Link className="text-red-500 ml-1" to="/signup-admin">Sign up</Link>
          </p>

          <form onSubmit={handleSignIn} className="space-y-4">
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition duration-300"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
            {error && <p className="text-red-600 text-center pt-2">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
