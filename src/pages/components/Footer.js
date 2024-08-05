// components/Footer.js
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
        <div className="bg-white shadow-md p-6 mt-8">
            <div className="container mx-auto text-center">
                <h2 className="text-2xl font-bold mb-4">About Us</h2>
                <p className="text-gray-600 mb-4">We are a leading e-commerce platform offering a wide range of jewellery products at competitive prices. Our mission is to provide the best online shopping experience for our customers.</p>
                <div className="flex justify-center space-x-4 mb-4">
                    <div>
                        <h3 className="text-xl font-semibold">Contact Us</h3>
                        <p className="text-gray-600">Email: TheJewelleryShop@eshop.com</p>
                        <p className="text-gray-600">Phone: +357 99834558</p>
                    </div>
                </div>
                <div className="flex justify-center space-x-4">
                    <a href="#" className="text-gray-600 hover:text-blue-500"><FaFacebook size={24} /></a>
                    <a href="#" className="text-gray-600 hover:text-blue-500"><FaTwitter size={24} /></a>
                    <a href="#" className="text-gray-600 hover:text-pink-500"><FaInstagram size={24} /></a>
                </div>
            </div>
        </div>
    );
};

export default Footer;