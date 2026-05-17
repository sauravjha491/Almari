import Link from "next/link";
import { prisma } from "@/lib/db";
import { CartLink } from "@/components/cart-link";
import { UserNav } from "@/components/user-nav";
import { cn } from "@/lib/cn";

export async function SiteHeader() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    take: 6,
    select: { id: true, name: true, slug: true },
  });

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-slate-50/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-2 py-1 font-semibold tracking-tight text-slate-900 hover:bg-slate-100"
        >
          <span
            className={cn(
              "grid h-8 w-8 place-items-center rounded-lg",
              "bg-[var(--almari-primary)] text-[var(--almari-primary-foreground)]",
            )}
          >
            A
          </span>
          <span className="hidden sm:block">Almari</span>
        </Link>

        <form action="/search" className="flex flex-1 items-center">
          <div className="relative w-full">
            <input
              name="q"
              placeholder="Search products, brands, and more…"
              className={cn(
                "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5",
                "text-sm outline-none ring-0 placeholder:text-slate-400",
                "focus:border-[var(--almari-primary)] focus:outline-none",
              )}
            />
            <button
              type="submit"
              className={cn(
                "absolute right-1 top-1/2 -translate-y-1/2 rounded-lg px-3 py-2 text-sm",
                "bg-[var(--almari-primary)] text-[var(--almari-primary-foreground)] hover:opacity-95",
              )}
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex items-center gap-4">
          <CartLink />
          <UserNav />
        </div>
      </div>

      <div className="border-t border-slate-200/70">
        <nav className="mx-auto w-full max-w-6xl overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/search?category=${encodeURIComponent(c.slug)}`}
                className={cn(
                  "whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700",
                  "hover:border-slate-300 hover:bg-slate-50",
                )}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
