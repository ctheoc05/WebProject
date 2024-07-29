import { useState, useEffect } from 'react';

const ProductPage = ({ product }) => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleAddToWishlist = async () => {
    try {
      const response = await fetch('/api/wishlistADD', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, productID: product.ProductID }),
      });

      if (response.ok) {
        alert('Item added to wishlist');
      } else {
        alert('Failed to add item to wishlist');
      }
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
    }
  };

  return (
    <div>
      <h1>{product.Name}</h1>
      <button onClick={handleAddToWishlist}>Add to Wishlist</button>
    </div>
  );
};

export default ProductPage;