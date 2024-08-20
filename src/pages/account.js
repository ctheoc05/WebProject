
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from './components/Navbar';
import "../app/globals.css";

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Extract day, month, and year
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-11, so add 1
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
  };
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoginPrompt, setIsLoginPrompt] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const router = useRouter();

  useEffect(() => {
    document.title='Account';
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

  useEffect(() => {
    if (isLoggedIn) {
      fetchAddresses();
      fetchOrders();
    }
  }, [isLoggedIn]);

  const fetchAddresses = async () => {
    const response = await fetch('/api/addresses');
    const data = await response.json();
    setAddresses(data);
  };

  const fetchOrders = async () => {
    if(!userData?.email)
      {return;

    }
    try{
    const response = await fetch(`/api/orders?email=${userData.email}`);
    const data = await response.json();
    if(Array.isArray(data)){
      setOrders(data);
    } else {
      setOrders([]);
    }
  } catch(error){
    console.error('failed to fetch orders:', error);
    setOrders([]);
  }
    
  };

  const [addressFormData, setAddressFormData] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  });
  
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressFormData({
      ...addressFormData,
      [name]: value,
    });
  };
  
  const handleAddAddress = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressFormData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setAddresses([...addresses, result]);
        setAddressFormData({
          street: '',
          city: '',
          state: '',
          zip: '',
        });
      } else {
        setError(result.error || 'Failed to add address');
      }
    } catch (error) {
      setError('An error occurred while adding the address');
    }
  };

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
      // localStorage.setItem('email', result.email);
      setIsLoggedIn(false);
      setIsLoginPrompt(false);
      router.push('/accountlogin');
    } else {
      setError(result.message);
    }
  };


  const handleUpdate = async (e) => {
    e.preventDefault();

    // Check if the new username already exists
  

    const {  gender, ...updateData } = formData; // Remove email and gender

    const response = await fetch('/api/updateUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
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

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { username, email } = userData;

    if (!username || !email) {
      setError('You must be logged in to change your password.');
      return;
    }

   
if (newPassword !== confirmNewPassword) {
  setError('New password and confirmation password do not match');
  return;
}

    try {
      const response = await fetch('/api/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'username': username,
          'email': email,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const result = await response.json();

      if (response.ok) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setError('');
        router.push('/cart');
      } else {
        // Handle errors from the server
        const result = await response.json();
        setError(result.error || 'Failed to change password');
      }
    } catch (error) {
      setError('Your current password is not right.');
    }
  };

  const redirectToLogout = () => {
    window.location.href = '/api/logout';
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
                  <li><a href="#" onClick={() => setActiveSection('addresses')}>Address Book</a></li>
                  <li><a href="#" onClick={() => setActiveSection('orders')}>Order History</a></li>
                  <li><a href="#" onClick={() => setActiveSection('security')}>Account Security</a></li>
                  <li><a href="#" onClick={() => setActiveSection('logout')}>Logout</a></li>

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
                   
                    <button className="submit" type="submit">Save</button>
                  </form>
                </section>
              )}
             {activeSection === 'addresses' && (
  <section id="addresses" className="account-section">
    <h2 className="form-heading">Address Book</h2>
    <form onSubmit={handleAddAddress} className="account-form">
      <div className="form-group">
        <label>Street</label>
        <input type="text" name="street" value={addressFormData.street} onChange={handleAddressChange} required />
      </div>
      <div className="form-group">
        <label>City</label>
        <input type="text" name="city" value={addressFormData.city} onChange={handleAddressChange} required />
      </div>
      <div className="form-group">
        <label>State</label>
        <input type="text" name="state" value={addressFormData.state} onChange={handleAddressChange} required />
      </div>
      <div className="form-group">
        <label>Zip</label>
        <input type="text" name="zip" value={addressFormData.zip} onChange={handleAddressChange} required />
      </div>
      <button type="submit" className="submit">Add Address</button>
    </form>
    <ul>
      {addresses.map(address => (
        <li key={address.id}>
          {address.street}, {address.city}, {address.state}, {address.zip}
          <button onClick={() => handleEditAddress(address.id)}>Edit</button>
          <button onClick={() => handleDeleteAddress(address.id)}>Delete</button>
        </li>
      ))}
    </ul>
  </section>
)}
            {activeSection === 'orders' && (
  <section id="orders" className="account-section">
    <h2 className="form-heading">Order History</h2>
    <div>
      {orders.map(order => (
        <div key={order.OrderID} className="order-item">
          <p><strong>Order ID:</strong> {order.OrderID}</p>
          <p><strong>Order Date:</strong> {formatDate(order.OrderDate)}</p>
          <p><strong>Total Amount:</strong> {order.totalAmount}</p>
          <div className="order-products">
            <h3>Products:</h3>
            <ul>
              {order.OrderProduct.map(op => (
                <li key={op.ProductID}>
                  <p><strong>Product Name:</strong> {op.Products.Name}</p>
                  <p><strong>Quantity:</strong> {op.Quantity}</p>
                  <p><strong>Price:</strong> {op.Products.RetailPrice}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  </section>
)}
            {activeSection === 'security' && (
        <section id="security" className="account-section">
          <h2 className="form-heading">Account Security</h2>
          <form onSubmit={handleChangePassword} className="account-form">
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit">Change Password</button>
            {error && <div className="error">{error}</div>}
          </form>

          <h2>Danger Zone</h2>
        </section>
      )}

              {activeSection === 'logout' && (
                <section id="logout" className=".button-container">
                    <h1 className="form-heading">Are you sure you want to logout?</h1>
                  <button className="logout-button" onClick={redirectToLogout}>Logout</button>
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
                    <button type="submit" className="submit-button">Signup</button>
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
          max-width: 800px;
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
          align-items: center;
          margin-bottom: 15px;
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
        .submit {
          width: 48%;
          padding: 10px;
          border: none;
          background-color: green;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        }
        .submit-button {
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
          .button-container{
          display:felx;
        justify-content:center;
        align-items: center;
        height:10vh;
          }
        .logout-button {
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 10px 200px;
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
          .order-item {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px; /* Space between orders */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .order-item h3 {
    margin-top: 0;
    font-size: 1.25rem;
    color: #333;
  }

  .order-item p {
    margin: 5px 0;
  }

  .order-item ul {
    list-style: none;
    padding: 0;
    margin: 10px 0;
  }

  .order-item ul li {
    background: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 10px;
  }

  .order-item ul li p {
    margin: 5px 0;
  }

  .order-item .order-products {
    border-top: 1px solid #ddd;
    padding-top: 10px;
    margin-top: 10px;
  }
      `}</style>
    </div>
  );
}