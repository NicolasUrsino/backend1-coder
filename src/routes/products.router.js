import { Router } from "express";
import ProductManager from "../productManager.js";
import { io } from "../app.js";

const router = Router();

const manager = new ProductManager("products.json");

router.get("/", async (req, res) => {
  const products = await manager.getProducts();
  res.json(products);
});

router.post("/", async (req, res) => {
  try {
    const newProduct = await manager.addProduct(req.body);
    io.emit("productAdded", newProduct);
    res.status(201).json({ message: "Producto agregado correctamente", product: newProduct });
  } catch (error) {
    console.error("Error al añadir el nuevo producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
