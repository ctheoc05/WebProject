import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { cart, deliveryAddress, paymentMethod, email } = req.body;

    if (!cart || !deliveryAddress || !paymentMethod || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Create the order
      const order = await prisma.orders.create({
        data: {
          OrderDate: new Date(),
          Email: email,
        },
      });

      // Create the delivery information
      await prisma.delivery.create({
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
      const orderProducts = cart.map((product) => ({
        OrderID: order.OrderID,
        ProductID: product.ProductID,
        Quantity: product.quantity,
      }));

      await prisma.orderProduct.createMany({
        data: orderProducts,
      });

      // Send order confirmation email
      const transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 2525,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: '"Web Project" <webprojectplaytech@example.com>',
        to: email,
        subject: 'Order Confirmation',
        text: `Your order has been placed successfully. Details: ${JSON.stringify(orderProducts)}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending order confirmation email:', error);
        } else {
          console.log('Order confirmation email sent:', info.response);
        }
      });

      res.status(200).json({ message: 'Order placed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to place order' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}