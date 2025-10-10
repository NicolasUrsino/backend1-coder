import fs from "fs/promises"
import crypto from "crypto";



class ProductManager {


    constructor(pathFile) {
        this.pathFile = pathFile;

    }

    generateNewId() {
        return crypto.randomUUID()
    }




    async productRecuperado() {
        try {
            //recuperar productos
            const fileData = await fs.readFile(this.pathFile, "utf-8");

            return JSON.parse(fileData);

        } catch (error) {
            throw new Error("Error al recuperar el producto: " + error);
        }
    }





    async addProduct(newProduct) {
        try {
            const products = await this.productRecuperado();

            //creamos el nuevo producto y lo pusheamos
            const newId = this.generateNewId();
            const product = { id: newId, ...newProduct };
            products.push(product);

            //guardamos los productos en json
            await fs.writeFile(this.pathFile, JSON.stringify(products, null, 2), "utf-8")

            return products;

        } catch (error) {
            throw new Error("Error al añadir el nuevo producto: " + error);
        }
    }





    async getProducts() {

        try {

            const products = await this.productRecuperado();

            if (products.length > 0) {

                return products;

            } else {
                console.log("No hay productos")
                return [];
            }

        } catch (error) {
            throw new Error("Error al traer los productos: " + error);
        }
    }


    async getProductById(pid) {
        try {
            const products = await this.productRecuperado();

            const productID = products.find((prod) => prod.id === pid)
            /* if (productID) throw new Error("producto no encontrado por ID"); */



            //guardamos los productos en json
            await fs.writeFile(this.pathFile, JSON.stringify(products, null, 2), "utf-8")


            return productID;

        } catch (error) {
            throw new Error("Error al encontrar el producto: " + error);
        }

    }


    async setProductById(pid, updates) {

        try {
            const products = await this.productRecuperado();

            const indexProduct = products.findIndex((prod) => prod.id === pid)
            if (indexProduct === -1) throw new Error("producto no encontrado por ID");
            if ("id" in updates) throw new Error("No se puede actualizar el ID");

            products[indexProduct] = { ...products[indexProduct], ...updates }

            //guardamos los productos en json
            await fs.writeFile(this.pathFile, JSON.stringify(products, null, 2), "utf-8")


            return products;

        } catch (error) {
            throw new Error("Error al actualizar el producto: " + error);
        }



    }




    async deleteProductById(pid) {

        try {

            const products = await this.productRecuperado();

            // verificamos si existe 
            const pidExist = products.find((prod) => prod.id === pid)

            if (pidExist) {

                const filteredProduct = products.filter((prod) => prod.id !== pid);
                console.log("Producto eliminado con éxito")
                //guardamos los productos en json
                await fs.writeFile(this.pathFile, JSON.stringify(filteredProduct, null, 2), "utf-8")

                return filteredProduct;
            }
            else { console.log("Producto no eliminado, no encontrado por ID") }

        } catch (error) {
            throw new Error("Error al borrar el producto: " + error);
        }
    }

}


export default ProductManager;