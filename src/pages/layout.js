
// components/Layout.js
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <>
      <main>{children}</main>
      <Navbar />

    </>
  );
};

export default Layout;