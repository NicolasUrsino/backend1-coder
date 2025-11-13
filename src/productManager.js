import fs from "fs/promises";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductManager {
  constructor(fileName) {
   
    this.pathFile = path.join(__dirname, fileName.replace(/^(\.\/|\/)/, ""));
  }

  generateNewId() {
    return crypto.randomUUID();
  }

  async productRecuperado() {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      return JSON.parse(fileData);
    } catch (error) {
    
      if (error.code === "ENOENT") {
        await fs.writeFile(this.pathFile, "[]", "utf-8"); 
        return [];
      }
      throw new Error("Error al recuperar el producto: " + error.message);
    }
  }

  async addProduct(newProduct) {
    try {
      const products = await this.productRecuperado();
      const newId = this.generateNewId();


      const product = {
        id: newId,
        title: newProduct.title || "Sin título",
        description: newProduct.description || "",
        price: Number(newProduct.price) || 0,
        thumbnail: newProduct.thumbnail || "",
        code: newProduct.code || "",
        stock: Number(newProduct.stock) || 0,
      };

      products.push(product);

      
      await fs.writeFile(this.pathFile, JSON.stringify(products, null, 2), "utf-8");

      return product; 
    } catch (error) {
      throw new Error("Error al añadir el nuevo producto: " + error.message);
    }
  }

  async getProducts() {
    try {
      const products = await this.productRecuperado();
      return products.length > 0 ? products : [];
    } catch (error) {
      throw new Error("Error al traer los productos: " + error.message);
    }
  }

  async getProductById(pid) {
    try {
      const products = await this.productRecuperado();
      return products.find((prod) => prod.id === pid);
    } catch (error) {
      throw new Error("Error al encontrar el producto: " + error.message);
    }
  }

  async setProductById(pid, updates) {
    try {
      const products = await this.productRecuperado();
      const index = products.findIndex((prod) => prod.id === pid);
      if (index === -1) throw new Error("Producto no encontrado por ID");
      if ("id" in updates) throw new Error("No se puede actualizar el ID");

      products[index] = { ...products[index], ...updates };
      await fs.writeFile(this.pathFile, JSON.stringify(products, null, 2), "utf-8");
      return products[index]; 
    } catch (error) {
      throw new Error("Error al actualizar el producto: " + error.message);
    }
  }

  async deleteProductById(pid) {
    try {
      const products = await this.productRecuperado();
      const filtered = products.filter((prod) => prod.id !== pid);
      await fs.writeFile(this.pathFile, JSON.stringify(filtered, null, 2), "utf-8");
      return filtered;
    } catch (error) {
      throw new Error("Error al borrar el producto: " + error.message);
    }
  }
}

export default ProductManager;
