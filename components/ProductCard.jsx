
"use client"

import { useState } from 'react'
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext"
import Toast from "@/components/Toast"

export default function ProductCard({ product }) {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart()
  const [showToast, setShowToast] = useState(false)

  // Find item in cart and get its quantity (qty)
  const cartItem = cart.find(item => item.id === product.id)
  const qty = cartItem?.qty || 0

  const handleAddToCart = () => {
    addToCart(product)
    
    setShowToast(true)

    setTimeout(() => {
      setShowToast(false)
    }, 2000)
  }

  const handleIncrement = () => {
    updateQuantity(product.id, qty + 1)
  }

  const handleDecrement = () => {
    updateQuantity(product.id, qty - 1)
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

        {
        qty === 0 ? (
          <button 
            onClick={handleAddToCart} 
            className="mt-4 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" >
              Add to Cart
            </button>
        )
        :
        (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={handleDecrement}
              className="w-8 h-8 bg-gray-200 text-black rounded-full hover:bg-gray-300"
            >
              -
            </button>
            <span className="font-semibold text-lg">{qty}</span>
            <button
              onClick={handleIncrement}
              className="w-8 h-8 bg-gray-200 text-black rounded-full hover:bg-gray-300"
            >
              +
            </button>
          </div>
        )
      }

        
        {/* Toast */}
        <Toast message="✅ Item added to cart" show={showToast} />

    </div>    
  );
}