
import { useEffect, useState } from 'react';
import Navbar from "./components/Navbar";
import "../app/globals.css";

export default function Checkout() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const getTotalPrice = () => {
    // Ensure that RetailPrice is treated as a number
    const total = cart.reduce((total, product) => total + parseFloat(product.RetailPrice), 0);
    return total.toFixed(2); // Format to two decimal places
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-20 container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {cart.map(product => (
                <div key={product.ProductID} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={product.ImageURL} alt={product.Name} className="w-full h-48 object-cover"/>
                  <div className="p-4">
                    <h2 className="text-xl font-bold">{product.Name}</h2>
                    <p className="text-gray-600">Category: {product.Category}</p>
                    <p className="text-gray-800 font-semibold">Price: ${parseFloat(product.RetailPrice).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-right text-2xl font-bold">
              Total: ${getTotalPrice()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}