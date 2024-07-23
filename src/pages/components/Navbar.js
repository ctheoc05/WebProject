import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaShoppingCart } from 'react-icons/fa';

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const links = [
    { id: 1, link: 'Home', href: '/' },
    { id: 2, link: 'About', href: '/about' },
    { id: 3, link: 'Contact', href: '/contact' },
    { id: 4, link: 'Account', href: '/account' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);

    // Check if the user is logged in
    if (typeof window !== 'undefined') {
      const username = localStorage.getItem('username');
      if (username) {
        setIsLoggedIn(true);
      }
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const redirectToLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <div className={`flex justify-between items-center w-full h-20 px-4 text-black bg-white fixed top-0 z-50 transition-all duration-300 ${scroll ? 'shadow-lg bg-opacity-90' : 'bg-opacity-100'}`}>
      <div>
        <h1 className="text-5xl font-signature ml-2">
          <Link href="/" legacyBehavior>
            <a className="link-black">Logo</a>
          </Link>
        </h1>
      </div>

      <ul className="hidden md:flex items-center">
        {links.map(({ id, link, href }) => (
          <li key={id} className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-black duration-200">
            <Link href={href} legacyBehavior>
              <a>{link}</a>
            </Link>
          </li>
        ))}
        {isLoggedIn && (
          <li className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-black duration-200">
            <button onClick={redirectToLogout}>Logout</button>
          </li>
        )}
        <li className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-black duration-200">
          <Link href="/cart" legacyBehavior>
            <a>
              <FaShoppingCart size={20} />
            </a>
          </Link>
        </li>
      </ul>

      <div onClick={() => setNav(!nav)} className="cursor-pointer pr-4 z-10 md:hidden">
        {nav ? <FaTimes size={30} /> : <FaBars size={30} />}
      </div>

      {nav && (
        <ul className="flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-gray-100">
          {links.map(({ id, link, href }) => (
            <li key={id} className="px-4 cursor-pointer capitalize py-6 text-2xl">
              <Link href={href} legacyBehavior>
                <a onClick={() => setNav(!nav)}>{link}</a>
              </Link>
            </li>
          ))}
          {isLoggedIn && (
            <li className="px-4 cursor-pointer capitalize py-6 text-2xl">
              <button onClick={redirectToLogout}>Logout</button>
            </li>
          )}
          <li className="px-4 cursor-pointer capitalize py-6 text-2xl">
            <Link href="/cart" legacyBehavior>
              <a onClick={() => setNav(!nav)}>
                <FaShoppingCart size={30} />
              </a>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Navbar;