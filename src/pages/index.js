import Head from "next/head";
import Navbar from "../components/Navbar";
import "../app/globals.css";
import { useState } from "react";
import Login from "../components/login";
import { Typography } from '@mui/material';

export const getServerSideProps = async () => {
  const res = await fetch('http://localhost:3000/api/products');
  const ProductsAnthia = await res.json();
  return {
    props: { ProductsAnthia: Array.isArray(ProductsAnthia) ? ProductsAnthia : [] },
  };
};

export default function Home({ ProductsAnthia }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Navbar />
      <div className="main-content">
        {!isLoggedIn ? (
          <Login setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <div style={{ padding: '20px' }}>
            <Typography component="h1" variant="h5" style={{ marginBottom: '20px' }}>
              Products
            </Typography>
            <div>
              {ProductsAnthia.map((p) => (
                <div key={p.ProductID} style={{ marginBottom: '10px' }}>
                  <p>
                    {p.Name} - {p.RetailPrice}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}