//pages/api/Logout.js
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
                font-family: 'Arial', sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #f0f0f0;
                margin: 0;
              }
              .container {
                background-color: #fff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                text-align: center;
                max-width: 400px;
                width: 100%;
              }
              h2 {
                color: #333;
                margin-bottom: 20px;
              }
              input {
                width: calc(100% - 20px);
                padding: 10px;
                margin: 10px 0;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-size: 16px;
              }
              button {
                padding: 12px 20px;
                background-color: #007BFF;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                transition: background-color 0.3s;
                width: calc(100% - 20px);
              }
              button:hover {
                background-color: #0056b3;
              }
              .message {
                margin-top: 10px;
                font-size: 14px;
                color: red;
              }
              .link {
                color: #007BFF;
                text-decoration: none;
                display: block;
                margin-top: 20px;
              }
              .link:hover {
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Confirm Logout</h2>
              <form method="POST" action="/api/logout" onsubmit="return handleSubmit(event)">
                <input type="password" name="password" placeholder="Enter your password to confirm" required />
                <button type="submit">Logout</button>
              </form>
              <div id="message" class="message"></div>
              <a href="/account#" class="link">Cancel</a>
            </div>
            <script>
              async function handleSubmit(event) {
                event.preventDefault();
                const form = event.target;
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                const response = await fetch('/api/logout', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'username': localStorage.getItem('username'),
                    'email': localStorage.getItem('email'),
                    'firstname': localStorage.getItem('firstname'),
                    'lastname': localStorage.getItem('lastname'),
                    'gender': localStorage.getItem('gender')
                  },
                  body: JSON.stringify(data)
                });

                const result = await response.json();
                const messageDiv = document.getElementById('message');

                if (response.ok) {
                  localStorage.removeItem('username');
                  localStorage.removeItem('email');
                  localStorage.removeItem('firstname');
                  localStorage.removeItem('lastname');
                  localStorage.removeItem('gender');
                  window.location.href = '/';
                } else {
                  messageDiv.textContent = result.message;
                  messageDiv.style.color = 'red';
                }
              }
            </script>
          </body>
        </html>
      `;

      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    }

    if (req.method === 'POST') {
      const { password } = req.body;
      const username = req.headers.username;
      const email = req.headers.email;
      const firstname = req.headers.firstname;
      const lastname = req.headers.lastname;
      const gender = req.headers.gender;

      if (!password) {
        return res.status(400).json({ message: 'Password is required' });
      }

      if (!username || !email) {
        return res.status(401).json({ message: 'No user is logged in' });
      }

      const user = await prisma.Users.findUnique({
        where: {
          Username: username,
          Email: email,
        },
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid user' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.Password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      return res.status(200).json({ message: 'Logout successful' });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end('Method ${req.method} Not Allowed');
  } catch (error) {
    console.error('Error during logout:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}