import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/money";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { WishlistButton } from "@/components/wishlist-button";

export function ProductCard({
  product,
}: {
  product: {
    id: string;
    slug: string;
    title: string;
    price: number;
    compareAtPrice: number | null;
    category: { name: string };
    images: Array<{ url: string; alt: string | null }>;
  };
}) {
  const firstImage = product.images[0];

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          {firstImage ? (
            <Image
              src={firstImage.url}
              alt={firstImage.alt ?? product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          ) : null}
          <div className="absolute top-2 right-2">
            <WishlistButton productId={product.id} />
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-medium text-slate-500">
              {product.category.name}
            </div>
            <Link
              href={`/product/${product.slug}`}
              className="mt-1 line-clamp-2 block text-sm font-semibold text-slate-900 hover:underline"
            >
              {product.title}
            </Link>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-base font-bold text-slate-900">
              {formatMoney(product.price)}
            </div>
            {product.compareAtPrice ? (
              <div className="text-xs text-slate-500 line-through">
                {formatMoney(product.compareAtPrice)}
              </div>
            ) : null}
          </div>
          <AddToCartButton
            item={{
              productId: product.id,
              slug: product.slug,
              title: product.title,
              price: product.price,
              imageUrl: firstImage?.url,
            }}
            className="shrink-0"
          />
        </div>

        <div className={cn("mt-3 h-px w-full bg-slate-100")} />

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-2 py-1">
            Fast delivery
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-1">
            Easy returns
          </span>
        </div>
      </div>
    </div>
  );
}
