import { useEffect, useState } from 'react';
import Navbar from "./components/Navbar";
import "../app/globals.css";
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import Footer from "./components/Footer";
const Notification = ({ message, onClose }) => {
    return (
        <div className="fixed top-16 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 transform translate-y-0 transition-transform duration-300 ease-in-out">
            {message}
            <button onClick={onClose} className="ml-2 text-white hover:text-gray-200 transition-colors duration-200">
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
    const [selectedProduct, setSelectedProduct] = useState(null);

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
        if (product.QtyInStock <= 0) {
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
        const event = new Event('storage');
        window.dispatchEvent(event);

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

    const handleImageClick = (product) => {
        setSelectedProduct(product);
    };

    const handleCloseDescription = () => {
        setSelectedProduct(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Navbar />
            <div className="flex flex-1">
                <aside className="w-64 bg-white shadow-md p-4 mt-16 transition-transform transform-gpu duration-300">
                    <h2 className="text-lg font-semibold mb-4">Filter by Category</h2>
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => setCategory('All')}
                                className={`block w-full text-left p-2 rounded transition-colors duration-300 ${category === 'All' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 hover:bg-blue-100'}`}
                            >
                                All
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCategory('Rings')}
                                className={`block w-full text-left p-2 rounded transition-colors duration-300 ${category === 'Rings' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 hover:bg-blue-100'}`}
                            >
                                Rings
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCategory('Earrings')}
                                className={`block w-full text-left p-2 rounded transition-colors duration-300 ${category === 'Earrings' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 hover:bg-blue-100'}`}
                            >
                                Earrings
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCategory('Necklaces')}
                                className={`block w-full text-left p-2 rounded transition-colors duration-300 ${category === 'Necklaces' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 hover:bg-blue-100'}`}
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
                                className={`block w-full text-left p-2 rounded transition-colors duration-300 ${priceSort === 'LowToHigh' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 hover:bg-blue-100'}`}
                            >
                                Price: Low to High
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setPriceSort('HighToLow')}
                                className={`block w-full text-left p-2 rounded transition-colors duration-300 ${priceSort === 'HighToLow' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 hover:bg-blue-100'}`}
                            >
                                Price: High to Low
                            </button>
                        </li>
                    </ul>

                    <button
                        onClick={handleClearFilters}
                        className="mt-8 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors duration-300"
                    >
                        Clear Filters
                    </button>
                </aside>
                <main className="flex-1 p-6 mt-16">
                    <div className="relative w-full h-32 bg-cover bg-center transition-opacity duration-300 ease-in-out" style={{ backgroundImage: "url('/wow.png')" }}>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredProducts.map(product => (
                                <div key={product.ProductID} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
                                    <img 
                                        src={product.ImageURL} 
                                        alt={product.Name} 
                                        className="w-full h-40 object-cover transition-transform duration-300 hover:scale-110 cursor-pointer"
                                        onClick={() => handleImageClick(product)}
                                    />
                                    <div className="p-4">
                                        <h2 className="text-xl font-bold mb-2">{product.Name}</h2>
                                        <p className="text-gray-800 font-semibold mb-2">Price: ${product.RetailPrice}</p>
                                        <p className={`text-sm mb-4 ${product.QtyInStock <= 0 ? 'text-red-500' : 'text-gray-600'}`}>
                                            {product.QtyInStock <= 0 ? 'Out of Stock' : `In Stock: ${product.QtyInStock}`}
                                        </p>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className={`flex items-center bg-blue-500 text-white py-2 px-2 rounded hover:bg-blue-600 transition-colors duration-300 ${product.QtyInStock <= 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                                                disabled={product.QtyInStock <= 0}
                                            >
                                                <FaShoppingCart className="mr-2" />
                                                Add to Cart
                                            </button>
                                            <button
                                                onClick={() => handleAddRemoveWishlist(product)}
                                                className={`flex items-center py-2 px-2 rounded transition-colors duration-300 ${wishlist.includes(product.ProductID) ? 'bg-white-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
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
                    <Footer/>
                </main>
            </div>
            {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
            {selectedProduct && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 md:w-1/2 lg:w-1/3 relative">
                        <button
                            onClick={handleCloseDescription}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 text-2xl"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-4">{selectedProduct.Name}</h2>
                        <img src={selectedProduct.ImageURL} alt={selectedProduct.Name} className="w-full h-60 object-cover mb-4"/>
                        <p className="text-gray-700 mb-4">{selectedProduct.Description}</p>
                        <p className="text-gray-800 font-semibold mb-2">Price: ${selectedProduct.RetailPrice}</p>
                        <p className={`text-sm ${selectedProduct.QtyInStock <= 0 ? 'text-red-500' : 'text-gray-600'}`}>
                            {selectedProduct.QtyInStock <= 0 ? 'Out of Stock' : `In Stock: ${selectedProduct.QtyInStock}`}
                        </p>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handleAddToCart(selectedProduct)}
                                className={`flex items-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300 ${selectedProduct.QtyInStock <= 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                                disabled={selectedProduct.QtyInStock <= 0}
                            >
                                <FaShoppingCart className="mr-2" />
                                Add to Cart
                            </button>
                            <button
                                onClick={() => handleAddRemoveWishlist(selectedProduct)}
                                className={`flex items-center py-2 px-4 rounded transition-colors duration-300 ${wishlist.includes(selectedProduct.ProductID) ? 'bg-white-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
                            >
                                <FaHeart className={`mr-2 ${wishlist.includes(selectedProduct.ProductID) ? 'text-red-500' : 'text-gray-800'}`} />
                                {wishlist.includes(selectedProduct.ProductID) }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}