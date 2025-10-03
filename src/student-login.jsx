import React, { useState } from 'react';
 

/**
 * Standalone LoginPage Component
 * Handles user input and mock authentication based on user role.
 * * @param {function} onLoginSuccess - Callback function invoked on successful login.
 */
const LoginPage = ({ onLoginSuccess = (role, id) => console.log(`Login successful for mock user: ${id} (${role})`) }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // --- MOCK DATA FOR AUTHENTICATION ---
  const MOCK_USER_ID = 'STU001'; 

  // Mock authentication logic
  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Simulating roles for testing: 
    // student: 'student'/'pass' (ID: STU001), advisor: 'advisor'/'pass', organizer: 'organizer'/'pass'
    if (username === 'student' && password === 'pass') {
      window.location.hash = '/student';
      onLoginSuccess('student', MOCK_USER_ID); 
    } else if (username === 'advisor' && password === 'pass') {
       window.location.hash = '/advisor';
       onLoginSuccess('advisor', 'FAC001'); 
    } else if (username === 'organizer' && password === 'pass') {
      window.location.hash = '/organizer';
      onLoginSuccess('organizer', 'ORG001'); 
    } else {
      // Display error for failed authentication
      setError('Invalid credentials. Please try again.'); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-inter">
      {/* Login Card */}
      <div className="max-w-md w-full p-10 space-y-6 bg-white rounded-xl shadow-2xl transition duration-300 hover:shadow-xl">
        
        {/* Branding/Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
            CERTIFICATE MANAGEMENT SYSTEM
          </h1>
          <p className="text-gray-500">
            Centralized platform for certificate access and management.
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {/* Error Message Display */}
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {/* Username Input */}
          <div>
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 sm:text-lg transition duration-150"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 sm:text-lg transition duration-150"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <div className="pt-2"> 
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-indigo-700 hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-md hover:shadow-lg"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;