import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req, res) {
  try {
    if (req.method === 'GET') {
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({ message: 'Email query parameter is required' });
      }

      // Fetch user by email
      const user = await prisma.Users.findUnique({
        where: {
          Email: email.toLowerCase(),
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({
        email: user.Email,
        firstName: user.FirstName,
        lastName: user.LastName,
        username: user.Username,
        gender: user.Gender,
      });
    }
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}