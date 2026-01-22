import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="text-base font-semibold tracking-tight text-slate-900">
              Almari
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              A clean, fast storefront built with Next.js and Prisma.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div className="space-y-2">
              <div className="font-semibold text-slate-900">Shop</div>
              <div className="flex flex-col gap-2">
                <Link className="text-slate-600 hover:text-slate-900" href="/">
                  Home
                </Link>
                <Link
                  className="text-slate-600 hover:text-slate-900"
                  href="/search"
                >
                  Search
                </Link>
                <Link
                  className="text-slate-600 hover:text-slate-900"
                  href="/cart"
                >
                  Cart
                </Link>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-slate-900">Support</div>
              <div className="flex flex-col gap-2">
                <a
                  className="text-slate-600 hover:text-slate-900"
                  href="mailto:support@almari.local"
                >
                  Contact
                </a>
                <a className="text-slate-600 hover:text-slate-900" href="#">
                  Shipping
                </a>
                <a className="text-slate-600 hover:text-slate-900" href="#">
                  Returns
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-slate-900">Legal</div>
              <div className="flex flex-col gap-2">
                <a className="text-slate-600 hover:text-slate-900" href="#">
                  Privacy
                </a>
                <a className="text-slate-600 hover:text-slate-900" href="#">
                  Terms
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} Almari. All rights reserved.</div>
          <div>Made for Nepal-style marketplace browsing.</div>
        </div>
      </div>
    </footer>
  );
}
