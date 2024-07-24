import React, { useState } from 'react';
import Router from 'next/router';
import Navbar from './components/Navbar';

const AccountLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
      setMessage('Login successful!');
      localStorage.setItem('username', result.username); // Store username in local storage
      localStorage.setItem('email', result.email); // Store username in local storage
      localStorage.setItem('firstname', result.firstname); // Store firstname in local storage
      localStorage.setItem('lastname', result.lastname); // Store lastname in local storage
      localStorage.setItem('gender', result.gender); // Store gender in local storage

      Router.push('/'); // Redirect to the homepage
    } else {
      setMessage(result.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <Navbar isLoggedInProp={false} />
      <div className="container mx-auto flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
          <h2 className="mb-4 text-xl font-bold">Login</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Login
          </button>
          {message && <div className="mt-4 text-red-500">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default AccountLogin;
