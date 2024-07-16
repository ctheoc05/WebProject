// pages/index.js
import Head from "next/head";
import './signup.css';
import Navbar from "../components/Navbar.js";
import "../app/globals.css";
import { useEffect, useState } from "react";
import { PrismaClient } from '@prisma/client';

export const getServerSideProps = async () => {
  const res = await fetch('http://localhost:3000/api/users');
  const Users = await res.json();
  return {
    props: { Users: Array.isArray(Users) ? Users : [] },
  };
};

// export default function Home({ Users }) {
// const [products, setProducts] = useState(null);

//   useEffect(async () => {
//     const res = await fetch('http://localhost:3000/api/products');
//     const products = await res.json();
//     setProducts(products);
//   }, []);

//   console.log('products ', products)

//   return (
//     <>
//       <Navbar />
//       <div>
//         {Users.map((p) => {
//           return (
//             <div key={p.Username}>
//               <p>
//                 {p.FirstName} - {p.LastName}
//               </p>
//             </div>
//           );
//         })}
//       </div>
//     </>
//   );
// }

// import { useState } from 'react';
// import './signup.css';
// import { PrismaClient } from '@prisma/client';


const SignUpPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [gender, setGender] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if all fields are filled
    if (!firstName || !lastName || !email || !username || !password || !gender) {
      setError('Please fill in all fields to sign up!');
      return;
    }

    // Check if user agrees to terms and conditions
    if (!agreeToTerms) {
      setError('Please agree to the Terms and Conditions first!');
      return;
    }

    try {
      // Create a new user account using Prisma
      const user = await prisma.Users.create({
        data: {
          FirstName: firstName,
          LastName: lastName,
          Email: email,
          Username: username,
          Password: password,
          Gender: gender,
          AgreeToTerms: agreeToTerms
        },
      });

      // Simulate a successful sign-up response
      const response = { success: true, message: 'Account created successfully!' };
      if (response.success) {
        // Redirect to login page or dashboard
        window.location.href = '/login';
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error(error);
      setError('Error creating user account.');
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <label>
          First Name:
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </label>
        <br />
        <label>
          Last Name:
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </label>
        <br />
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <label>
          Gender:
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <br />
        <label>
          <input type="checkbox" value={agreeToTerms} onChange={(e) => setAgreeToTerms(e.target.checked)} />
          I agree to the Terms and Conditions
        </label>
        <br />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button type="submit">Sign Up</button>
          <button className="login-button">Login</button>
        </div>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default SignUpPage;