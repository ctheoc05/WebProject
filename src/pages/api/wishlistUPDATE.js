import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, productID, quantity } = req.body;

    if (!email || !productID || quantity === undefined) {
        return res.status(400).json({ error: 'Email, productID, and quantity are required' });
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

        // Update the quantity of the item in the wishlist
        const result = await prisma.wishlist.updateMany({
            where: {
                UserID: userId,
                ProductID: parseInt(productID, 10),
            },
            data: {
                Quantity: quantity,
            },
        });

        if (result.count === 0) {
            return res.status(404).json({ error: 'Item not found in wishlist' });
        }

        return res.status(200).json({ message: 'Wishlist item quantity updated' });
    } catch (error) {
        console.error('Error updating wishlist item quantity:', error);
        res.status(500).json({ error: 'Error updating wishlist item quantity', details: error.message });
    }
}