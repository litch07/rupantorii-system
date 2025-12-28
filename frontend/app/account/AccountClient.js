"use client";

import { useEffect, useState } from "react";
import customerApi from "../../lib/customerApi";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useCustomerAuth } from "../../contexts/CustomerAuthContext";
import { getErrorMessage, getServerApiUrl } from "../../lib/helpers";

export default function AccountClient() {
  const { user, logout, refreshProfile } = useCustomerAuth();
  const [form, setForm] = useState({ name: "", phone: "" });
  const [avatar, setAvatar] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", phone: user.phone || "" });
    }
  }, [user]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      setErrorMessage("");
      setMessage("");
      await customerApi.put("/api/auth/profile", form);
      await refreshProfile();
      setMessage("Profile updated.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to update profile."));
    }
  };

  const handleAvatarUpload = async (event) => {
    event.preventDefault();
    if (!avatar) {
      return;
    }
    try {
      setErrorMessage("");
      setMessage("");
      const formData = new FormData();
      formData.append("avatar", avatar);
      await customerApi.post("/api/auth/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      await refreshProfile();
      setMessage("Avatar updated.");
      setAvatar(null);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to upload avatar."));
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    try {
      setPasswordMessage("");
      setPasswordError("");
      await customerApi.put("/api/auth/password", passwordForm);
      setPasswordMessage("Password updated.");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (error) {
      setPasswordError(getErrorMessage(error, "Unable to update password."));
    }
  };

  const avatarUrl = user?.avatarUrl
    ? `${getServerApiUrl()}${user.avatarUrl}`
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl text-ink">My Profile</h1>
        <button className="btn-outline" onClick={logout}>
          Sign Out
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.4fr_0.6fr]">
        <div className="glass-card rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-pine">Avatar</p>
          <div className="mt-4 flex flex-col items-center gap-4">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-mist bg-white text-xs text-pine">
              {avatarUrl ? (
                <img src={avatarUrl} alt={user?.name || "Customer avatar"} className="h-full w-full rounded-full object-cover" />
              ) : (
                "No photo"
              )}
            </div>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => setAvatar(event.target.files?.[0] || null)}
              className="text-xs text-pine"
            />
            <Button onClick={handleAvatarUpload} disabled={!avatar}>
              Upload Avatar
            </Button>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-pine">Account Details</p>
          <form onSubmit={handleSave} className="mt-4 space-y-4">
            <Input label="Email" value={user?.email || ""} readOnly />
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            {message ? <p className="text-xs uppercase tracking-[0.3em] text-pine">{message}</p> : null}
            {errorMessage ? <p className="text-sm text-rose">{errorMessage}</p> : null}
            <Button type="submit">Save Changes</Button>
          </form>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-pine">Change Password</p>
          <form onSubmit={handlePasswordChange} className="mt-4 space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(event) =>
                setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))
              }
            />
            <Input
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))
              }
            />
            {passwordMessage ? <p className="text-xs uppercase tracking-[0.3em] text-pine">{passwordMessage}</p> : null}
            {passwordError ? <p className="text-sm text-rose">{passwordError}</p> : null}
            <Button type="submit">Update Password</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
