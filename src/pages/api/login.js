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
                text-align: center;
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
              .message {
                margin-top: 10px;
                font-size: 14px;
                color: red;
              }
            </style>
          </head>
          <body>
            <form method="POST" action="/api/login" onsubmit="handleSubmit(event)">
              <input type="text" name="email" placeholder="Email" required>
              <input type="password" name="password" placeholder="Password" required>
              <button type="submit">Login</button>
              <div class="message" id="message"></div>
            </form>
            <script>
              async function handleSubmit(event) {
                event.preventDefault();
                const form = event.target;
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                const response = await fetch('/api/login', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(data)
                });

                const result = await response.json();
                const messageDiv = document.getElementById('message');

                if (response.ok) {
                  messageDiv.style.color = 'green';
                  localStorage.setItem('userEmail', result.email); // Store email in local storage
                  localStorage.setItem('username', result.username); // Store username in local storage
                  localStorage.setItem('username', result.firstname); // Store firstname in local storage
                  localStorage.setItem('username', result.lastname); // Store lastname in local storage
                  localStorage.setItem('username', result.gender); // Store gender in local storage

                  
                  window.location.href = 'http://localhost:3000';
                } else {
                  messageDiv.style.color = 'red';
                }

                messageDiv.textContent = result.message;
              }
            </script>
          </body>
        </html>
      `;

      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    }

    if (req.method === 'POST') {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await prisma.Users.findUnique({
        where: {
          Email: email.toLowerCase(),
        },
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid email' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.Password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      return res.status(200).json({ message: 'Login successful', email: user.Email, username: user.Username, firstname:user.FirstName, lastname:user.LastName, gender:user.Gender });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end('Method ${req.method} Not Allowed'); 
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}

