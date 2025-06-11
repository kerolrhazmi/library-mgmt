import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const SignupAdmin = () => {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      const userId = authData.user?.id;

      if (userId) {
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: userId,
            display_name: displayName,
            role: 'admin',
          },
        ]);

        if (profileError) throw profileError;

        navigate('/');
      }
    } catch (err) {
      console.error('Signup error:', err.message);
      setError('Sign-up failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-200 to-gray-50 h-[600px] w-full flex items-center justify-center">
      <div className="bg-white shadow-md rounded-2xl p-10 w-[400px] text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Sign Up As Admin</h1>
        <p className="text-gray-600 mb-6">
          Enter your details. Already have an account?
          <Link className="text-red-500" to="/login-admin"> Login</Link>
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
  );
};

export default SignupAdmin;
