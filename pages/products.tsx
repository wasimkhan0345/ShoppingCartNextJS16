//import { products } from "@/data/products";

import { prisma } from "@/lib/prisma";

import ProductList from "@/components/ProductList";

export default function ProductPage({ products } : { products: any[] }) {
  return (
    <div className="main_head_padding">
      <h1>All Products</h1>
      
      <ProductList products={products} />
    </div>
  );
}

export async function getServerSideProps() {
  // Fetch all products from the "product" table

  const productsFromDb = await prisma.product.findMany();

  // If your static data had specific serialization (e.g., dates), 
  // Prisma already returns plain JS objects – safe to pass as props.

  // Convert Date objects to ISO strings
  const products = productsFromDb.map((product) => ({
    ...product,
    createdAt: product.createdAt?.toISOString(),
    updatedAt: product.updatedAt?.toISOString(),
    // add any other date fields here
  }));

  return { props: { products } };
}