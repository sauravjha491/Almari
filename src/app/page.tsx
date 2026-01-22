import { ProductCard } from "@/components/product-card";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    take: 8,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
      images: true,
    },
  });

  const categories = await prisma.category.findMany({
    take: 4,
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="flex flex-col gap-8 py-8">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl overflow-hidden shadow-lg">
        <div className="container px-6 py-16 md:px-12 md:py-24 flex flex-col items-center text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Almari
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl">
            Discover the best deals on electronics, fashion, and more. Your one-stop shop for everything you need.
          </p>
          <Link
            href="/search"
            className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-full hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/search?category=${category.slug}`}
              className="flex items-center justify-center h-32 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              <span className="text-lg font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link
            href="/search"
            className="text-indigo-600 hover:underline dark:text-indigo-400"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
