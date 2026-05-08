// pages/api/checkout.js
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {

  const { email, password, customer, items, totalAmount } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (!customer?.name || !customer?.phone || !customer?.address) {
    return res.status(400).json({ message: 'Missing customer details' });
  }
  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No items in order' });
  }

  try {
    
    // --- 1. Authenticate or create user ---
    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // Existing user: verify password
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      // New user: hash password and create
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
    }

    // Convert items safely
    const convertedItems = [];
    for (const item of items) {
      const productId = String(item.productId);
      const price = Number(item.price);
      const quantity = Number(item.quantity);

      // Validate each required numeric field
      if (isNaN(price)) {
        return res.status(400).json({
          message: `Invalid price for item "${item.name}" – must be a valid number.`,
        });
      }
      if (isNaN(quantity)) {
        return res.status(400).json({
          message: `Invalid quantity for item "${item.name}" – must be a valid number.`,
        });
      }

      // --- 2. Prepare order items ---
      convertedItems.push({
        productId,          // now a valid string
        productName: String(item.name),
        price,
        quantity,
        imageUrl: item.imageUrl || null,
      });
    }

    const total = Number(totalAmount);
    if (isNaN(total)) {
      return res.status(400).json({ message: "Invalid total amount." });
    }

    // --- 3. Create order linked to user ---
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        deliveryAddress: customer.address,
        totalAmount: total,
        status: "pending",
        items: { create: convertedItems },
      },
      include: { items: true },
    });

     // --- 4. Create session cookie ---
    const session = await getSession(req, res);
    session.userId = user.id;
    await session.save();

    res.status(201).json({ orderId: order.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}