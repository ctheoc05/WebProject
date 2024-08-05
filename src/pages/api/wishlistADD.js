import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, username, productId } = req.body;

        if (!email || !username || !productId) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        try {
            // Check if the item already exists in the wishlist
            const existingItem = await prisma.wishlist.findFirst({
                where: {
                    Email: email,
                    ProductID: productId,
                },
            });

            if (existingItem) {
                // Remove the item if it already exists
                await prisma.wishlist.delete({
                    where: {
                        WishlistID: existingItem.WishlistID,
                    },
                });
                res.status(200).json({ message: 'Item removed from wishlist.' });
            } else {
                // Add a new item to the wishlist with quantity 1
                const newItem = await prisma.wishlist.create({
                    data: {
                        Email: email,
                        Username: username,
                        ProductID: productId,
                        Quantity: 1,
                    },
                    include: {
                      Products: true,
                    }
                });
                res.status(200).json(newItem);
            }
        } catch (error) {
            console.error('Error in wishlistADD handler:', error);
            res.status(500).json({ error: 'Error adding/removing item in wishlist.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed.' });
    }
}