import AccountGuard from "../../components/layout/AccountGuard";
import AccountShell from "../../components/layout/AccountShell";

export const metadata = {
  title: "Rupantorii Account",
  description: "Manage your Rupantorii profile, orders, and addresses."
};

export default function AccountLayout({ children }) {
  return (
    <AccountGuard>
      <AccountShell>{children}</AccountShell>
    </AccountGuard>
  );
}
