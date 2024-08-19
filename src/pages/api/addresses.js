import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { street, city, state, zip } = req.body;
    const { userId } = req.user; // assuming you have middleware to attach the user

    try {
      const address = await prisma.address.create({
        data: {
          street,
          city,
          state,
          zip,
          user: { connect: { id: userId } },
        },
      });
      res.status(200).json(address);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add address' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}