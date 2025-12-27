import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Admin Dashboard | Rupantorii",
  description: "Overview and low stock alerts for Rupantorii."
};

export default function AdminDashboardPage() {
  return <DashboardClient />;
}
