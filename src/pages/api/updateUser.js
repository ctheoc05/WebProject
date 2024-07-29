import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {email, firstName, lastName, username, gender } = req.body;
  console.log('received data:', {email, firstName, lastName, username, gender } );

  try{
    const existingUser =await prisma.Users.findUnique({
      where: { Email: email},
    });

  if(!existingUser){
    return res.status(404).json({message: 'user not found'});
  }


    const user = await prisma.Users.update({
      where: { Email: email, },
      data: {
        FirstName: firstName,
        LastName: lastName,
        Username: username,
        Gender: gender,
      },
    });

  
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('error updating user', error);
    res.status(500).json({ message: error.message });

  } finally {
    await prisma.$disconnect();
  }
}