import { AddToCartButton } from "@/components/add-to-cart-button";
import { formatMoney } from "@/lib/money";
import { prisma } from "@/lib/db";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: true,
    },
  });

  if (!product) {
    notFound();
  }

  const firstImage = product.images[0];

  return (
    <div className="py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden dark:bg-zinc-800">
          {firstImage && (
            <Image
              src={firstImage.url}
              alt={firstImage.alt ?? product.title}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
              {formatMoney(product.price)}
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-2">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">Category:</span>
                <span className="capitalize px-3 py-1 bg-gray-100 dark:bg-zinc-800 rounded-full text-sm">
                  {product.category.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Stock:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    product.stock > 0
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <AddToCartButton
                item={{
                  productId: product.id,
                  slug: product.slug,
                  title: product.title,
                  price: product.price,
                  imageUrl: firstImage?.url,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
