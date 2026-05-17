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
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="flex flex-col gap-12 py-4">
      {/* Hero Section */}
      <section className="w-full bg-blue-600 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="container px-8 py-12 md:px-16 md:py-20 flex flex-col items-start text-left text-white z-10 relative">
          <span className="bg-blue-500/30 px-4 py-1 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
            Big Summer Sale - Up to 50% Off
          </span>
          <h1 className="text-4xl md:text-7xl font-extrabold mb-4 leading-tight">
            Elevate Your <br /> Shopping Experience
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-xl text-blue-100">
            Almari brings you the finest selection of global brands and local favorites, all in one place.
          </p>
          <div className="flex gap-4">
            <Link
              href="/search"
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              Shop Now
            </Link>
            <Link
              href="/search?category=women-fashion"
              className="px-8 py-4 bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-400 transition-all border border-blue-400/50 active:scale-95"
            >
              Explore Trends
            </Link>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
      </section>

      {/* Categories Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Explore Categories</h2>
            <p className="text-slate-500 mt-1">Find exactly what you're looking for</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/search?category=${category.slug}`}
              className="group flex flex-col items-center p-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 active:scale-95"
            >
              <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300 grayscale group-hover:grayscale-0">
                {category.icon || "📦"}
              </div>
              <span className="text-xs font-bold text-slate-700 text-center group-hover:text-blue-600 transition-colors">
                {category.name.split(' & ')[0]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Featured Products</h2>
            <p className="text-slate-500 mt-1">Handpicked quality products for you</p>
          </div>
          <Link
            href="/search"
            className="group flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all"
          >
            View All
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
