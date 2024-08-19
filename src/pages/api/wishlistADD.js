import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, productId } = req.body;

        if (!email || !productId) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        try {
            // Fetch the user to get UserID
            const user = await prisma.users.findUnique({
                where: { Email: email },
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found.' });
            }

            const userId = user.UserID;

            // Check if the item already exists in the wishlist
            const existingItem = await prisma.wishlist.findFirst({
                where: {
                    UserID: userId,
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
                        UserID: userId,
                        ProductID: productId,
                        Quantity: 1,
                    },
                    include: {
                        Products: true, // Include related product details
                    },
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