// pages/api/signup.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const saltRounds=10;

const prisma = new PrismaClient();

export default async function handle(req, res) {
  if (req.method === 'GET') {
    const html = `
      <html>
        <head>
          <style>
            .container {
              max-width: 500px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f7f7f7;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            form {
              display: flex;
              flex-direction: column;
            }
            h1 {
              text-align: center;
              color: #333;
            }
            label {
              margin-bottom: 10px;
              color: #555;
            }
            input[type="text"],
            input[type="email"],
            input[type="password"],
            select {
              width: 100%;
              padding: 10px;
              margin-bottom: 15px;
              border: 1px solid #ccc;
              border-radius: 4px;
            }
            input[type="checkbox"] {
              margin-right: 10px;
            }
            button {
              width: 100%;
              padding: 10px;
              margin-top: 10px;
              background-color: #4CAF50;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            }
            button:hover {
              background-color: #45a049;
            }
            .error {
              color: red;
              margin-top: 10px;
              text-align: center;
            }
            .login-button {
              background-color: #007bff;
              margin-top: 10px;
            }
            .login-button:hover {
              background-color: #0056b3;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <form method="POST" action="/api/signup">
              <h1>Sign Up</h1>
              <label>
                First Name:
                <input type="text" name="firstName" required />
              </label>
              <label>
                Last Name:
                <input type="text" name="lastName" required />
              </label>
              <label>
                Email:
                <input type="email" name="email" required />
              </label>
              <label>
                Username:
                <input type="text" name="username" required />
              </label>
              <label>
                Password:
                <input type="password" name="password" required />
              </label>
              <label>
                Gender:
                <select name="gender" required>
                  <option value="">Select</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label>
                <input type="checkbox" name="agreeToTerms" required />
                I agree to the Terms and Conditions
              </label>
              <div style="display: flex; justify-content: center;">
                <button type="submit">Sign Up</button>
                <button class="login-button" type="button" onclick="window.location.href='/api/login'">Login</button>
              </div>
            </form>
            <div class="error" id="error"></div>
          </div>
          <script>
            function validatePassword(password) {
              const passwordLength = password.length >= 8 && password.length <= 30;
              const containsNumber = /[0-9]/.test(password);
              const containsLowerCase = /[a-z]/.test(password);
              const containsUpperCase = /[A-Z]/.test(password);
              const containsSpecialChar = /[!@#$%^&*()\\-_=+.,;:"'~]/.test(password);

              return passwordLength && containsNumber && containsLowerCase && containsUpperCase && containsSpecialChar;
            }

            document.querySelector('form').addEventListener('submit', async function (event) {
              event.preventDefault();
              const formData = new FormData(event.target);
              const data = Object.fromEntries(formData.entries());

              const errorElement = document.getElementById('error');
              errorElement.textContent = '';

              if (!validatePassword(data.password)) {
                errorElement.textContent = 'Password must be 8-30 characters long and include at least one number, one lowercase letter, one uppercase letter, and one special character.';
                return;
              }

              const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
              });

              const result = await response.json();
              if (response.ok) {
                window.location.href = '/api/login';
              } else {
                errorElement.textContent = result.message;
              }
            });
          </script>
        </body>
      </html>
    `;
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  }

  if (req.method === 'POST') {
    const { firstName, lastName, email, username, password, gender, agreeToTerms } = req.body;

    if (!firstName || !lastName || !email || !username || !password || !gender || !agreeToTerms) {
      return res.status(400).json({ message: 'Please fill in all fields and agree to the Terms and Conditions!' });
    }

    // Server-side password validation
    const validatePassword = (password) => {
      const passwordLength = password.length >= 8 && password.length <= 30;
      const containsNumber = /[0-9]/.test(password);
      const containsLowerCase = /[a-z]/.test(password);
      const containsUpperCase = /[A-Z]/.test(password);
      const containsSpecialChar = /[!@#$%^&*()\\-_=+.,;:"'~]/.test(password);

      return passwordLength && containsNumber && containsLowerCase && containsUpperCase && containsSpecialChar;
    };

    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be 8-30 characters long and include at least one number, one lowercase letter, one uppercase letter, and one special character.' });
    }

    try {

      const hashedPassword= await bcrypt.hash(password,saltRounds)
      const user = await prisma.Users.create({
        data: {
          FirstName: firstName,
          LastName: lastName,
          Email: email.toLowerCase(),
          Username: username,
          Password: hashedPassword,
          Gender: gender === 'Female'? 'F' : gender === 'Male'? 'M' : 'O', // Save M, F, or O in the database
          AgreeToTerms: !!agreeToTerms,
        },
      });

      return res.status(201).json({ success: true, message: 'Account created successfully!' });
    } catch (error) {
      console.error('Error creating user account:', error);
      return res.status(500).json({ message: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}