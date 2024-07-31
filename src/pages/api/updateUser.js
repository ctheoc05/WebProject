import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, firstName, lastName, username } = req.body;
  console.log('received data:', { email, firstName, lastName, username });

  try {
    // Check if the user exists
    const existingUser = await prisma.Users.findUnique({
      where: { Email: email },
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the new username is already taken by another user
    const existingUsernameUser = await prisma.Users.findUnique({
      where: { Username: username },
    });

    if (existingUsernameUser && existingUsernameUser.Email !== email) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Update the user in the database
    const user = await prisma.Users.update({
      where: { Email: email },
      data: {
        FirstName: firstName,
        LastName: lastName,
        Username: username,
        
      },
    });

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: error.message });
  } finally {
    await prisma.$disconnect();
  }
}
