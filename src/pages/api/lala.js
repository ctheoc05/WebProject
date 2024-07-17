import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req, res) {
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
            input[type="text"], input[type="email"], input[type="password"], select {
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
            .error {
              color: red;
              margin-top: 10px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <form method="POST" action="/api/signup">
            <h1>Sign Up</h1>
            <label>
              First Name:
              <input type="text" name="firstName" required />
            </label>
            <br />
            <label>
              Last Name:
              <input type="text" name="lastName" required />
            </label>
            <br />
            <label>
              Email:
              <input type="email" name="email" required />
            </label>
            <br />
            <label>
              Username:
              <input type="text" name="username" required />
            </label>
            <br />
            <label>
              Password:
              <input type="password" name="password" required />
            </label>
            <br />
            <label>
              Gender:
              <select name="gender" required>
                <option value="">Select</option>
                <option value="F">Female</option>
                <option value="M">Male</option>
                <option value="O">Other</option>
              </select>
            </label>
            <br />
            <label>
              <input type="checkbox" name="agreeToTerms" required />
              I agree to the Terms and Conditions
            </label>
            <br />
            <button type="submit">Sign Up</button>
            <div id="error-message" class="error"></div>
          </form>
        </body>
        <script>
          document.querySelector('form').addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const data = {
              firstName: formData.get('firstName'),
              lastName: formData.get('lastName'),
              email: formData.get('email'),
              username: formData.get('username'),
              password: formData.get('password'),
              gender: formData.get('gender'),
              agreeToTerms: formData.get('agreeToTerms') ? true : false,
            };
             </script>
             </body>
          </html>
          `;


            // Validate password
            const password = data.password;
            const passwordValidation = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+.,;:"`~]).{8,30}$/;
            if (!passwordValidation.test(password)) {
              document.getElementById('error-message').textContent = 'Password must be 8-30 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.';
              return;
            }

            const response = await fetch('/api/signup', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
              window.location.href = '/api/login';
            } else {
              document.getElementById('error-message').textContent = result.message;
            }
          };
 
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } 
   if (req.method === 'POST') {
    const { firstName, lastName, email, username, password, gender, agreeToTerms } = req.body;

    try {
      // Create a new user account using Prisma
      const user = await prisma.users.create({
        data: {
          FirstName: firstName,
          LastName: lastName,
          Email: email,
          Username: username,
          Password: password, // Stored without hashing for simplicity
          Gender: gender,
          AgreeToTerms: agreeToTerms,
        },
      });

      res.status(201).json({ message: 'Account created successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
