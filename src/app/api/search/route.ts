import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const categorySlug = searchParams.get("category");

  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    const products = await prisma.product.findMany({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: query } },
              { description: { contains: query } },
            ],
          },
          categorySlug ? { category: { slug: categorySlug } } : {},
        ],
      },
      include: {
        category: true,
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products, categories });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
