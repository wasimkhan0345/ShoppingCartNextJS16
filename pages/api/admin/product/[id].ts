import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { id } = req.query;
  if (typeof id !== "string") return res.status(400).json({ message: "Invalid ID" });

  if (req.method === "GET") {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ message: "Not found" });
    return res.status(200).json(product);
  }

  if (req.method === "PUT") {
    const { name, price, description, imageUrl } = req.body;
    try {
      const product = await prisma.product.update({
        where: { id },
        data: { name, price: price !== undefined ? parseFloat(price) : undefined, description, imageUrl },
      });
      return res.status(200).json(product);
    } catch {
      return res.status(404).json({ message: "Not found or update failed" });
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