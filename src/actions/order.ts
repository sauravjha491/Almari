"use server";

import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function createOrder(data: {
  email: string;
  fullName: string;
  phone: string;
  address1: string;
  city: string;
  items: { productId: string; quantity: number }[];
}) {
  try {
    // 1. Fetch products to get current prices and titles
    const productIds = data.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { images: true },
    });

    const productsMap = new Map(products.map((p) => [p.id, p]));

    // 2. Calculate totals and prepare order items
    let subtotal = 0;
    const orderItemsData: Prisma.OrderItemCreateWithoutOrderInput[] = [];

    for (const item of data.items) {
      const product = productsMap.get(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for: ${product.title}`);
      }

      const unitPrice = product.price;
      subtotal += unitPrice * item.quantity;

      orderItemsData.push({
        product: { connect: { id: product.id } },
        title: product.title,
        unitPrice: unitPrice,
        quantity: item.quantity,
        imageUrl: product.images[0]?.url,
      });
    }

    const shipping = 0; // Free shipping for now
    const total = subtotal + shipping;

    // 3. Create order transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          email: data.email,
          fullName: data.fullName,
          phone: data.phone,
          address1: data.address1,
          city: data.city,
          subtotal,
          shipping,
          total,
          status: "PENDING",
          items: {
            create: orderItemsData,
          },
        },
      });

      // Update stock
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Failed to create order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create order",
    };
  }
}
