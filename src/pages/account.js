 import { useState, useEffect } from 'react';
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsername = localStorage.getItem('username');
      const storedEmail = localStorage.getItem('email');
      const storedFirstName = localStorage.getItem('firstname');
      const storedLastName = localStorage.getItem('lastname');
      const storedGender = localStorage.getItem('gender');
  
      if (storedUsername) {
        setIsLoggedIn(true);
        setUserData({
          username: storedUsername,
          email: storedEmail,
          firstName: storedFirstName,
          lastName: storedLastName,
          gender: storedGender,
        });
        setFormData({
          username: storedUsername,
          email: storedEmail,
          firstName: storedFirstName,
          lastName: storedLastName,
          gender: storedGender,
          password: '',
          agreeToTerms: false,
        });
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const submissionData = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      gender: formData.gender,
    };

    console.log('Submission Data:', submissionData);
  
    const response = await fetch('/api/updateUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData),
    });
  
    const result = await response.json();
    if (response.ok) {
      // Update local storage and state with the new user data
      localStorage.setItem('firstname', formData.firstName);
      localStorage.setItem('lastname', formData.lastName);
      localStorage.setItem('email', formData.email);
      localStorage.setItem('username', formData.username);
      localStorage.setItem('gender', formData.gender);
      setUserData(formData); // Update state to reflect the changes
    } else {
      setError(result.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('firstname');
    localStorage.removeItem('lastname');
    localStorage.removeItem('gender');
    router.push('/api/logout');
  };

  return (
    <div>
      <Navbar />
      <div className="account-container">
        <aside className="account-sidebar">
          <nav>
            <ul>
              <li><a href="#details">My details</a></li>
              <li><a href="#address">My address book</a></li>
              <li><a href="#orders">My orders</a></li>
              <li><a href="#newsletters">My newsletters</a></li>
              <li><a href="#settings">Account settings</a></li>
            </ul>
          </nav>
        </aside>
        <main className="account-main">
          {isLoggedIn ? (
            <section id="details" className="account-section">
              <h2>My details</h2>
              <form onSubmit={handleSubmit} className="account-form">
  <div className="form-group">
    <label>First Name</label>
    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
  </div>
  <div className="form-group">
    <label>Last Name</label>
    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
  </div>
  <div className="form-group">
    <label>Email</label>
    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
  </div>
  <div className="form-group">
    <label>Username</label>
    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
  </div>
  <div className="form-group">
    <label>Gender</label>
    <select name="gender" value={formData.gender} onChange={handleChange} required>
      <option value="">Select</option>
      <option value="Female">Female</option>
      <option value="Male">Male</option>
      <option value="Other">Other</option>
    </select>
  </div>
  <button type="submit" className="save-button">Save</button>
</form>
              <button className="logout-button" onClick={handleLogout}>Logout</button>
            </section>
          ) : (
            <section className="account-section">
              <form onSubmit={handleSubmit} className="account-form">
  <div className="form-group">
    <label>First Name</label>
    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
  </div>
  <div className="form-group">
    <label>Last Name</label>
    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
  </div>
  <div className="form-group">
    <label>Email</label>
    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
  </div>
  <div className="form-group">
    <label>Username</label>
    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
  </div>
  <div className="form-group">
    <label>Gender</label>
    <select name="gender" value={formData.gender} onChange={handleChange} required>
      <option value="">Select</option>
      <option value="Female">Female</option>
      <option value="Male">Male</option>
      <option value="Other">Other</option>
    </select>
  </div>
  <button type="submit" className="save-button">Save</button>
</form>
            </section>
          )}
        </main>
      </div>
      <style jsx>{`
        .account-container {
          display: flex;
        }
         .account-sidebar {
          width: 200px;
          background-color: #f8f9fa;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          margin-top: 70px;
        }
        .account-sidebar nav ul {
          list-style: none;
          padding: 0;
        }
        .account-sidebar nav ul li {
          margin: 20px 0;
        }
        .account-sidebar nav ul li a {
          text-decoration: none;
          color: #333;
          font-weight: bold;
        }
        .account-main {
          flex: 1;
          padding: 90px;
        }
        .account-section {
          margin-bottom: 40px;
        }
        .account-form {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .form-heading {
          text-align: left;
          font-size: 1rem;
          margin-bottom: 20px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .button-container {
          display: flex;
          justify-content: space-between;
        }
        .submit-button,
        .login-button,
        .save-button {
          width: 48%;
          padding: 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .submit-button {
          background-color: #4CAF50;
          color: white;
        }
        .login-button {
          background-color: #007bff;
          color: white;
        }
        .save-button {
          background-color: #28a745;
          color: white;
        }
        .logout-button {
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
        }
        .logout-button:hover {
          opacity: 0.8;
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