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
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== 'undefined') {
      const storedUsername = localStorage.getItem('username');
      const storedEmail= localStorage.getItem('email');
      if (storedUsername) {
        setIsLoggedIn(true);
        setUsername(storedUsername);
        setEmail(storedEmail);
        // Fetch user data (this should be a protected API endpoint)
        fetch(`/api/users?email=${storedUsername}`)
        fetch(`/api/users/email=${storedEmail}`)

          .then((res) => res.json())
          .then((data) => setUserData(data))
          .catch((err) => console.error(err));

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
      ...formData,
      agreeToTerms: formData.agreeToTerms ? 1 : 0,
    };

    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData),
    });

    const result = await response.json();
    if (response.ok) {
      router.push('/api/login');
    } else {
      setError(result.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    router.push('/api/logout');
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        {isLoggedIn ? (
          <div className="user-info">
            <h1>Welcome, {username}!</h1>
            
            <div className="user-details">
            <h1>Email= {email}</h1>
              <p><strong>First Name:</strong> {userData?.username}</p>
              <p><strong>Last Name:</strong> {userData?.lastName}</p>
              <p><strong>Gender:</strong> {userData?.gender}</p>
              <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        ) : (
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <h1 className="form-heading">Sign Up</h1>
              {/* Form fields */}
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
              <div className="button-container">
                <button type="submit" className="submit-button">Signup</button>
                <button type="button" className="login-button" onClick={() => router.push('/accountlogin')}>Login</button>
              </div>
              {error && <div className="error">{error}</div>}
            </form>
          </div>
        )}
      </div>
      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 30px auto;
          padding: 20px;
        }
        .user-info {
          text-align: center;
          background: #f0f0f0;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        }
        .user-details {
          margin-top: 20px;
        }
        .user-details p {
          font-size: 1.1rem;
          color: #555;
          margin: 10px 0;
        }
        .logout-button {
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 10px 20px;
          font-size: 1rem;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 20px;
        }
        .logout-button:hover {
          opacity: 0.8;
        }
        .form-container {
          max-width: 1000px;
          margin: 80px auto;
          padding: 20px;
          background-color: #f7f7f7;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .form-heading {
          text-align: center;
          font-size: 2rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 10px;
          color: #555;
          font-size: 1rem;
        }
        input[type="text"],
        input[type="email"],
        input[type="password"],
        select {
          width: 100%;
          padding: 10px;
          margin-top: 5px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }
        input[type="checkbox"] {
          margin-right: 10px;
        }
        .button-container {
          display: flex;
          justify-content: space-between;
        }
        .submit-button,
        .login-button {
          width: 48%;
          padding: 10px;
          margin-top: 10px;
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
        .submit-button:hover,
        .login-button:hover {
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