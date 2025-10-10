import fs from "fs/promises"
import crypto from "crypto";




class CartManager {
    constructor(pathFile) {
        this.pathFile = pathFile;
    }

    generateNewId() {
        return crypto.randomUUID()
    }

    async cartRecuperado() {
        try {
            //recuperar el carrito
            const fileData = await fs.readFile(this.pathFile, "utf-8");

            return JSON.parse(fileData);

        } catch (error) {
            throw new Error("Error al recuperar el carrito: " + error);
        }
    }


    async addCart(products) {
        try {
            const carts = await this.cartRecuperado();

            const newId = this.generateNewId();

            const cart = { id: newId, ...products };
            carts.push(cart);



            await fs.writeFile(this.pathFile, JSON.stringify(carts, null, 2), "utf-8");

            return carts;
        }
        catch {
            throw new Error("Error al agregar el carts" + error);
        }
    }



    async getCartById(cid) {

        try {
            const carts = await this.cartRecuperado();

            const cartID = carts.filter((idCart) => idCart.id === cid);


            await fs.writeFile(this.pathFile, JSON.stringify(carts, null, 2), "utf-8");

            return cartID

        } catch (error) {
            throw new Error("Error al traer el cart por ID" + error);
        }
    }



    async addProductByCart(cid, pid) {
  try {
    const carts = await this.cartRecuperado();

    const cartIndex = carts.findIndex((cart) => cart.id === cid);
    if (cartIndex === -1) throw new Error("Carrito no encontrado");

    if (!Array.isArray(carts[cartIndex].products)) {
      carts[cartIndex].products = [];
    }
    const existingProduct = carts[cartIndex].products.find(
      (p) => p.product === pid
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      carts[cartIndex].products.push({ product: pid, quantity: 1 });
    }

  
    await fs.writeFile(this.pathFile, JSON.stringify(carts, null, 2), "utf-8");

    return carts[cartIndex];
  } catch (error) {
    throw new Error("Error al agregar el producto al carrito: " + error.message);
  }
}










}







export default CartManager;