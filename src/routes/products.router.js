import { Router } from "express";
import ProductManager from "../productManager.js";
import { io } from "../app.js";
import Product from "../models/product.model.js";

const router = Router();

const manager = new ProductManager("products.json");




router.get("/", async (req, res) => {

  try {
    const { limit = 10, page = 1 } = req.query;
    const data = await Product.paginate({}, { limit, page});
    const products = data.docs;
    delete data.docs;
    res.status(200).json({ status: "success", payload: products, ...data });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al traer los productos" })
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    io.emit("productAdded", newProduct);
    res.status(201).json({ message: "Producto agregado correctamente", payload: newProduct });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al agregar el producto" })
  }
});


router.put("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const updates = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(pid, updates, { new: true, runValidators: true });
    if (!updatedProduct) return res.status(404).json({ status: "error", message: "producto no encontrado" })
    res.status(200).json({ status: "success", payload: updatedProduct });

  } catch (error) {
    res.status(500).json({ status: "error", message: "error al actualizar los productos" })
  }

})


router.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;

    const deletedProduct = await Product.findByIdAndDelete(pid);
    if (!deletedProduct) return res.status(404).json({ status: "error", message: "producto no encontrado" })
    res.status(200).json({ status: "success", payload: deletedProduct });

  } catch (error) {
    res.status(500).json({ status: "error", message: "error al borrar el producto" })
  }

})




export default router;
