import { useEffect, useState } from 'react';
import Navbar from "./components/Navbar";
import "../app/globals.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [username, setUsername] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    }
    fetchProducts();

    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Update cart count when the page is loaded
    const updateCartCount = () => {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const cart = JSON.parse(storedCart);
        const count = cart.reduce((total, product) => total + (product.quantity || 1), 0);
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'cart',
          newValue: JSON.stringify(cart),
        }));
      }
    };

    updateCartCount();

    // Listen for storage changes to update cart count
    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const filteredProducts = category === 'All' ? products : products.filter(product => product.Category === category);

  const handleAddToCart = (product) => {
    const storedCart = localStorage.getItem('cart');
    let cart = storedCart ? JSON.parse(storedCart) : [];

    const existingProductIndex = cart.findIndex(item => item.ProductID === product.ProductID);

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Trigger a storage event to update cart count in Navbar
    const event = new Event('storage');
    window.dispatchEvent(event);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-20">
        <div className="relative w-full h-64 bg-cover bg-center" style={{ backgroundImage: "url('/wow.png')" }}>
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h1 className="text-white text-4xl font-bold">Welcome to Our E-Shop</h1>
          </div>
        </div>

        {username && (
          <div className="text-center mt-4">
            <h2 className="text-2xl font-semibold">Welcome, {username}!</h2>
          </div>
        )}

        <div className="container mx-auto py-8">
          <div className="mb-8">
            <label htmlFor="category" className="block mb-2 text-lg font-medium text-gray-700">Filter by Category:</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-1/3 p-2 border border-gray-300 rounded-md"
            >
              <option value="All">All</option>
              <option value="Women">Women</option>
              <option value="Men">Men</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.ProductID} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={product.ImageURL} alt={product.Name} className="w-full h-48 object-cover"/>
                <div className="p-4">
                  <h2 className="text-xl font-bold">{product.Name}</h2>
                  <p className="text-gray-600">Category: {product.Category}</p>
                  <p className="text-gray-800 font-semibold">Price: ${product.RetailPrice}</p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

