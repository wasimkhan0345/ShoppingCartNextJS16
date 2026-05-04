// pages/admin/products/[id]/edit.tsx
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";
import { Product } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";

type Props = {
  product: Product;
};

export default function EditProduct({ product }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: product.name,
    price: product.price.toString(),
    description: product.description || "",
    // Keep existing imageUrl for display, but not for submission
    existingImageUrl: product.imageUrl || "",
    imagePreview: "", // data URL for preview only
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // store the actual file
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    
    // Append text fields
    if (form.name) formData.append("name", form.name);
    if (form.price) formData.append("price", parseFloat(form.price).toString());
    if (form.description) formData.append("description", form.description);
    
    // Append the actual file if a new one was selected
    if (selectedFile) {
      formData.append("image", selectedFile); // ✅ key must match backend: 'image'
    }

    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      body: formData, // ✅ Do NOT set Content-Type header
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      const errorData = await res.json().catch(() => ({}));
      alert(errorData.message || "Update failed");
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file); // store the actual file
      // Generate preview for UI only
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          imagePreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setForm((prev) => ({ ...prev, imagePreview: "" }));
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-3 py-2 border rounded"
          rows={3}
        />
        
        {/* Show current image preview */}
        {form.existingImageUrl && !form.imagePreview && (
          <div>
            <p className="text-sm text-gray-600">Current image:</p>
            <img src={form.existingImageUrl} alt="Current" className="h-20 w-20 object-cover" />
          </div>
        )}
        {form.imagePreview && (
          <div>
            <p className="text-sm text-gray-600">New image preview:</p>
            <img src={form.imagePreview} alt="Preview" className="h-20 w-20 object-cover" />
          </div>
        )}
        
        <input
          type="file"
          onChange={handleFileChange}
          className="col-span-2 px-3 py-2 border rounded" 
          accept="image/*"
        />
        
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
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

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { id } = context.params as { id: string };

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
};