import { useState, useEffect } from 'react';
import Navbar from "./components/Navbar";
import "../app/globals.css";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    console.log('Stored Email:', storedEmail); // Add this line for logging
    if (storedEmail) {
      setEmail(storedEmail);
    }

    async function fetchWishlistItems() {
      if (!storedEmail) return;

      try {
        const response = await fetch(`/api/wishlistGET?email=${storedEmail}`);
        console.log('Response Status:', response.status); // Add this line for logging
        if (!response.ok) {
          throw new Error('Failed to fetch wishlist items');
        }
        const data = await response.json();
        console.log('Fetched Data:', data); // Add this line for logging

        if (Array.isArray(data)) {
          setWishlist(data);
        } else {
          console.error('Expected an array but got:', data);
        }
      } catch (error) {
        console.error('Error fetching wishlist items:', error);
      }
    }

    fetchWishlistItems();
  }, [email]);

  const handleRemoveFromWishlist = async (productID) => {
    try {
      const response = await fetch('/api/wishlistREMOVE', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, productID }),
      });

      if (response.ok) {
        setWishlist(wishlist.filter(item => item.ProductID !== productID));
      } else {
        console.error('Failed to remove item from wishlist');
      }
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-20 container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8">Your Wishlist</h1>
        {wishlist.length === 0 ? (
          <p>Your wishlist is empty</p>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlist.map(item => (
                <div key={item.WishlistID} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={item.Products.ImageURL} alt={item.Products.Name} className="w-full h-48 object-cover"/>
                  <div className="p-4">
                    <h2 className="text-xl font-bold">{item.Products.Name}</h2>
                    <p className="text-gray-600">Category: {item.Products.Category}</p>
                    <p className="text-gray-800 font-semibold">Price: ${item.Products.RetailPrice.toFixed(2)}</p>
                    <p className="text-gray-800 font-semibold">Quantity: {item.Quantity}</p>
                    <div className="flex items-center mt-4">
                      <button 
                        onClick={() => handleRemoveFromWishlist(item.ProductID)}
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mr-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}