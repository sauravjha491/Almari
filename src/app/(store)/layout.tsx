import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BottomNavbar } from "@/components/bottom-navbar";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen pb-16 sm:pb-0">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <SiteFooter />
      <BottomNavbar />
    </div>
  );
}
