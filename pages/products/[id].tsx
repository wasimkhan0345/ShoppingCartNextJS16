import { useParams } from "next/navigation"
import { products } from "@/data/products";
import Image from "next/image"


export default function ProductDetailPage() {
  const { id } = useParams();

  const product = products.find(p => p.id == Number(id));

  if(!product) {
    return <h1>Product not found</h1>;
  }

  return (
    <div className="main_head_padding">
      <h1>{product.name}</h1>
      <p>Rs. { product.price }</p>
      <Image src={product.image} alt={product.name} width={400} height={400}  />
    </div>
  );
}