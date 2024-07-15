// pages/api/products.js
//import Products from "..";
import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
    console.log('received request to /api/users');

    try{

        // console.log('prisma client:', prisma);
        // console.log('prisma product model: 2', prisma.ProductsAnthia);

  const users = await prisma.Users.findMany();
  console.log('fetch users: ', users);
  res.status(200).json(users);


    }catch(error){
        console.log('there is an error in users');
//         console.error('Faild to load products', error.message);
//         console.error('error stack:', error.stack);
//  res.status(500).json({error:'Faild to load products', details: error.message});
 // res.json(products);
}   }