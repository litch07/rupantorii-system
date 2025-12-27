import EditProductClient from "./EditProductClient";

export const metadata = {
  title: "Edit Product | Rupantorii",
  description: "Update Rupantorii product details, variants, and imagery."
};

export default function AdminEditProductPage({ params }) {
  return <EditProductClient productId={params.id} />;
}
