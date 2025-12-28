import { loginAdmin, updateAdminPassword } from "../services/auth.service.js";

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await loginAdmin(email, password);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function changeAdminPassword(req, res, next) {
  try {
    const userId = req.user?.sub;
    const { currentPassword, newPassword } = req.body;
    await updateAdminPassword(userId, currentPassword, newPassword);
    return res.json({ success: true, message: "Password updated." });
  } catch (error) {
    return next(error);
  }
}
