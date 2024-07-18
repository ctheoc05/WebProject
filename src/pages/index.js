import { useEffect, useState } from 'react';
import Navbar from "./components/Navbar";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);
 

  return (
    <div>
         
      <Navbar />
      <h1 className="text-exl font-bold underline">
        Hello
      </h1>
      <div className="product-list">
        {products.map(product => (
          <div key={product.ProductID} className="product-card">
            <h2>{product.Name}</h2>
            <p>Category: {product.Category}</p>
            <p>Price: ${product.RetailPrice}</p>
            <p>In Stock: {product.QtyInStock}</p>
          </div>
        ))}
      </div>
    </div>
    

  );
  

}