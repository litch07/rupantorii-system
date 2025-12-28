"use client";

import { useEffect, useState } from "react";
import customerApi from "../../../lib/customerApi";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import { getErrorMessage } from "../../../lib/helpers";

const emptyForm = {
  label: "",
  recipientName: "",
  phone: "",
  addressLine: "",
  city: "",
  postalCode: "",
  notes: "",
  isDefault: false
};

export default function AddressesClient() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");

  const loadAddresses = async () => {
    const response = await customerApi.get("/api/account/addresses");
    setAddresses(response.data.data || []);
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setErrorMessage("");
      setMessage("");
      if (editingId) {
        await customerApi.put(`/api/account/addresses/${editingId}`, form);
        setMessage("Address updated.");
      } else {
        await customerApi.post("/api/account/addresses", form);
        setMessage("Address added.");
      }
      setForm({ ...emptyForm });
      setEditingId(null);
      loadAddresses();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to save address."));
    }
  };

  const handleEdit = (address) => {
    setEditingId(address.id);
    setForm({
      label: address.label || "",
      recipientName: address.recipientName || "",
      phone: address.phone || "",
      addressLine: address.addressLine || "",
      city: address.city || "",
      postalCode: address.postalCode || "",
      notes: address.notes || "",
      isDefault: !!address.isDefault
    });
    setMessage("");
    setErrorMessage("");
  };

  const handleDelete = async (id) => {
    try {
      setErrorMessage("");
      setMessage("");
      await customerApi.delete(`/api/account/addresses/${id}`);
      loadAddresses();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to delete address."));
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl text-ink">Saved Addresses</h1>

      <div className="grid gap-6 lg:grid-cols-[0.45fr_0.55fr]">
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-pine">
            {editingId ? "Edit Address" : "Add New Address"}
          </p>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <Input label="Label" name="label" value={form.label} onChange={handleChange} />
            <Input label="Recipient Name" name="recipientName" value={form.recipientName} onChange={handleChange} />
            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            <Input label="Address Line" name="addressLine" value={form.addressLine} onChange={handleChange} />
            <Input label="City" name="city" value={form.city} onChange={handleChange} />
            <Input label="Postal Code" name="postalCode" value={form.postalCode} onChange={handleChange} />
            <label className="flex flex-col gap-2 text-sm text-pine">
              <span className="uppercase tracking-[0.2em]">Notes</span>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="min-h-[90px] rounded-2xl border border-mist bg-white/80 px-4 py-3 text-ink outline-none focus:border-rose"
              />
            </label>
            <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-pine">
              <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} />
              Set as default
            </label>
            {message ? <p className="text-xs uppercase tracking-[0.3em] text-pine">{message}</p> : null}
            {errorMessage ? <p className="text-sm text-rose">{errorMessage}</p> : null}
            <div className="flex flex-wrap gap-3">
              <Button type="submit">{editingId ? "Update Address" : "Save Address"}</Button>
              {editingId ? (
                <button type="button" className="btn-outline" onClick={handleCancelEdit}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="space-y-4">
          {addresses.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-mist bg-white/70 p-6 text-sm text-pine">
              No saved addresses yet.
            </div>
          ) : (
            addresses.map((address) => (
              <div key={address.id} className="glass-card rounded-3xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 text-sm text-pine">
                    <p className="text-xs uppercase tracking-[0.3em] text-ink">
                      {address.label || "Address"}
                      {address.isDefault ? " (Default)" : ""}
                    </p>
                    <p>{address.recipientName}</p>
                    <p>{address.phone}</p>
                    <p>{address.addressLine}</p>
                    <p>{address.city}</p>
                    {address.postalCode ? <p>{address.postalCode}</p> : null}
                    {address.notes ? <p>Notes: {address.notes}</p> : null}
                  </div>
                  <div className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-pine">
                    <button className="hover:text-rose" onClick={() => handleEdit(address)}>
                      Edit
                    </button>
                    <button className="hover:text-rose" onClick={() => handleDelete(address.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
