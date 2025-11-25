import { Router } from "express";
import ProductManager from "../productManager.js";
import path from "path";
import { fileURLToPath } from "url";
import Product from "../models/product.model.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();


router.get("/", async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const data = await Product.paginate({}, { limit, page, lean: true });
    const products = data.docs;
    delete data.docs;

    const links = []
    for (let i = 1; i <= data.totalPages; i++) {
      links.push({ text: i, link: `?limit=${limit}&page=${i}` })
    }

    res.render("home", { products, links });
  } catch (error) {
    res.status(500).send("Error al traer los productos");
  }
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await Product.find().lean();
  res.render("realTimeProducts", { products });
});

router.get("/", (req, res) => {
  res.redirect("/home");
});

export default router;
