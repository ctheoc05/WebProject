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
import Layout from '../components/layout.js';

const Home = () => {
  return (
    <Layout>
      <h1>Home Page</h1>
      <p>Welcome to our Next.js application.</p>
    </Layout>
  );
};

export default Home;
