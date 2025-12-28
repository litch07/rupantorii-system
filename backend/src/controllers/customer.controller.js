import {
  createAddress,
  deleteAddress,
  getCustomerProfile,
  listAddresses,
  loginCustomer,
  registerCustomer,
  updateAddress,
  updateCustomerAvatar,
  updateCustomerPassword,
  updateCustomerProfile
} from "../services/customer.service.js";
import { listOrdersForCustomer } from "../services/order.service.js";

export async function register(req, res, next) {
  try {
    const result = await registerCustomer(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await loginCustomer(email, password);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function getProfile(req, res, next) {
  try {
    const profile = await getCustomerProfile(req.user.sub);
    return res.json(profile);
  } catch (error) {
    return next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const profile = await updateCustomerProfile(req.user.sub, req.body);
    return res.json(profile);
  } catch (error) {
    return next(error);
  }
}

export async function updateAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Avatar image is required." });
    }
    const avatarUrl = `/uploads/${req.file.filename}`;
    const profile = await updateCustomerAvatar(req.user.sub, avatarUrl);
    return res.json(profile);
  } catch (error) {
    return next(error);
  }
}

export async function updatePassword(req, res, next) {
  try {
    const result = await updateCustomerPassword(
      req.user.sub,
      req.body.currentPassword,
      req.body.newPassword
    );
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function listAddressHandler(req, res, next) {
  try {
    const addresses = await listAddresses(req.user.sub);
    return res.json({ data: addresses });
  } catch (error) {
    return next(error);
  }
}

export async function createAddressHandler(req, res, next) {
  try {
    const address = await createAddress(req.user.sub, req.body);
    return res.status(201).json(address);
  } catch (error) {
    return next(error);
  }
}

export async function updateAddressHandler(req, res, next) {
  try {
    const address = await updateAddress(req.user.sub, req.params.id, req.body);
    return res.json(address);
  } catch (error) {
    return next(error);
  }
}

export async function deleteAddressHandler(req, res, next) {
  try {
    const result = await deleteAddress(req.user.sub, req.params.id);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function listCustomerOrdersHandler(req, res, next) {
  try {
    const orders = await listOrdersForCustomer(req.user.sub);
    return res.json({ data: orders });
  } catch (error) {
    return next(error);
  }
}
