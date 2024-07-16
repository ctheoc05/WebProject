import React from 'react';
import Image from 'next/image';
import styles from './about.module.css';

const About = () => {
  return (
    <div className={styles.container}>
      <Image
        src="/lalala.png"
        alt="Flower Shop Logo"
        width={150}
        height={150}
        className={styles.logo}
      />
      <h1 className={styles.title}>About Our Flower Shop</h1>
      <p className={styles.description}>
        Welcome to our enchanting flower shop, where we specialize in crafting
        the most exquisite floral arrangements for every occasion.
      </p>
      <p className={styles.description}>
        At our shop, we believe in the magic of flowers to brighten any day and
        add a touch of elegance to every celebration. Whether you're looking
        for a stunning bouquet for a loved one or floral decorations for an
        event, we are here to fulfill your floral fantasies.
      </p>
      <p className={styles.description}>
        Our team of skilled florists carefully selects each bloom to ensure
        every arrangement is a work of art. With a passion for creativity and
        an eye for detail, we create designs that captivate and inspire.
      </p>
      <p className={styles.description}>
        Browse through our collection and let our flowers speak to you. We
        look forward to helping you express your emotions through the language
        of flowers.
      </p>
    </div>
  );
};




export default About;

