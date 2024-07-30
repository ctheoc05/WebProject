import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { currentPassword, newPassword } = req.body;
      const { username, email } = req.headers;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current and new password are required' });
      }

      if (!username || !email) {
        return res.status(401).json({ message: 'No user is logged in' });
      }

      // Retrieve user from the database
      const user = await prisma.Users.findUnique({
        where: {
          Username: username,
          Email: email,
        },
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid user' });
      }

      // Check if current password is valid
      const isPasswordValid = await bcrypt.compare(currentPassword, user.Password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid current password' });
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Update the password in the database
      await prisma.Users.update({
        where: {
          Username: username,
        },
        data: {
          Password: hashedNewPassword,
        },
      });

      return res.status(200).json({ message: 'Password updated successfully' });
    }

    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}
