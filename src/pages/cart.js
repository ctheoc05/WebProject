import { useState, useEffect } from 'react';
import Navbar from "./components/Navbar";
import "../app/globals.css";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const handleRemoveFromCart = (productID) => {
    const updatedCart = cart.filter(product => product.ProductID !== productID);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-20 container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8">Your Cart</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cart.map(product => (
              <div key={product.ProductID} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={product.ImageURL} alt={product.Name} className="w-full h-48 object-cover"/>
                <div className="p-4">
                  <h2 className="text-xl font-bold">{product.Name}</h2>
                  <p className="text-gray-600">Category: {product.Category}</p>
                  <p className="text-gray-800 font-semibold">Price: ${product.RetailPrice}</p>
                  <button 
                    onClick={() => handleRemoveFromCart(product.ProductID)}
                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                  >
                    Remove from Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}