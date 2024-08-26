// File: /pages/api/repeatOrder.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    try {
      // Fetch the order with its products
      const order = await prisma.orders.findUnique({
        where: { OrderID: orderId },
        include: {
          OrderProduct: {
            include: {
              Products: true,
            },
          },
        },
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Assuming you want to create a new order with the same products
      const newOrder = await prisma.orders.create({
        data: {
          UserID: order.UserID,
          OrderDate: new Date(),
          // Add other necessary fields like totalAmount, etc.
          OrderProduct: {
            create: order.OrderProduct.map(op => ({
              ProductID: op.ProductID,
              Quantity: op.Quantity,
              // Add any other fields that are needed in the OrderProduct table
            })),
          },
        },
      });

      return res.status(200).json({ message: 'Order repeated successfully', newOrderId: newOrder.OrderID });
    } catch (error) {
      console.error('Error repeating order:', error);
      return res.status(500).json({ error: 'Error repeating order' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}