//pages/api/wishlistGET
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(401).json({ error: 'You must be logged in to view your wishlist.' });
  }

  try {

    const user=await prisma.users.findUnique({
      where: {Email:email},
    });
    
    if(!user){
      return res.status(404).json({error: 'user not found'});
    }
    
    const wishlistItems = await prisma.wishlist.findMany({
      where: { UserID: user.UserID },
      include: {
        Products: true, // Ensure related products are included
      },
    });

    console.log('Fetched wishlist items:', wishlistItems); // Logging for debugging

    res.status(200).json(wishlistItems);
  } catch (error) {
    console.error('Error fetching wishlist items:', error); // Detailed logging
    res.status(500).json({ error: 'Error fetching wishlist items.', details: error.message });
  }
}