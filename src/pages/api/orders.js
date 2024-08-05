//pages/api/orders
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    try {
      const orders = await prisma.orders.findMany({
        where: { Email: email },
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
      console.error(error);
      return res.status(500).json({ error: 'Error fetching orders' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}