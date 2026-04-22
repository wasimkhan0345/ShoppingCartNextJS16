// pages/admin/products/[id]/edit.tsx
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";
import { Product } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";

type Props = { product: Product };

export default function EditProduct({ product }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: product.name,
    price: product.price.toString(),
    description: product.description || "",
    imageUrl: product.imageUrl || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        price: parseFloat(form.price),
        description: form.description,
        imageUrl: form.imageUrl,
      }),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      alert("Update failed");
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="w-full px-3 py-2 border rounded"
          rows={3}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={e => setForm({ ...form, imageUrl: e.target.value })}
          className="w-full px-3 py-2 border rounded"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session || session.user.role !== "admin") {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const { id } = context.params!;
  const product = await prisma.product.findUnique({ where: { id: String(id) } });
  if (!product) return { notFound: true };

  return { props: { product: JSON.parse(JSON.stringify(product)) } };
};