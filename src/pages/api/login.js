// src/pages/api/login.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handle(req, res) {
  try {
    if (req.method === 'GET') {
      const html = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
              }
              form {
                background-color: #fff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                width: 300px;
              }
              input[type="text"], input[type="password"] {
                width: 100%;
                padding: 10px;
                margin-bottom: 10px;
                border: 1px solid #ccc;
                border-radius: 3px;
                box-sizing: border-box;
              }
              button {
                width: 100%;
                padding: 10px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
              }
              button:hover {
                background-color: #45a049;
              }
            </style>
          </head>
          <body>
            <form method="POST" action="/api/login">
              <input type="text" name="email" placeholder="Email" required>
              <input type="password" name="password" placeholder="Password" required>
              <button type="submit">Login</button>
            </form>
          </body>
        </html>
      `;

      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    }

    if (req.method === 'POST') {
      const { email, password } = req.body;
      
      // Log received email and password
      console.log('Received login request:', { email, password });

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Find user in the database
      const Users = await prisma.Users.findUnique({
        where: {
          Email: email.toLowerCase(),
        },
      });

      // Log user information
      console.log('User found:', Users);

      if (!Users) {
        return res.status(401).json({ message: 'Invalid email' });
      }

      // Compare passwords using bcrypt
      const isPasswordValid = password === Users.Password;

      // Log password validation result
      console.log('Is password valid:', isPasswordValid);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      // If login is successful
      return res.status(200).json({ message: 'Login successful' });
    }

    // Handle other methods
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}