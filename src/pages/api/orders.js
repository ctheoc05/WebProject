import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    try {
      // First, find the user by email
      const user = await prisma.users.findUnique({
        where: { Email: email },
        select: { UserID: true },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Then, find the orders by UserID
      const orders = await prisma.orders.findMany({
        where: { UserID: user.UserID },
        include: {
          OrderProduct: {
            include: {
              Products: true,
            },
          },
        },
      });

      return res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ error: 'Error fetching orders' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}