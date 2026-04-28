// pages/api/admin/products/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { upload } from '@/lib/multer'; // ✅ This import will now work
import path from 'path';
import fs from 'fs';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Authentication & Authorization
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // 2. GET Products
  if (req.method === 'GET') {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(products);
  }

  // 3. POST Product with Image
  if (req.method === 'POST') {
    try {
      // Use the 'upload' middleware to process a single field named 'image'
      await runMiddleware(req, res, upload.single('image'));

      // --- Access form fields (populated by multer) ---
      const { name, price, description } = req.body;
      const imageFile = (req as any).file; // The uploaded file object

      // --- Validation ---
      if (!name || price === undefined) {
        return res.status(400).json({ message: 'Name and price are required.' });
      }
      if (!imageFile) {
        return res.status(400).json({ message: 'Image file is required.' });
      }

      // --- Construct the public URL for the saved image ---
      const imageUrl = `/uploads/${imageFile.filename}`;

      // --- Save product in database ---
      const product = await prisma.product.create({
        data: {
          name,
          price: parseFloat(price),
          description: description || '',
          imageUrl,
        },
      });

      return res.status(201).json(product);
    } catch (error: any) {
      console.error('Upload error:', error);
      return res.status(400).json({ message: error.message || 'Upload failed' });
    }
  }

  // 4. Handle other HTTP methods
  return res.status(405).json({ message: 'Method not allowed' });
}