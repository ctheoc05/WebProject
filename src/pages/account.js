// pages/account.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from './components/Navbar';

export default function Account() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    gender: '',
    agreeToTerms: false,
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    if (response.ok) {
      router.push('/api/login');
    } else {
      setError(result.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h1 className= "form-heading">Sign up</h1>
          <label>
            First Name:
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </label>
          <label>
            Last Name:
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>
          <label>
            Username:
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </label>
          <label>
            Password:
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </label>
          <label>
            Gender:
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label>
            <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} required />
            I agree to the Terms and Conditions
          </label>
          <button type="submit">Sign Up</button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
      <style jsx>{`
        .form-container {
          max-width: 500px;
          margin: 80px auto 20px; 
          padding: 20px;
          background-color: #f7f7f7;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        form {
          display: flex;
          flex-direction: column;
        }
       .form-heading{
       text-align:center;
       font-size:2.5rem;
       font-weight:600;
       color:#333;
       margin-bottom:20px
       }
        label {
          margin-bottom: 10px;
          color: #555;
        }
        input[type="text"],
        input[type="email"],
        input[type="password"],
        select {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        input[type="checkbox"] {
          margin-right: 10px;
        }
        button {
          width: 100%;
          padding: 10px;
          margin-top: 10px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #45a049;
        }
        .error {
          color: red;
          margin-top: 10px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}