import AddressesClient from "./AddressesClient";

export const metadata = {
  title: "Addresses | Rupantorii",
  description: "Manage your saved delivery addresses."
};

export default function AddressesPage() {
  return <AddressesClient />;
}
