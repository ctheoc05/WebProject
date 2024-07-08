// import PriceTag from "@/components/PriceTag";
// import { prisma } from "@/lib/db/prisma";
// import { Metadata } from "next";
// import Image from "next/image";
// import { notFound } from "next/navigation";
// import { cache } from "react";
// import AddToCartButton from "./AddtoCartButton";
// import { incrementProductQuantity } from "./actions";

// interface ProductPageInterface {
//   params: {
//     id: string;
//   };
// }

// const getProduct = cache(async (id: string) => {
//   const product = await prisma.product.findUnique({ where: { id } });
//   if (!product) notFound();
//   return product;
// });

// export async function generateMetadata({
//   params: { id },
// }: ProductPageInterface): Promise<Metadata> {
//   const { name, description, imageUrl } = await getProduct(id);

//   return {
//     title: name + "e-commerce",
//     description: description,
//     openGraph: { images: [{ url: imageUrl }] },
//   };
// }

// export default async function ProductPage({
//   params: { id },
// }: ProductPageInterface) {
//   const {
//     id: productId,
//     description,
//     imageUrl,
//     name,
//     price,
//     createdAt,
//     updatedAt,
//   } = await getProduct(id);

//   return (
//     <>
//       <div className="flex flex-col gap-4 lg:flex-row lg:items-center ">
//         <Image
//           src={imageUrl}
//           width={500}
//           height={500}
//           alt={name}
//           priority
//           className="rounded-lg"
//         />

//         <div>
//           <h1 className="text-5xl font-bold">{name}</h1>
//           <PriceTag price={price} className="mt-4" />
//           <p className="py-6">{description}</p>
//           <AddToCartButton
//             productId={productId}
//             incrementProductQuantity={incrementProductQuantity}
//           />
//           {/* <span className="justify-end">{createdAt.toDateString()}</span> */}
//         </div>
//       </div>
//     </>
//   );
// }
