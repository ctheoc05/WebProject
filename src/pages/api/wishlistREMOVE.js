import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(401).json({ error: 'You must be logged in to view your wishlist.' });
  }

  try {
    const wishlistItems = await prisma.wishlist.findMany({
      where: { Email: email },
      include: {
        Products: true, // Correctly include the related Products
      },
    });

    console.log('Fetched wishlist items:', wishlistItems);

    res.status(200).json(wishlistItems);
  } catch (error) {
    console.error('Error fetching wishlist items:', error);
    res.status(500).json({ error: 'Error fetching wishlist items.' });
  }
}

