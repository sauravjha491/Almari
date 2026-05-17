import { ProductCard } from "@/components/product-card";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q, category, sort } = await searchParams;

  const where: Prisma.ProductWhereInput = {
    AND: [
      q
        ? {
            OR: [
              { title: { contains: q as string } },
              { description: { contains: q as string } },
            ],
          }
        : {},
      category ? { category: { slug: { equals: category as string } } } : {},
    ],
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price_asc"
      ? { price: "asc" }
      : sort === "price_desc"
      ? { price: "desc" }
      : { createdAt: "desc" };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: true,
      images: true,
    },
  });

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {q ? `Search results for "${q}"` : category ? `${category}` : "All Products"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {products.length} products found
          </p>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <p className="text-xl text-gray-500 dark:text-gray-400">
            No products found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
