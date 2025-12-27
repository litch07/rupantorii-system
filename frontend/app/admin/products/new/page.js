import NewProductClient from "./NewProductClient";

export const metadata = {
  title: "Add Product | Rupantorii",
  description: "Create a new Rupantorii product with variants and inventory."
};

export default function AdminNewProductPage() {
  return <NewProductClient />;
}
