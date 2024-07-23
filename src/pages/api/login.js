import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import cookie from 'cookie';

const prisma = new PrismaClient();

export default async function handle(req, res) {
  try {
    if (req.method === 'GET') {
      // Your existing GET logic here...
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

      // Set a cookie with the username
      res.setHeader('Set-Cookie', cookie.serialize('username', user.Username, {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/'
      }));

      return res.status(200).json({ message: 'Login successful', username: user.Username });
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