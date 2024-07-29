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
  const [isLoginPrompt, setIsLoginPrompt] = useState(false); // For showing login prompt
  const [activeSection, setActiveSection] = useState('profile'); // New state for managing active section
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
        const initialData = {
          username: storedUsername,
          email: storedEmail,
          firstName: storedFirstName,
          lastName: storedLastName,
          gender: storedGender,
        };
        setUserData(initialData);
        setFormData({ ...initialData, password: '', agreeToTerms: false });
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

  const handleSignup = async (e) => {
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
      localStorage.setItem('email', result.email); // Assuming API returns user email
      setIsLoggedIn(true);
      setIsLoginPrompt(false);
      router.push('/accountlogin');
    } else {
      setError(result.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/updateUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    if (response.ok) {
      setUserData(formData);
      localStorage.setItem('firstname', formData.firstName);
      localStorage.setItem('lastname', formData.lastName);
      localStorage.setItem('email', formData.email);
      localStorage.setItem('username', formData.username);
      localStorage.setItem('gender', formData.gender);
      setError(''); // Clear any previous errors
    } else {
      setError(result.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const submissionData = {
      email: formData.email,
      password: formData.password,
    };

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData),
    });

    const result = await response.json();
    if (response.ok) {
      localStorage.setItem('email', result.email); // Assuming API returns user email
      setIsLoggedIn(true);
      setIsLoginPrompt(false);
      router.push('/account');
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

  const handlesubmit = () => {
    router.push('/saccount#');
  };

  return (
    <div>
      <Navbar />
      <div className="account-container">
        {isLoggedIn ? (
          <div className="account-container-logged-in">
            <aside className="account-sidebar">
              <nav>
                <ul>
                  <li><a href="#" onClick={() => setActiveSection('profile')}>My Profile</a></li>
                  <li><a href="#" onClick={() => setActiveSection('settings')}>Account Settings</a></li>
                </ul>
              </nav>
            </aside>
            <main className="account-main">
              {activeSection === 'profile' && (
                <section id="details" className="account-section">
                  <h2 className="form-heading">My Profile</h2>
                  <div className="account-form">
                    <div className="form-group">
                      <label>First Name</label>
                      <input type="text" name="firstName" value={userData?.firstName || ''} readOnly />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input type="text" name="lastName" value={userData?.lastName || ''} readOnly />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" name="email" value={userData?.email || ''} readOnly />
                    </div>
                    <div className="form-group">
                      <label>Username</label>
                      <input type="text" name="username" value={userData?.username || ''} readOnly />
                    </div>
                    <div className="form-group">
                      <label>Gender</label>
                      <input type="text" name="gender" value={userData?.gender || ''} readOnly />
                    </div>
                  </div>
                </section>
              )}
              {activeSection === 'settings' && (
                <section id="settings" className="account-section">
                  <h2 className="form-heading">Settings</h2>
                  <form onSubmit={handleUpdate} className="account-form">
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
                    <button className="submit" onClick={handlesubmit}>Save</button>
                  </form>
                  <button className="logout-button" onClick={handleLogout}>Logout</button>
                </section>
              )}
            </main>
          </div>
        ) : (
          <main className="account-main">
            {isLoginPrompt ? (
              <section className="account-section">
                <h1 className="form-heading">Already have an account?</h1>
                <button className="login-button" onClick={() => router.push('/accountlogin')}>Login</button>
              </section>
            ) : (
              <section className="account-section">
                <form onSubmit={handleSignup} className="account-form">
                  <h5 className="form-heading">CREATE AN ACCOUNT</h5>
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
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
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
                  <div className="form-group">
                    <label>
                      <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} required />
                     <span className="checkbox-label"> I agree to the Terms and Conditions</span>
                    </label>
                  </div>
                  <div className="button-container">
                    <button type="submit" className="submit-button"onClick={() => ('/accountlogin')}>Signup</button>
                    <button type="button" className="login-button" onClick={() => router.push('/accountlogin')}>Login</button>
                  </div>
                  {error && <div className="error">{error}</div>}
                </form>
              </section>
            )}
          </main>
        )}
      </div>
      <style jsx>{`
        .account-container {
          display: flex;
        }
        .account-container-logged-in {
          display: flex;
          width: 100%;
        }
        .account-sidebar {
          width: 200px;
          background-color: #f8f9fa;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          margin-top: 60px;
        }
        .account-sidebar nav ul {
          list-style: none;
          padding: 0;
        }
        .account-sidebar nav ul li {
          margin: 10px 0;
        }
        .account-sidebar nav ul li a {
          text-decoration: none;
          color: #333;
          font-weight: bold;
        }
        .account-main {
          margin-top: 70px;
          flex: 1;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }
        .account-section {
          width: 100%;
          max-width: 600px;
          margin-bottom: 40px;
        }
        .account-form {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .form-heading {
          text-align: center;
          font-size: 1.5rem;
          margin-bottom: 20px;
          font-weight: bold;
          color: #333;
          border-bottom: 2px solid #ddd;
          padding-bottom: 10px;
        }
        .form-group {
          margin-bottom: 10px;
        }
        .form-group label {
          display: center;
          align-items:center;
          margin-bottom: 15px;
          font-weight: bold;
        }
        
        .from-group input[type="checkbox"]{
        margin-left: 20px;
        }

        .from-group .checkbox-label{
        margin:0;
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
        .submit,
        .login-button,
        .submit{
          width: 48%;
          padding: 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .submit {
          background-color: #4caf50;
          color: white;
        }
        .login-button {
          background-color: #007bff;
          color: white;
        }
        .save {
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