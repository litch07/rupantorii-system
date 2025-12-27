import AdminNav from "../../components/layout/AdminNav";
import AdminGuard from "../../components/layout/AdminGuard";

export const metadata = {
  title: "Rupantorii Admin",
  description: "Admin dashboard for Rupantorii"
};

export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <section className="section-pad space-y-6 py-10">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-pine">Admin</p>
          <AdminNav />
        </div>
        {children}
      </section>
    </AdminGuard>
  );
}
