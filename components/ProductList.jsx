import ProductCard from "@/components/ProductCard";

export default function ProductList({ products}) {
    return (
        <div className="grid">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}