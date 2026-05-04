import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { upload } from "@/lib/multer"; // ✅ This import will now work
import { authOptions } from "../../auth/[...nextauth]";

// --- Disable Next.js default body parser ---
export const config = {
  api: {
    bodyParser: false,
  },
};

// --- Helper to run multer middleware ---
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { id } = req.query;
  if (typeof id !== "string")
    return res.status(400).json({ message: "Invalid ID" });

  if (req.method === "GET") {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ message: "Not found" });
    return res.status(200).json(product);
  }

  if (req.method === "PUT") {
    // Process multer – it will handle the case where no file is sent
    await runMiddleware(req, res, upload.single("image"));

    // Access fields
    const { name, price, description } = req.body;
    const imageFile = (req as any).file; // may be undefined

    // Validation: name and price are still required, image is optional
    if (!name || price === undefined) {
      return res.status(400).json({ message: "Name and price are required." });
    }

    try {
      // First, get the current product to check existing image
      const existingProduct = await prisma.product.findUnique({
        where: { id },
      });
      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Prepare update data dynamically
      const updateData: any = {
        name,
        price: parseFloat(price),
        description: description || null,
      };

      // Only update image if a new file was uploaded
      if (imageFile) {
        updateData.imageUrl = `/uploads/${imageFile.filename}`;
      }

      const updatedProduct = await prisma.product.update({
        where: { id },
        data: updateData,
      });

      return res.status(200).json(updatedProduct);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Update failed" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.product.delete({ where: { id } });
      return res.status(204).end();
    } catch {
      return res.status(404).json({ message: "Not found" });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
