import { products } from "@/data/products";
import ProductList from "@/components/ProductList";

export default function ProductPage() {
  return (
    <div className="main_head_padding">
      <h1>All Products</h1>
      
      <ProductList products={products} />
    </div>
  );
}