import { Router } from "express";
import userModel from "../models/user.model.js";
import cartModel from "../models/cart.model.js";
import { createHash } from "../utils/crypto.js";

const router = Router();

// GET all
router.get("/", async (req, res) => {
  try {
    const users = await userModel.find().select("-password").lean();
    res.send({ status: "success", payload: users });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
});

// GET by id
router.get("/:uid", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.uid).select("-password").lean();
    if (!user) return res.status(404).send({ status: "error", message: "User not found" });
    res.send({ status: "success", payload: user });
  } catch (err) {
    res.status(400).send({ status: "error", message: err.message });
  }
});

// CREATE (hashSync)
router.post("/", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists) return res.status(400).send({ status: "error", message: "Email already exists" });

    const newCart = await cartModel.create({ products: [] });

    const user = await userModel.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      cart: newCart._id,
      role: role ?? "user"
    });

    const safe = user.toObject();
    delete safe.password;

    res.status(201).send({ status: "success", payload: safe });
  } catch (err) {
    res.status(400).send({ status: "error", message: err.message });
  }
});

// UPDATE
router.put("/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const data = { ...req.body };

    if (data.password) data.password = createHash(data.password);

    const updated = await userModel.updateOne({ _id: uid }, data);
    res.send({ status: "success", payload: updated });
  } catch (err) {
    res.status(400).send({ status: "error", message: err.message });
  }
});

// DELETE
router.delete("/:uid", async (req, res) => {
  try {
    const result = await userModel.deleteOne({ _id: req.params.uid });
    res.send({ status: "success", payload: result });
  } catch (err) {
    res.status(400).send({ status: "error", message: err.message });
  }
});

export default router;
