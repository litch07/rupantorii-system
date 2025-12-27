import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin | Rupantorii",
  description: "Redirecting to the Rupantorii admin dashboard."
};

export default function AdminIndexPage() {
  redirect("/admin/dashboard");
}
