import { useEffect, useState } from 'react';
import Navbar from "./components/Navbar";
import "../app/globals.css";
import { FaShoppingCart, FaHeart } from 'react-icons/fa';

const Notification = ({ message, onClose }) => {
    return (
        <div className="fixed top-16 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
            {message}
            <button onClick={onClose} className="ml-2 text-white">
                &times;
            </button>
        </div>
    );
};

export default function Home() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [category, setCategory] = useState('All');
    const [priceSort, setPriceSort] = useState('None');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [wishlist, setWishlist] = useState([]);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        document.title = 'Home';
        async function fetchProducts() {
            try {
                const response = await fetch('/api/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
                setFilteredProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }
        fetchProducts();

        const storedEmail = localStorage.getItem('email');
        const storedUsername = localStorage.getItem('username');
        if (storedEmail) {
            setEmail(storedEmail);
        }
        if (storedUsername) {
            setUsername(storedUsername);
        }

        async function fetchWishlist() {
            if (storedEmail) {
                try {
                    const response = await fetch(`/api/wishlistGET?email=${storedEmail}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch wishlist');
                    }
                    const data = await response.json();
                    setWishlist(data.map(item => item.ProductID));
                } catch (error) {
                    console.error('Error fetching wishlist:', error);
                }
            }
        }
        fetchWishlist();
    }, []);

    useEffect(() => {
        let result = [...products];

        if (category !== 'All') {
            result = result.filter(product => product.Category === category);
        }

        if (priceSort === 'LowToHigh') {
            result = result.sort((a, b) => a.RetailPrice - b.RetailPrice);
        } else if (priceSort === 'HighToLow') {
            result = result.sort((a, b) => b.RetailPrice - a.RetailPrice);
        }

        setFilteredProducts(result);
    }, [category, priceSort, products]);
    const handleAddToCart = (product) => {
      // Check if the product is in stock
      if (product.QtyInStock <= 0) {
          // Show out-of-stock notification
          setNotification(`Sorry, ${product.Name} is out of stock.`);
          setTimeout(() => setNotification(null), 3000);
          return;
      }
  
      const storedCart = localStorage.getItem('cart');
      let cart = storedCart ? JSON.parse(storedCart) : [];
  
      const existingProductIndex = cart.findIndex(item => item.ProductID === product.ProductID);
  
      if (existingProductIndex !== -1) {
          if (cart[existingProductIndex].quantity < product.QtyInStock) {
              cart[existingProductIndex].quantity += 1;
          } else {
              setNotification(`Cannot add more of ${product.Name}. Only ${product.QtyInStock} left in stock.`);
              setTimeout(() => setNotification(null), 3000);
              return;
          }
      } else {
          cart.push({ ...product, quantity: 1 });
      }
  
      localStorage.setItem('cart', JSON.stringify(cart));
  
      // Trigger a storage event to update cart count in Navbar
      const event = new Event('storage');
      window.dispatchEvent(event);
  
      // Show success notification
      setNotification(`Added ${product.Name} to cart`);
      setTimeout(() => setNotification(null), 3000);
  };

    const handleAddRemoveWishlist = async (product) => {
        const email = localStorage.getItem('email');
        const username = localStorage.getItem('username');

        if (!email || !username) {
            alert('You must be logged in to add or remove items from your wishlist.');
            return;
        }

        if (wishlist.includes(product.ProductID)) {
            try {
                await fetch('/api/wishlistREMOVE', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, productID: product.ProductID }),
                });
                setWishlist(prev => prev.filter(id => id !== product.ProductID));
                setNotification(`Removed ${product.Name} from wishlist`);
            } catch (error) {
                alert('Error removing item from wishlist.');
            }
        } else {
            try {
                await fetch('/api/wishlistADD', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, username, productId: product.ProductID, quantity: 1 }),
                });
                setWishlist(prev => [...prev, product.ProductID]);
                setNotification(`Added ${product.Name} to wishlist`);
            } catch (error) {
                alert('Error adding item to wishlist.');
            }
        }

        setTimeout(() => setNotification(null), 3000);
    };

    const handleClearFilters = () => {
        setPriceSort('None');
        setCategory('All');
        setFilteredProducts([...products]);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Navbar />
            <div className="flex flex-1">
                <aside className="w-64 bg-white shadow-md p-4 mt-16">
                    <h2 className="text-lg font-semibold mb-4">Filter by Category</h2>
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => setCategory('All')}
                                className={`block w-full text-left p-2 ${category === 'All' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}
                            >
                                All
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCategory('Rings')}
                                className={`block w-full text-left p-2 ${category === 'Rings' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}
                            >
                                Rings
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCategory('Earrings')}
                                className={`block w-full text-left p-2 ${category === 'Earrings' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}
                            >
                                Earrings
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCategory('Necklaces')}
                                className={`block w-full text-left p-2 ${category === 'Necklaces' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}
                            >
                                Necklaces
                            </button>
                        </li>
                    </ul>

                    <h2 className="text-lg font-semibold mt-8 mb-4">Sort by Price</h2>
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => setPriceSort('LowToHigh')}
                                className={`block w-full text-left p-2 ${priceSort === 'LowToHigh' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}
                            >
                                Price: Low to High
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setPriceSort('HighToLow')}
                                className={`block w-full text-left p-2 ${priceSort === 'HighToLow' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}
                            >
                                Price: High to Low
                            </button>
                        </li>
                    </ul>

                    <button
                        onClick={handleClearFilters}
                        className="mt-8 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    >
                        Clear Filters
                    </button>
                </aside>
                <main className="flex-1 p-6 mt-16">
                    <div className="relative w-full h-64 bg-cover bg-center" style={{ backgroundImage: "url('/wow.png')" }}>
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <h1 className="text-white text-4xl font-bold">Welcome to Our E-Shop</h1>
                        </div>
                    </div>

                    {email && (
                        <div className="text-center mt-4">
                            <h2 className="text-2xl font-semibold">Welcome, {username}!</h2>
                        </div>
                    )}
<div className="container mx-auto py-8">
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-3">
        {filteredProducts.map(product => (
            <div key={product.ProductID} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={product.ImageURL} alt={product.Name} className="w-full h-32 object-cover"/>
                <div className="p-4">
                    <h2 className="text-xl font-bold">{product.Name}</h2>
                    <p className="text-gray-600">Category: {product.Category}</p>
                    <p className="text-gray-800 font-semibold">Price: ${product.RetailPrice}</p>
                    <p className={`text-sm ${product.QtyInStock <= 0 ? 'text-red-500' : 'text-gray-600'}`}>
                        {product.QtyInStock <= 0 ? 'Out of Stock' : `In Stock: ${product.QtyInStock}`}
                    </p>
                    <div className="flex items-center mt-2">
                        <button
                            onClick={() => handleAddToCart(product)}
                            className={`flex items-center bg-blue-500 text-white py-2 px-2 rounded hover:bg-blue-600 ${product.QtyInStock <= 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                            disabled={product.QtyInStock <= 0}
                        >
                            <FaShoppingCart className="mr-2" />
                            Add to Cart
                        </button>
                        <button
                            onClick={() => handleAddRemoveWishlist(product)}
                            className={`ml-2 flex items-center py-2 px-2 rounded ${wishlist.includes(product.ProductID) ? 'bg-white-500 text-white' : 'bg-white text-gray-800'} hover:bg-gray-200`}
                        >
                            <FaHeart className={`mr-2 ${wishlist.includes(product.ProductID) ? 'text-red-500' : 'text-gray-800'}`} />
                            {wishlist.includes(product.ProductID)}
                        </button>
                    </div>
                </div>
            </div>
        ))}
    </div>
</div>
                </main>
            </div>
            {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
        </div>
    );
}