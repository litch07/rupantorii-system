import bcrypt from "bcrypt";
import prisma from "../config/database.js";
import { signToken } from "../utils/jwt.js";

export async function loginAdmin(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.role !== "admin") {
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
      role: user.role
    }
  };
}

export async function updateAdminPassword(userId, currentPassword, newPassword) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || user.role !== "admin") {
    const error = new Error("Admin account not found");
    error.status = 403;
    throw error;
  }

  const match = await bcrypt.compare(currentPassword, user.password);

  if (!match) {
    const error = new Error("Current password is incorrect");
    error.status = 401;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });

  return { success: true };
}
