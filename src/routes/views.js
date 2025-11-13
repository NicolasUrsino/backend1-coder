import { Router } from "express";
import ProductManager from "../productManager.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const manager = new ProductManager("products.json");

router.get("/home", async (req, res) => {
  const products = await manager.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await manager.getProducts();
  res.render("realTimeProducts", { products });
});
router.get("/", (req, res) => {
  res.redirect("/home");
});

export default router;
