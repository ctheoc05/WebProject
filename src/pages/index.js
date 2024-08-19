import { useEffect, useState } from 'react';
import Navbar from "./components/Navbar";
import "../app/globals.css";
import { FaShoppingCart, FaHeart, FaBars } from 'react-icons/fa';
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
    const [searchQuery, setSearchQuery] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [wishlist, setWishlist] = useState([]);
    const [notification, setNotification] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    
     
    
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
            result = result.filter(product => product.Category.toLowerCase() === category.toLowerCase());
        }

        if (priceSort === 'LowToHigh') {
            result = result.sort((a, b) => a.RetailPrice - b.RetailPrice);
        } else if (priceSort === 'HighToLow') {
            result = result.sort((a, b) => b.RetailPrice - a.RetailPrice);
        }

        if (searchQuery) {
            result = result.filter(product => 
                product.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.Category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredProducts(result);
    }, [category, priceSort, searchQuery, products]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

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
        setSearchQuery('');
        setFilteredProducts([...products]);
    };

    const handleImageClick = (product) => {
        setSelectedProduct(product);
    };

    const handleCloseDescription = () => {
        setSelectedProduct(null);
    };
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

      return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
    <Navbar />
    <div className="relative mt-30 p-16 text-center">
        <img src="/wow.png" alt="Welcome Image" className="w-full h-80 object-cover" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <h1 className="text-3xl font-bold mb-4 bg-black bg-opacity-80 text-white px-4 py-2 rounded">Welcome to Our Website!</h1>
            <p className="text-lg bg-black bg-opacity-80 text-white px-4 py-2 rounded">
                Explore our collection and find the perfect product for you!
            </p>
        </div>
    </div>

            <div className="flex flex-1">
                {/* Toggle Button for Small Screens */}
                <button onClick={toggleSidebar} className="p-4 focus:outline-none md:hidden">
                    <FaBars size={24} />
                </button>

                {/* Sidebar */}
                <aside className={`fixed inset-y-0 left-0 bg-white shadow-md p-4 transform ${sidebarVisible ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-64`}>
                    <h2 className="text-lg font-semibold mb-4">Filter by Category</h2>
                    <ul className="space-y-2">
                        <li>
                            <button
                                className="block w-full text-left p-2 rounded bg-blue-500 text-white"
                            >
                                All
                            </button>
                        </li>
                        <li>
                            <button
                                className="block w-full text-left p-2 rounded bg-white text-gray-800 hover:bg-blue-100"
                            >
                                Rings
                            </button>
                        </li>
                        <li>
                            <button
                                className="block w-full text-left p-2 rounded bg-white text-gray-800 hover:bg-blue-100"
                            >
                                Earrings
                            </button>
                        </li>
                        <li>
                            <button
                                className="block w-full text-left p-2 rounded bg-white text-gray-800 hover:bg-blue-100"
                            >
                                Necklaces
                            </button>
                        </li>
                        <li>
                            <button
                                className="block w-full text-left p-2 rounded bg-white text-gray-800 hover:bg-blue-100"
                            >
                                Bracelets
                            </button>
                        </li>
                    </ul>

                    <h2 className="text-lg font-semibold mt-8 mb-4">Sort by Price</h2>
                    <ul className="space-y-2">
                        <li>
                            <button
                                className="block w-full text-left p-2 rounded bg-white text-gray-800 hover:bg-blue-100"
                            >
                                Low to High
                            </button>
                        </li>
                        <li>
                            <button
                                className="block w-full text-left p-2 rounded bg-white text-gray-800 hover:bg-blue-100"
                            >
                                High to Low
                            </button>
                        </li>
                    </ul>

                    <button
                        className="block w-full text-left p-2 mt-8 rounded bg-red-500 text-white hover:bg-red-600"
                    >
                        Clear Filters
                    </button>
                </aside>

                {/* Main Content */}
                
                <main className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search products..."
                            className="p-2 border border-gray-300 rounded w-full"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <div key={product.ProductID} className="bg-white p-4 shadow rounded">
                                <img
                                    src={product.ImageURL}
                                    alt={product.Name}
                                    className="w-full h-48 object-cover cursor-pointer"
                                    onClick={() => handleImageClick(product)}
                                />
                                <h3 className="mt-4 text-lg font-semibold">{product.Name}</h3>
                                <p className="text-gray-600">
                                    ${isNaN(parseFloat(product.RetailPrice)) ? 'N/A' : parseFloat(product.RetailPrice).toFixed(2)}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                                    >
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => handleAddRemoveWishlist(product)}
                                        className={`ml-4 ${wishlist.includes(product.ProductID) ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 transition-colors duration-300`}
                                    >
                                        <FaHeart size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>

            {selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded shadow-lg max-w-lg w-full">
                        <h2 className="text-xl font-bold mb-4">{selectedProduct.Name}</h2>
                        <img
                            src={selectedProduct.ImageURL}
                            alt={selectedProduct.Name}
                            className="w-full h-64 object-cover mb-4"
                        />
                        <p className="text-gray-700">{selectedProduct.Description}</p>
                        <button
                            onClick={handleCloseDescription}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {notification && (
                <Notification message={notification} onClose={() => setNotification(null)} />
            )}

            <Footer />
        </div>
    );
}