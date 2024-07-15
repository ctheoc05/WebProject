// import { useState } from "react";

// const LoginPage = () => {
//   const [Username, setUsername] = useState("");
//   const [Password, setPassword] = useState("");
//   const [error, setError] = useState(null);

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     try {
//       const response = await fetch("/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ Username, Password }),
//       });

//       if (response.ok) {
//         // Login successful, redirect to protected route
//         window.location.href = "/protected";
//       } else {
//         setError("Invalid username or password");
//       }
//     } catch (error) {
//       console.error(error);
//       setError("Error logging in");
//     }
//   };

//   return (
//     <div>
//       <h1>Login</h1>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Username:
//           <input type="text" value={Username} onChange={(e) => setUsername(e.target.value)} />
//         </label>
//         <br />
//         <label>
//           Password:
//           <input type="password" value={Password} onChange={(e) => setPassword(e.target.value)} />
//         </label>
//         <br />
//         <button type="submit">Login</button>
//       </form>
//       {error && <div style={{ color: "red" }}>{error}</div>}
//     </div>
//   );
// };

// export default LoginPage;