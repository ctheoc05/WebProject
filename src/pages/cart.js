
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
    const updatedCart = cart.map(product => {
      if (product.ProductID === productID) {
        return { ...product, quantity: product.quantity - 1 };
      }
      return product;
    }).filter(product => product.quantity > 0);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleAddToCart = (productID) => {
    const updatedCart = cart.map(product => {
      if (product.ProductID === productID) {
        return { ...product, quantity: product.quantity + 1 };
      }
      return product;
    });
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const totalAmount = cart.reduce((total, product) => total + (product.RetailPrice * product.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-20 container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8">Your Cart</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cart.map(product => (
                <div key={product.ProductID} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={product.ImageURL} alt={product.Name} className="w-full h-48 object-cover"/>
                  <div className="p-4">
                    <h2 className="text-xl font-bold">{product.Name}</h2>
                    <p className="text-gray-600">Category: {product.Category}</p>
                    <p className="text-gray-800 font-semibold">Price: ${product.RetailPrice}</p>
                    <p className="text-gray-800 font-semibold">Quantity: {product.quantity}</p>
                    <div className="flex items-center mt-4">
                      <button 
                        onClick={() => handleRemoveFromCart(product.ProductID)}
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mr-2"
                      >
                        -
                      </button>
                      <button 
                        onClick={() => handleAddToCart(product.ProductID)}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-right">
              <h2 className="text-2xl font-bold">Total: ${totalAmount.toFixed(2)}</h2>
              <button className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}