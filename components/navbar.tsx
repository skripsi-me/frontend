"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MenuIcon,
  SearchIcon,
  ShoppingCartIcon,
  LogOutIcon,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useCart } from "@/hooks/cart.hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/produk", label: "Produk" },
];

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { data: cart } = useCart();
  const [query, setQuery] = useState("");

  const cartCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/produk?search=${encodeURIComponent(q)}` : "/produk");
  }

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  const navLinkClass = (href: string) =>
    cn(
      "text-label-sm transition-colors hover:text-primary",
      isActive(href) ? "text-primary" : "text-on-surface-muted"
    );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 md:gap-6 md:px-6">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon-sm" className="md:hidden" />
            }
            aria-label="Buka menu"
          >
            <MenuIcon />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Navigasi As-Sakinah Mart</SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {NAV_LINKS.map((link) => (
                <SheetClose
                  key={link.href}
                  render={
                    <Link
                      href={link.href}
                      className={cn(
                        "rounded-md px-2 py-2 text-body-md hover:bg-muted",
                        isActive(link.href) ? "text-primary" : "text-foreground"
                      )}
                    />
                  }
                >
                  {link.label}
                </SheetClose>
              ))}
              <form onSubmit={handleSearch} className="mt-2 flex gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari produk..."
                  aria-label="Cari produk"
                />
                <Button type="submit" size="icon-sm" aria-label="Cari">
                  <SearchIcon />
                </Button>
              </form>
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/image/logo.png"
            alt="As-Sakinah Mart"
            width={36}
            height={36}
            className="size-9 rounded-full object-contain"
            priority
          />
          <span className="text-label-lg text-foreground">
            As-Sakinah <span className="text-primary">Mart</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass(link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>

        <form
          onSubmit={handleSearch}
          className="hidden flex-1 justify-center md:flex"
        >
          <div className="relative w-full max-w-sm">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari produk..."
              aria-label="Cari produk"
              className="pl-8"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1.5 md:ml-0">
          <Button
            variant="ghost"
            size="icon-sm"
            render={<Link href="/keranjang-saya" />}
            aria-label="Keranjang belanja"
            className="relative"
          >
            <ShoppingCartIcon />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Button>

          {isLoading ? (
            <Skeleton className="size-8 rounded-full" />
          ) : isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon-sm" className="rounded-full" />
                }
                aria-label="Menu pengguna"
              >
                <Avatar size="sm">
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="text-body-sm text-foreground">{user.name}</p>
                  <p className="text-caption text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/profil" />}>
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/profil/riwayat-transaksi" />}>
                  Riwayat Transaksi
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/auth/ubah-password" />}>
                  Ubah Password
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem render={<Link href="/dashboard" />}>
                    Dashboard Admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => logout()}>
                  <LogOutIcon />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/auth/login" />}
            >
              Masuk
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
