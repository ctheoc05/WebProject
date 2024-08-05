import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
    console.log('received request to /api/products');

    try {
        // console.log('prisma client:', prisma);
        // console.log('prisma product model:', prisma.Products);

        const products = await prisma.products.findMany({
            select: {
                ProductID: true,
                Name: true,
                Category: true,
                RetailPrice: true,
                QtyInStock: true,
                ImageURL: true, // Ensure this field is selected
                Description:true,
            },
        });

        console.log('fetched products: ', products);
        res.status(200).json(products);
    } catch (error) {
        console.log('there is an error in products');
        console.error('Failed to load products', error.message);
        console.error('error stack:', error.stack);
        res.status(500).json({ error: 'Failed to load products', details: error.message });
    }
}
