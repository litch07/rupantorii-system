import { loginAdmin } from "../services/auth.service.js";

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await loginAdmin(email, password);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}
