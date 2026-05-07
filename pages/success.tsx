import { useRouter } from "next/router";

export default function Success() {
  const router = useRouter();
  const { orderId } = router.query;

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Order Placed!</h1>
      <p className="text-gray-700 mb-2">Thank you for your purchase.</p>
      {orderId && <p className="text-gray-600">Order ID: #{orderId}</p>}
      <button
        onClick={() => router.push("/products")}
        className="mt-6 bg-black text-white px-6 py-2 rounded-md"
      >
        Continue Shopping
      </button>
    </div>
  );
}