import { NextApiRequest, NextApiResponse } from "next";
//import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth"; // ✅ correct import

import { authOptions } from "@/pages/api/auth/[...nextauth]"; // your NextAuth config

import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method === "GET") {
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    return res.status(200).json(products);
  }

  if (req.method === "POST") {
    const { name, price, description, imageUrl } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ message: "Name and price required" });
    }
    const product = await prisma.product.create({
      data: { name, price: parseFloat(price), description, imageUrl },
    });
    return res.status(201).json(product);
  }

  res.status(405).json({ message: "Method not allowed" });
}