// pages/admin/index.tsx
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";
import { Product } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/router";

type Props = {
  products: Product[];
};

export default function AdminDashboard({ products: initialProducts }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState({ name: "", price: "", description: "", imageUrl: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        price: parseFloat(form.price),
        description: form.description,
        imageUrl: form.imageUrl,
      }),
    });
    if (res.ok) {
      const newProduct = await res.json();
      setProducts([newProduct, ...products]);
      setForm({ name: "", price: "", description: "", imageUrl: "" });
    } else {
      alert("Failed to add product");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts(products.filter(p => p.id !== id));
    } else {
      alert("Delete failed");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Product Management</h1>

      {/* Add Product Form */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Add New Product</h2>
        <form onSubmit={handleAdd} className="bg-gray-50 p-4 rounded space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Product Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              className="px-3 py-2 border rounded"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              required
              className="px-3 py-2 border rounded"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="col-span-2 px-3 py-2 border rounded"
              rows={2}
            />
            <input
              type="text"
              placeholder="Image URL (optional)"
              value={form.imageUrl}
              onChange={e => setForm({ ...form, imageUrl: e.target.value })}
              className="col-span-2 px-3 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </section>

      {/* Product List */}
      <section>
        <h2 className="text-xl font-semibold mb-3">All Products</h2>
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-t">
                <td className="p-2">{product.name}</td>
                <td className="p-2">${product.price.toFixed(2)}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session || session.user.role !== "admin") {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return { props: { products: JSON.parse(JSON.stringify(products)) } };
};