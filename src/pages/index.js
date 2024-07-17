// pages/index.js
import Head from "next/head";
import Navbar from "./components/Navbar";
import "../app/globals.css";
import { useState } from "react";

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
    
    </>
  );
}