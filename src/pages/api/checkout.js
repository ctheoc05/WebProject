import { PrismaClient } from '@prisma/client';
// import { sendOrderConfirmationEmail } from '../../utils/sendEmail';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { cart, deliveryAddress, paymentMethod, email } = req.body;

    if (!cart || !deliveryAddress || !paymentMethod || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const totalAmount= cart.reduce((total,product) => total+ (product.RetailPrice * product.quantity),0);

    try {
      // Create the order
      const order = await prisma.orders.create({
        data: {
          OrderDate: new Date(),
          Email: email,
          totalAmount: totalAmount,
          
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
      const orderProducts = cart.map(product => ({
        OrderID: order.OrderID,
        ProductID: product.ProductID,
        Quantity: product.quantity,
        ProductName: product.Name
      }));

      await prisma.orderProduct.createMany({
        data: orderProducts,
      });

      // Send confirmation email
      // await sendOrderConfirmationEmail(email, { cart, deliveryAddress, paymentMethod });

      res.status(200).json({ message: 'Order placed and confirmation email sent successfully!' });
    } catch (error) {
      console.error('Error processing order:', error);
      res.status(500).json({ error: 'Failed to place order' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}