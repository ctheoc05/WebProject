Στείλατε
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
        // Update the quantity of the item in the wishlist
        const updatedItem = await prisma.wishlist.updateMany({
            where: {
                Email: email,
                ProductID: productID,
            },
            data: {
                Quantity: quantity,
            },
        });
        return res.status(200).json({ message: 'Wishlist item quantity updated', updatedItem });
    } catch (error) {
        console.error('Error updating wishlist item quantity:', error);
        res.status(500).json({ error: 'Error updating wishlist item quantity', details: error.message });
    }
}