import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import gambo from '../assets/temple-of-books-6.jpg'; // background image

const SignupStudent = () => {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUpNewUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signUpNewUser(email, password, displayName, 'user');
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Sign-up failed');
      }
    } catch (err) {
      setError('An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm brightness-75"
        style={{ backgroundImage: `url(${gambo})` }}
      ></div>

      {/* Foreground Signup Box */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="bg-white bg-opacity-90 shadow-xl backdrop-blur-md rounded-2xl p-10 w-[400px] text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Sign Up as User</h1>
          <p className="text-gray-600 mb-6">
            Enter your details. Already have an account?
            <Link className="text-red-500 ml-1" to="/login-student">Login</Link>
          </p>

          <form onSubmit={handleSignUp} className="space-y-4">
            <input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
            <input
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
            <input
              type="password"
              placeholder="Create a Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition duration-300"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
            {error && <p className="text-red-600 text-center pt-4">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupStudent;
