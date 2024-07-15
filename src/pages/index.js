// pages/index.js
import Head from "next/head";
import Navbar from "../components/Navbar.js";
import "../app/globals.css";
import { useEffect, useState } from "react";

export const getServerSideProps = async () => {
  const res = await fetch('http://localhost:3000/api/products');
  const ProductsAnthia = await res.json();
  return {
    props: { ProductsAnthia: Array.isArray(ProductsAnthia) ? ProductsAnthia : [] },
  };
};

export default function Home({ ProductsAnthia }) {
// const [products, setProducts] = useState(null);

//   useEffect(async () => {
//     const res = await fetch('http://localhost:3000/api/products');
//     const products = await res.json();
//     setProducts(products);
//   }, []);

//   console.log('products ', products)

  return (
    <>
      <Navbar />
      <div>
        {ProductsAnthia.map((p) => {
          return (
            <div key={p.ProductID}>
              <p>
                {p.Name} - {p.RetailPrice}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}