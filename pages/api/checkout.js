// pages/api/checkout.js
export default async function handler(req, res) {
  try {
    const { customer, items, totalAmount } = req.body;

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

    // Create order
    const order = await prisma.order.create({
      data: {
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

    res.status(201).json({ orderId: order.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}