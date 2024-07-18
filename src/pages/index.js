import { useEffect, useState } from 'react';
import Navbar from "./components/Navbar";
import "../app/globals.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  const filteredProducts = category === 'All' ? products : products.filter(product => product.Category === category);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold underline mb-8">
          Products
        </h1>

        <div className="mb-8">
          <label htmlFor="category" className="block mb-2 text-lg font-medium text-gray-700">Filter by Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-1/3 p-2 border border-gray-300 rounded-md"
          >
            <option value="All">All</option>
            <option value="Electronics">Electronics</option>
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
                <p className={`text-${product.QtyInStock > 0 ? 'green' : 'red'}-500`}>
                
                </p>
                <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
//  {product.QtyInStock > 0 ? In Stock: ${product.QtyInStock} : 'Out of Stock'}