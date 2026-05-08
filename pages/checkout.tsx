// pages/checkout.js
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Simple client-side validation
    if (!formData.name || !formData.email || !formData.password || !formData.address || !formData.phone) {
      setError("Please fill in all fields.");
      setIsSubmitting(false);
      return;
    }

    // Prepare order data
    const orderData = {
      email: formData.email,
      password: formData.password,
      customer: {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      },
      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.qty,
        imageUrl: item.imageUrl,
      })),
      totalAmount: total,
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Checkout failed");

      // Clear cart after successful order
      clearCart();
      // Redirect to a success page or show a message
      router.push("/success?orderId=" + data.orderId);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <p className="text-gray-500 text-lg">Your cart is empty. Add items before checking out.</p>
        <button
          onClick={() => router.push("/products")}
          className="mt-6 bg-black text-white px-6 py-2 rounded-md"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Items Summary */}
        <div className="lg:col-span-2 border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-4">
                <div className="w-20 h-20 relative flex-shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">Qty: {item.qty}</p>
                  <p className="text-gray-800">Rs. {item.price}</p>
                </div>
                <div className="font-medium">
                  Rs. {item.price * item.qty}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-lg mt-6">
            <span>Total</span>
            <span>Rs. {total}</span>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Details</h2>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
              <p className="text-xs text-gray-500 mt-1">
                If this email already exists, we will log you in. Otherwise, a new account will be created.
              </p>
            </div>
            <div>
              <label className="block font-medium mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Delivery Address</label>
              <textarea
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition disabled:bg-gray-400"
            >
              {isSubmitting ? "Processing..." : `Place Order (Rs. ${total})`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}