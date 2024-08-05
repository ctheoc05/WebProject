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
        // Delete the item from the wishlist
        await prisma.wishlist.deleteMany({
            where: {
                Email: email,
                ProductID: productID,
            },
        });
        return res.status(200).json({ message: 'Item removed from wishlist' });
    } catch (error) {
        console.error('Error removing item from wishlist:', error);
        res.status(500).json({ error: 'Error removing item from wishlist', details: error.message });
    }
}