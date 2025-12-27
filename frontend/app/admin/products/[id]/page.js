import { redirect } from "next/navigation";

export const metadata = {
  title: "Product | Rupantorii Admin",
  description: "Redirecting to product editor."
};

export default function AdminProductRedirect({ params }) {
  redirect(`/admin/products/${params.id}/edit`);
}
