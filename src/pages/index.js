// export const getServerSideProps = async () => {
//     const res = await fetch('http://localhost:3000/api/products');
//     const ProductsAnthia = await res.json();
//     return {
//       props: { ProductsAnthia: Array.isArray(ProductsAnthia) ? ProductsAnthia : [] },
//     };
//    };
//    export default function ProductsAnthia({ ProductsAnthia }) {
//     return (
//    <div>
//         {ProductsAnthia.map((p) => {
//           return (
//    <div key={p.ProductID}>
//    <p>
//                 {p.Name} - {p.RetailPrice}
//    </p>
//    </div>
//           );
//         })}
//    </div>
//     );
//    }

// pages/index.js

import Head from "next/head"
// import Layout from '../components/layout.js';
import Navbar from "../components/Navbar.js"
import "../app/globals.css";

export default function Home() {
  return (
    <>  
    <Navbar/>
    </>
     
  )
}