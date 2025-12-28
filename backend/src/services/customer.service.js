import bcrypt from "bcrypt";
import prisma from "../config/database.js";
import { signToken } from "../utils/jwt.js";

export async function registerCustomer(payload) {
  const { email, password, name, phone, addressLine, city, postalCode, label } = payload;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const error = new Error("Email is already registered");
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "customer",
        name: name || null,
        phone: phone || null
      }
    });

    await tx.address.create({
      data: {
        userId: created.id,
        label: label || "Primary",
        recipientName: name,
        phone,
        addressLine,
        city,
        postalCode: postalCode || null,
        isDefault: true
      }
    });

    return created;
  });

  const token = signToken({ sub: user.id, role: user.role, email: user.email });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone,
      avatarUrl: user.avatarUrl
    }
  };
}

export async function loginCustomer(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.role !== "customer") {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const token = signToken({ sub: user.id, role: user.role, email: user.email });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone,
      avatarUrl: user.avatarUrl
    }
  };
}

export async function getCustomerProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, name: true, phone: true, avatarUrl: true }
  });

  if (!user) {
    const error = new Error("Account not found");
    error.status = 404;
    throw error;
  }

  return user;
}

export async function updateCustomerProfile(userId, payload) {
  const data = {
    ...(payload.name !== undefined ? { name: payload.name || null } : {}),
    ...(payload.phone !== undefined ? { phone: payload.phone || null } : {})
  };

  return prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, email: true, role: true, name: true, phone: true, avatarUrl: true }
  });
}

export async function updateCustomerPassword(userId, currentPassword, newPassword) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const error = new Error("Account not found");
    error.status = 404;
    throw error;
  }

  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) {
    const error = new Error("Current password is incorrect.");
    error.status = 400;
    throw error;
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed }
  });

  return { success: true };
}

export async function updateCustomerAvatar(userId, avatarUrl) {
  return prisma.user.update({
    where: { id: userId },
    data: { avatarUrl },
    select: { id: true, email: true, role: true, name: true, phone: true, avatarUrl: true }
  });
}

export async function listAddresses(userId) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
  });
}

export async function createAddress(userId, payload) {
  const { label, recipientName, phone, addressLine, city, postalCode, notes, isDefault } = payload;

  return prisma.$transaction(async (tx) => {
    if (isDefault) {
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    return tx.address.create({
      data: {
        userId,
        label: label || null,
        recipientName,
        phone,
        addressLine,
        city,
        postalCode: postalCode || null,
        notes: notes || null,
        isDefault: !!isDefault
      }
    });
  });
}

export async function updateAddress(userId, addressId, payload) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.address.findFirst({ where: { id: addressId, userId } });
    if (!existing) {
      const error = new Error("Address not found");
      error.status = 404;
      throw error;
    }

    if (payload.isDefault) {
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    return tx.address.update({
      where: { id: addressId },
      data: {
        ...(payload.label !== undefined ? { label: payload.label || null } : {}),
        ...(payload.recipientName !== undefined ? { recipientName: payload.recipientName } : {}),
        ...(payload.phone !== undefined ? { phone: payload.phone } : {}),
        ...(payload.addressLine !== undefined ? { addressLine: payload.addressLine } : {}),
        ...(payload.city !== undefined ? { city: payload.city } : {}),
        ...(payload.postalCode !== undefined ? { postalCode: payload.postalCode || null } : {}),
        ...(payload.notes !== undefined ? { notes: payload.notes || null } : {}),
        ...(payload.isDefault !== undefined ? { isDefault: !!payload.isDefault } : {})
      }
    });
  });
}

export async function deleteAddress(userId, addressId) {
  const existing = await prisma.address.findFirst({ where: { id: addressId, userId } });
  if (!existing) {
    const error = new Error("Address not found");
    error.status = 404;
    throw error;
  }

  await prisma.address.delete({ where: { id: addressId } });
  return { success: true };
}
