// pages/components/Navbar.js
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaShoppingCart, FaHeart, FaUser } from 'react-icons/fa';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const links = [
    { id: 3, link: '', href: '/account', icon: <FaUser size={20} /> },
    { id: 4, link: '', href: '/wishlist', icon: <FaHeart size={20} /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 0);
    };

    const updateCartCount = () => {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const cart = JSON.parse(storedCart);
        const count = cart.reduce((total, product) => total + (product.quantity || 1), 0);
        setCartCount(count);
      }
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);

    if (typeof window !== 'undefined') {
      const username = localStorage.getItem('username');
      if (username) {
        setIsLoggedIn(true);
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div className={`flex justify-between items-center w-full h-20 px-4 text-black bg-white fixed top-0 z-50 transition-all duration-300 ${scroll ? 'shadow-lg bg-opacity-90' : 'bg-opacity-100'}`}>
      <div>
        <h1 className="text-5xl font-signature ml-2">
          <Link href="/" legacyBehavior>
            <a className="link-black">
              <img
                src="/654073.png"
                alt="Logo"
                className="w-10 md:w-15 lg:w-10 h-auto"
              />
            </a>
          </Link>
        </h1>
      </div>

      <ul className="hidden md:flex items-center">
        {links.map(({ id, link, href, icon }) => (
          <li key={id} className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-black duration-200">
            <Link href={href} legacyBehavior>
              <a className="flex items-center">
                {icon || link}
              </a>
            </Link>
          </li>
        ))}
        <li className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-black duration-200 flex items-center">
          <button onClick={handleCartToggle} className="relative flex items-center">
            <FaShoppingCart size={20} />
            <span className="ml-2">({cartCount})</span>
          </button>
        </li>
      </ul>

      <div onClick={() => setNav(!nav)} className="cursor-pointer pr-4 z-10 md:hidden">
        {nav ? <FaTimes size={30} /> : <FaBars size={30} />}
      </div>

      {nav && (
        <ul className="flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-gray-100">
          {links.map(({ id, link, href, icon }) => (
            <li key={id} className="px-4 cursor-pointer capitalize py-6 text-2xl">
              <Link href={href} legacyBehavior>
                <a onClick={() => setNav(!nav)} className="flex items-center">
                  {icon || link}
                </a>
              </Link>
            </li>
          ))}
          <li className="px-4 cursor-pointer capitalize py-6 text-2xl">
            <button onClick={handleCartToggle} className="flex items-center">
              <FaShoppingCart size={30} />
              <span className="ml-2">({cartCount})</span>
            </button>
          </li>
        </ul>
      )}

      {isCartOpen && (
        <CartDrawer onClose={handleCartToggle} />
      )}
    </div>
  );
};

export default Navbar;