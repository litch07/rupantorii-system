"use client";

import { useState } from "react";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import api from "../../../lib/api";
import { getErrorMessage } from "../../../lib/helpers";

export default function SettingsClient() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setMessage("");
      setErrorMessage("");
      await api.put("/api/admin/auth/password", form);
      setMessage("Password updated.");
      setForm({ currentPassword: "", newPassword: "" });
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to update password."));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl text-ink">Admin Settings</h1>
      <div className="glass-card rounded-3xl p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-pine">Change Password</p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Input
            label="Current Password"
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
          />
          <Input
            label="New Password"
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
          />
          <p className="text-xs text-pine">Use at least 8 characters and avoid reused passwords.</p>
          {message ? <p className="text-xs uppercase tracking-[0.3em] text-pine">{message}</p> : null}
          {errorMessage ? <p className="text-sm text-rose">{errorMessage}</p> : null}
          <Button type="submit">Update Password</Button>
        </form>
      </div>
    </div>
  );
}
