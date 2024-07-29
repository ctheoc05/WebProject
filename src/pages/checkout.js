import { useState, useEffect } from 'react';
import Navbar from "./components/Navbar";
import "../app/globals.css";

// Function to get user email from localStorage
const getUserEmail = () => {
  return localStorage.getItem('email');
};

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: '',
    street: '',
    number: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    // Fetch the logged-in user's email from localStorage
    const userEmail = getUserEmail();
    if (userEmail) {
      setEmail(userEmail);
    } else {
      setError('User not logged in');
    }
  }, []);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(deliveryAddress).some(field => !field)) {
      setError('Please fill in all delivery address fields.');
      return;
    }
    setError('');

    const orderDetails = {
      cart,
      deliveryAddress,
      paymentMethod,
      email,
    };

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Order placed successfully!');
        localStorage.removeItem('cart');
      } else {
        alert('Error: ${result.error}');
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const totalAmount = cart.reduce((total, product) => total + (product.RetailPrice * product.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-20 container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Delivery Information</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-lg font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={deliveryAddress.name}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="street" className="block text-lg font-medium text-gray-700">Street</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={deliveryAddress.street}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="number" className="block text-lg font-medium text-gray-700">Street Number</label>
                <input
                  type="text"
                  id="number"
                  name="number"
                  value={deliveryAddress.number}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="city" className="block text-lg font-medium text-gray-700">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={deliveryAddress.city}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="postalCode" className="block text-lg font-medium text-gray-700">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={deliveryAddress.postalCode}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="country" className="block text-lg font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={deliveryAddress.country}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
              <div className="mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="creditCard"
                    checked={paymentMethod === 'creditCard'}
                    onChange={handlePaymentMethodChange}
                    className="form-radio"
                  />
                  <span className="ml-2">Credit Card</span>
                </label>
              </div>
              <div className="mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={handlePaymentMethodChange}
                    className="form-radio"
                  />
                  <span className="ml-2">PayPal</span>
                </label>
              </div>
              <div className="mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="bankTransfer"
                    checked={paymentMethod === 'bankTransfer'}
                    onChange={handlePaymentMethodChange}
                    className="form-radio"
                  />
                  <span className="ml-2">Bank Transfer</span>
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Place Order
              </button>
            </form>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Items:</h3>
              <ul>
                {cart.map(product => (
                  <li key={product.id}>{product.name} x {product.quantity} - ${product.RetailPrice}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4 text-lg font-bold">Total: ${totalAmount.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}