import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/context/CartContext"

export default function Navigation() {
  const { cart, cartCount } = useCart()
  const [showCart, setShowCart] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md px-6 py-4">
      
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <h1 className="text-xl font-bold">My Store</h1>

        {/* Links */}
        <ul className="flex items-center gap-6">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/products">Products</Link></li>
          <li><Link href="/checkout">Checkout</Link></li>

          {/* Cart */}
          <li
            className="relative"
            onMouseEnter={() => setShowCart(true)}
            onMouseLeave={() => setShowCart(false)}
          >
            <Link href="/cart" className="relative font-medium">
              🛒

              {/* Cart Count */}
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mini Cart Dropdown */}
            {showCart && (
              <div className="absolute right-0 w-80 bg-white border rounded-lg shadow-lg p-4">
                
                <h3 className="font-semibold mb-3">Cart Preview</h3>

                {cart.length === 0 ? (
                  <p className="text-gray-500">Cart is empty</p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 border-b pb-2"
                      >
                        {/* Image */}
                        <div className="relative w-12 h-12">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.qty}
                          </p>
                        </div>

                        <p className="text-sm font-semibold">
                          Rs. {item.price}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer */}
                {cart.length > 0 && (
                  <Link
                    href="/cart"
                    className="block mt-4 text-center bg-black text-white py-2 rounded-md hover:bg-gray-800"
                  >
                    View Cart
                  </Link>
                )}
              </div>
            )}
          </li>
        </ul>

      </div>
    </nav>
  )
}