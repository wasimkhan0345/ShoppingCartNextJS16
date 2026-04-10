
"use client"

import { useState } from 'react'
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext"
import Toast from "@/components/Toast"

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [showToast, setShowToast] = useState(false)

  const handleAddToCart = () => {
    addToCart(product)
    
    setShowToast(true)

    setTimeout(() => {
      setShowToast(false)
    }, 2000)
  }

  return (
    <div className="card">
        <div className="imageWrapper" >
            <Image 
                src={product.image} 
                alt={product.name} 
                fill
                className="productImage" 
            />
        </div>
        <h3>{ product.name }</h3>
        <p className="mb-4">Rs. { product.price }</p>

        <Link href={ `products/${product.id}` } className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-300">
          View Details
        </Link>

        <button 
          onClick={() => handleAddToCart()} 
          className="mt-4 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >Add to Cart
        </button>

        {/* Toast */}
        <Toast message="✅ Item added to cart" show={showToast} />

    </div>    
  );
}