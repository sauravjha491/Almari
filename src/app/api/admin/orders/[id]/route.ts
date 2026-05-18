import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
    if (decoded.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: { user: true },
    });

    // Create notification for user if order is linked to a user
    if (updatedOrder.userId) {
      let message = "";
      switch (status) {
        case "PENDING":
          message = `Your order #${updatedOrder.id.slice(-6).toUpperCase()} is now pending.`;
          break;
        case "SHIPPED":
          message = `Great news! Your order #${updatedOrder.id.slice(-6).toUpperCase()} has been shipped.`;
          break;
        case "DELIVERED":
          message = `Your order #${updatedOrder.id.slice(-6).toUpperCase()} has been delivered. Enjoy your purchase!`;
          break;
        case "PAID":
          message = `Payment for order #${updatedOrder.id.slice(-6).toUpperCase()} was successful.`;
          break;
        case "CANCELED":
          message = `Your order #${updatedOrder.id.slice(-6).toUpperCase()} has been canceled.`;
          break;
      }

      if (message) {
        await prisma.notification.create({
          data: {
            userId: updatedOrder.userId,
            orderId: updatedOrder.id,
            message,
          },
        });
      }
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
    if (decoded.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;

    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
