import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, productID } = req.query;

    if (!email || !productID) {
        return res.status(400).json({ error: 'Email and productID are required' });
    }

    try {
        // Fetch the user to get UserID
        const user = await prisma.users.findUnique({
            where: { Email: email },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = user.UserID;

        // Delete the item from the wishlist
        const result = await prisma.wishlist.deleteMany({
            where: {
                UserID: userId,
                ProductID: parseInt(productID, 10),
            },
        });

        if (result.count === 0) {
            return res.status(404).json({ error: 'Item not found in wishlist' });
        }

        return res.status(200).json({ message: 'Item removed from wishlist' });
    } catch (error) {
        console.error('Error removing item from wishlist:', error);
        res.status(500).json({ error: 'Error removing item from wishlist', details: error.message });
    }
}