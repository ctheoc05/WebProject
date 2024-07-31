//pages/wishlist.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from "./components/Navbar";
import "../app/globals.css";
import { FaShoppingCart } from 'react-icons/fa';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    document.title = 'Wishlist';
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }

    async function fetchWishlistItems() {
      if (!storedEmail) return;

      try {
        const response = await fetch(`/api/wishlistGET?email=${storedEmail}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch wishlist items');
        }
        const data = await response.json();
        setWishlist(data);
      } catch (error) {
        setError(error.message);
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
        setWishlist((prevWishlist) => {
          const itemIndex = prevWishlist.findIndex(item => item.ProductID === productID);
          if (itemIndex !== -1) {
            const updatedWishlist = [...prevWishlist];
            if (updatedWishlist[itemIndex].Quantity > 1) {
              updatedWishlist[itemIndex].Quantity -= 1;
            } else {
              updatedWishlist.splice(itemIndex, 1);
            }
            return updatedWishlist;
          }
          return prevWishlist;
        });
      } else {
        const errorData = await response.json();
        console.error('Failed to remove item from wishlist:', errorData.error);
        setError(errorData.error);
      }
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      setError(error.message);
    }
  };

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.ProductID === product.ProductID);

    const productToAdd = {
      ProductID: product.ProductID,
      Name: product.Products.Name,
      ImageURL: product.Products.ImageURL,
      Category: product.Products.Category,
      RetailPrice: parseFloat(product.Products.RetailPrice),
      quantity: 1
    };

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      cart.push(productToAdd);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-20 container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8">Your Wishlist</h1>
        {error && <p className="text-red-500">{error}</p>}
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
                    <p className="text-gray-800 font-semibold">
                      Price: ${parseFloat(item.Products.RetailPrice).toFixed(2)}
                    </p>
                    <p className="text-gray-800 font-semibold">Quantity: {item.Quantity}</p>
                    <div className="flex items-center mt-4">
                      <button 
                        onClick={() => handleRemoveFromWishlist(item.ProductID)}
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mr-2"
                      >
                        Remove
                      </button>
                      <button 
                        onClick={() => handleAddToCart(item)}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2 flex items-center"
                      >
                        <FaShoppingCart className="mr-2" /> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-8">
              <button 
                onClick={handleCheckout}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Go to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
