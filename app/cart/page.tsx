"use client"
import Image from "next/image"
import { useCart } from "@/context/CartContext"

export default function CartPage() {
  const { cart, removeFromCart } = useCart()

  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.qty
  }, 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20 border rounded-lg">
          <p className="text-gray-500 text-lg">Your cart is empty</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border rounded-lg p-4 shadow-sm"
              >
                
                {/* Product Image */}
                <div className="w-24 h-24 relative flex-shrink-0">
                  <Image
                    src={item.image} // 👈 make sure you store image in cart
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-500">Qty: {item.qty}</p>
                  <p className="text-gray-700 font-medium">
                    Rs. {item.price}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-md"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="border rounded-lg p-6 shadow-sm h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="flex justify-between mb-2">
              <span>Items</span>
              <span>{cart.length}</span>
            </div>

            <div className="flex justify-between mb-4">
              <span>Total</span>
              <span className="font-bold">Rs. {total}</span>
            </div>

            <button className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition">
              Proceed to Checkout
            </button>
          </div>

        </div>
      )}
    </div>
  )
}