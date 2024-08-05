// pages/components/CartDrawer.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CartDrawer({ onClose }) {
  const [cart, setCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
  };

  const handleRemoveFromCart = (productID) => {
    const updatedCart = cart.reduce((newCart, product) => {
      if (product.ProductID === productID) {
        if (product.quantity > 1) {
          newCart.push({ ...product, quantity: product.quantity - 1 });
        }
      } else {
        newCart.push(product);
      }
      return newCart;
    }, []);
    updateCart(updatedCart);
  };

  const handleAddToCart = (productID) => {
    const updatedCart = cart.map(product => {
      if (product.ProductID === productID) {
        return { ...product, quantity: (product.quantity || 1) + 1 };
      }
      return product;
    });

    if (!updatedCart.some(product => product.ProductID === productID)) {
      const productToAdd = cart.find(product => product.ProductID === productID);
      updatedCart.push({ ...productToAdd, quantity: 1 });
    }

    updateCart(updatedCart);
  };

  const totalAmount = cart.reduce((total, product) => total + (parseFloat(product.RetailPrice) * (product.quantity || 1)), 0);

  const handleProceedToCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="w-80 bg-white shadow-lg p-4 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {cart.map(product => (
                <div key={product.ProductID} className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{product.Name}</h3>
                    <p className="text-gray-600">Price: ${parseFloat(product.RetailPrice).toFixed(2)}</p>
                    <p className="text-gray-800">Quantity: {product.quantity || 1}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <button
                      onClick={() => handleRemoveFromCart(product.ProductID)}
                      className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 mb-1"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleAddToCart(product.ProductID)}
                      className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <h3 className="text-xl font-bold">Total: ${totalAmount.toFixed(2)}</h3>
              <button
                onClick={handleProceedToCheckout}
                className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}