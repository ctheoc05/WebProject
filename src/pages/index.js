// pages/index.js
import Head from "next/head";
import Navbar from "./components/Navbar";
import "../app/globals.css";
import { useState } from "react";

export const getServerSideProps = async () => {
  const res = await fetch('http://localhost:3000/api/products');
  const Products = await res.json();
  return {
    props: { Products: Array.isArray(Products) ? Products : [] },
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