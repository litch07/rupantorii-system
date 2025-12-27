import ProductsClient from "./ProductsClient";

export const metadata = {
  title: "Admin Products | Rupantorii",
  description: "Manage Rupantorii products, variants, and inventory status."
};

export default function AdminProductsPage() {
  return <ProductsClient />;
}
