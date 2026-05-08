import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function clearOrders() {
  // OrderItem must be deleted first if it references Order
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
}
clearOrders()