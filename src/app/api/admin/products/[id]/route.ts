import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { title, description, price, categoryId, stock, imageUrl } = body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        title,
        description,
        price: Number(price),
        stock: Number(stock),
        categoryId,
        images: imageUrl ? {
          deleteMany: {},
          create: [{
            url: imageUrl,
            alt: title,
            position: 0,
          }],
        } : undefined,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
