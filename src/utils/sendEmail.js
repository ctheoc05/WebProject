// import nodemailer from 'nodemailer';

// // Configure your SMTP transport options
// const transporter = nodemailer.createTransport({
//   service: 'Gmail', // Example: 'Gmail', 'Yahoo', 'Outlook', etc.
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export const sendOrderConfirmationEmail = async (email, orderDetails) => {
//   const { cart, deliveryAddress, paymentMethod } = orderDetails;

//   const itemsList = cart.map(item => `${item.name} x ${item.quantity} - $${item.RetailPrice}`).join('<br>');

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: 'Order Confirmation',
//     html: `
//       <h1>Order Confirmation</h1>
//       <p>Thank you for your order!</p>
//       <h2>Order Details</h2>
//       <p><strong>Delivery Address:</strong><br>
//       ${deliveryAddress.name}<br>
//       ${deliveryAddress.street} ${deliveryAddress.number}<br>
//       ${deliveryAddress.city}, ${deliveryAddress.postalCode}<br>
//       ${deliveryAddress.country}</p>
//       <p><strong>Payment Method:</strong> ${paymentMethod}</p>
//       <h3>Items:</h3>
//       <p>${itemsList}</p>
//       <h3>Total: $${cart.reduce((total, product) => total + (product.RetailPrice * product.quantity), 0).toFixed(2)}</h3>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Order confirmation email sent successfully');
//   } catch (error) {
//     console.error('Error sending order confirmation email:', error);
//   }
// };