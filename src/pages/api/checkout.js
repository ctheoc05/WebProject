// pages/api/checkout.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { cart, deliveryAddress, paymentMethod, email } = req.body;

    // Check for required fields
    if (!cart || !deliveryAddress || !paymentMethod || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const totalAmount = cart.reduce((total, product) => total + (product.RetailPrice * product.quantity), 0);

    try {
      // Retrieve the user based on the provided email
      const user = await prisma.Users.findUnique({
        where: { Email: email },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check stock before creating the order
      for (const product of cart) {
        const productInStock = await prisma.Products.findUnique({
          where: { ProductID: product.ProductID }
        });

        if (productInStock && productInStock.QtyInStock < product.quantity) {
          return res.status(400).json({ error: `Not enough stock for product ID ${product.ProductID}` });
        }
      }

      // Create the order and associate it with the user
      const order = await prisma.Orders.create({
        data: {
          OrderDate: new Date(),
          totalAmount: totalAmount,
          UserID: user.UserID, // Link the order to the logged-in user
        },
      });

      // Create the delivery information
      await prisma.Delivery.create({
        data: {
          OrderID: order.OrderID,
          FullName: deliveryAddress.name,
          Street: deliveryAddress.street,
          StreetNumber: deliveryAddress.number,
          City: deliveryAddress.city,
          PostalCode: deliveryAddress.postalCode,
          Country: deliveryAddress.country,
          PaymentMethod: paymentMethod,
        },
      });

      // Create order-product relationships
      const orderProducts = cart.map(product => ({
        OrderID: order.OrderID,
        ProductID: product.ProductID,
        Quantity: product.quantity,
        ProductName: product.Name,
      }));

      await prisma.OrderProduct.createMany({
        data: orderProducts,
      });

      // Update stock quantities
      for (const product of cart) {
        await prisma.Products.update({
          where: { ProductID: product.ProductID },
          data: { QtyInStock: { decrement: product.quantity } },
        });
      }

      res.status(200).json({ message: 'Order placed successfully!' });
    } catch (error) {
      console.error('Error processing order:', error);
      res.status(500).json({ error: error.message || 'Failed to place order' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}