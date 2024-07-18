// pages/about.js
import React from 'react';
import Image from 'next/image';
import Navbar from './components/Navbar';

const About = () => {
  const containerStyles = {
    maxWidth: '800px',
    margin:'80px auto 20px',
    padding: '20px',
  };

  const imageContainerStyles = {
    textAlign: 'center',
    marginBottom: '20px',
  };

  const titleStyles = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  };

  const descriptionStyles = {
    color: '#555',
    lineHeight: '1.6',
    marginBottom: '15px',
  };

  const logoStyles = {
    borderRadius: '50%',
  };

  return (
    <div>
      <Navbar />
      <div style={containerStyles}>
        <div style={imageContainerStyles}>
          <Image
            src="/lalala.png"
            alt="Flower Shop Logo"
            width={150}
            height={150}
            style={logoStyles}
          />
        </div>
        <h1 style={titleStyles}>About Our Flower Shop</h1>
        <p style={descriptionStyles}>
          Welcome to our enchanting flower shop, where we specialize in crafting
          the most exquisite floral arrangements for every occasion.
        </p>
        <p style={descriptionStyles}>
          At our shop, we believe in the magic of flowers to brighten any day and
          add a touch of elegance to every celebration. Whether you're looking
          for a stunning bouquet for a loved one or floral decorations for an
          event, we are here to fulfill your floral fantasies.
        </p>
        <p style={descriptionStyles}>
          Our team of skilled florists carefully selects each bloom to ensure
          every arrangement is a work of art. With a passion for creativity and
          an eye for detail, we create designs that captivate and inspire.
        </p>
        <p style={descriptionStyles}>
          Browse through our collection and let our flowers speak to you. We
          look forward to helping you express your emotions through the language
          of flowers.
        </p>
      </div>
    </div>
  );
};

export default About;