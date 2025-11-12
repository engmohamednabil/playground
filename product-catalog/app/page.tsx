import ProductCatalog from '@/components/ProductCatalog';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Product Catalog</h1>
        <p className="text-muted-foreground mt-2">
          Manage your products with a clean, elegant interface
        </p>
      </div>
      <section className="rounded-xl border bg-card shadow-sm">
        <ProductCatalog />
      </section>
    </main>
  );
}