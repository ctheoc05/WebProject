//pages/api/wishlistREMOVE
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, productID } = req.body;

  if (!email || !productID) {
    return res.status(400).json({ error: 'Email and productID are required' });
  }

  try {
    // Find the wishlist item
    const wishlistItem = await prisma.wishlist.findFirst({
      where: {
        Email: email,
        ProductID: productID,
      },
    });

    if (!wishlistItem) {
      return res.status(404).json({ error: 'Item not found in wishlist' });
    }

    if (wishlistItem.Quantity > 1) {
      // Decrement the quantity
      const updatedItem = await prisma.wishlist.updateMany({
        where: {
          Email: email,
          ProductID: productID,
        },
        data: {
          Quantity: wishlistItem.Quantity - 1,
        },
      });
      return res.status(200).json({ message: 'Item quantity decremented', updatedItem });
    } else {
      // Delete the item if the quantity is 1
      await prisma.wishlist.deleteMany({
        where: {
          Email: email,
          ProductID: productID,
        },
      });
      return res.status(200).json({ message: 'Item removed from wishlist' });
    }
  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    res.status(500).json({ error: 'Error removing item from wishlist', details: error.message });
  }
}