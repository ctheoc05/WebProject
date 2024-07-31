//pages/api/wishlistADD
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, username, productId, quantity } = req.body;

        if (!email || !username || !productId || quantity === undefined) {
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
                // Update the quantity if the item already exists
                const updatedItem = await prisma.wishlist.update({
                    where: {
                        WishlistID: existingItem.WishlistID,
                    },
                    data: {
                        Quantity: existingItem.Quantity + quantity,
                    },
                });
                res.status(200).json(updatedItem);
            } else {
                // Add a new item to the wishlist
                const newItem = await prisma.wishlist.create({
                    data: {
                        Email: email,
                        Username: username,
                        ProductID: productId,
                        Quantity: quantity,
                    },
                    include: {
                      Products: true,
                    }
                });
                res.status(200).json(newItem);
            }
        } catch (error) {
            console.error('Error in wishlistADD handler:', error);
            res.status(500).json({ error: 'Error adding item to wishlist.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed.' });
    }
}