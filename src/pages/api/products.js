// pages/api/products.js
//import Products from "..";
import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
    console.log('received request to /api/products');

    try{

        console.log('prisma client:', prisma);
        console.log('prisma product model: 2', prisma.Products);

  const products = await prisma.Products.findMany();
  console.log('fetch products: ', products);
  res.status(200).json(products);


    }catch(error){
        console.log('there is an error in products');
        console.error('Faild to load products', error.message);
         console.error('error stack:', error.stack);
  res.status(500).json({error:'Faild to load products', details: error.message});
  res.json(Products);
}   }