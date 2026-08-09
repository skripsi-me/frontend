import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produk",
};

export default function ProdukPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-2 p-6">
      <h1 className="text-headline-md">Produk</h1>
      <p className="text-body-sm text-muted-foreground">
        Halaman ini sedang dalam pengembangan.
      </p>
    </main>
  );
}
