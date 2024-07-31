import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from "../../components/Navbar";
import "../globals.css";

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query; // Get the product ID from the URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      async function fetchProduct() {
        try {
          const response = await fetch(`/api/products/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch product details');
          }
          const data = await response.json();
          setProduct(data);
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
      }
      fetchProduct();
    }
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto py-8">
        <div className="flex">
          <div className="w-1/2">
            <img src={product.ImageURL} alt={product.Name} className="w-full h-auto object-cover"/>
          </div>
          <div className="w-1/2 p-4">
            <h1 className="text-4xl font-bold">{product.Name}</h1>
            <p className="text-gray-800 font-semibold mt-2">Price: ${product.RetailPrice}</p>
            <p className="mt-4">{product.Description}</p>
            {/* Add more product details as needed */}
          </div>
        </div>
      </div>
    </div>
  );
}