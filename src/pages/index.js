import { useEffect, useState } from 'react';
import Navbar from "./components/Navbar";
import "../app/globals.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [username, setUsername] = useState('');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    }
    fetchProducts();

    // Get the username from localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Get cart items from localStorage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const handleAddToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const filteredProducts = category === 'All' ? products : products.filter(product => product.Category === category);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-20">
        <div className="relative w-full h-64 bg-cover bg-center slide-in" style={{ backgroundImage: "url('/wow.png')" }}>
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h1 className="text-white text-4xl font-bold">Welcome to Our E-Shop</h1>
          </div>
        </div>

        {username && (
          <div className="text-center mt-4 fade-in">
            <h2 className="text-2xl font-semibold">Welcome, {username}!</h2>
          </div>
        )}

        <div className="container mx-auto py-8 fade-in">
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
              <div key={product.ProductID} className="bg-white rounded-lg shadow-md overflow-hidden fade-in">
                <img src={product.ImageURL} alt={product.Name} className="w-full h-48 object-cover"/>
                <div className="p-4">
                  <h2 className="text-xl font-bold">{product.Name}</h2>
                  <p className="text-gray-600">Category: {product.Category}</p>
                  <p className="text-gray-800 font-semibold">Price: ${product.RetailPrice}</p>
                  <p className={`text-${product.QtyInStock > 0 ? 'green' : 'red'}-500`}>
                  </p>
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
//                   // {product.QtyInStock > 0 ? In Stock: ${product.QtyInStock} : 'Out of Stock'}
