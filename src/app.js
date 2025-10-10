import express from "express"
import ProductManager from "./productManager.js";
import CartManager from "./cartManager.js";



const app = express();

app.use(express.json()); //habilitacion para recibir JSON


//products endpoints:


const productManager = new ProductManager("./src/products.json");



app.get("/", (req, res) => {
    res.json({ status: "success", message: "Sv Funcionando" })

});



app.get("/api/products/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const products = await productManager.getProductById(pid);
        res.status(200).json({ message: "Producto buscado:", products });

    } catch (error) {
        res.status(500).json({ message: error.message })
    }



});

app.get("/api/products", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.status(200).json({ message: "Lista de productos", products });

    } catch (error) {
        res.status(500).json({ message: error.message })
    }



});

app.delete("/api/products/:pid", async (req, res) => {
    try {

        const pid = req.params.pid;
        const products = await productManager.deleteProductById(pid);
        res.status(200).json({ message: "producto eliminado", products })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

});


app.post("/api/products", async (req, res) => {
    try {

        const newProduct = req.body;

        const products = await productManager.addProduct(newProduct)

        res.status(201).json({ message: "Producto agregado", products })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }


})



app.put("/api/products/:pid", async(req, res)=>{
try {


      const pid = req.params.pid;
       const updates = req.body;

        const products = await productManager.setProductById(pid, updates);
        res.status(200).json({ message: "producto actualizado", products });

} catch (error) {
     res.status(500).json({ message: error.message })
}

})






//Carts endpoints:
const cartManager = new CartManager("./src/carts.json")


app.post("/api/carts", async(req, res)=>{
try {

    const newCart = req.body;

    const carts = await cartManager.addCart(newCart)

res.status(200).json({ message: "Lista de carts:", carts });

} catch (error) {
    res.status(500).json({ message: error.message })
}



    })





    app.get("/api/carts/:cid", async(req, res)=>{

try {
     const cid = req.params.cid;
        const carts = await cartManager.getCartById(cid)
        res.status(200).json({ message: "Cart buscado:", carts });




} catch (error) {
    res.status(500).json({ message: error.message })
}


    })




app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const updatedCart = await cartManager.addProductByCart(cid, pid);

    res.status(200).json({message: "Producto agregado correctamente al carrito", cart: updatedCart});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


















app.listen(8080, () => {
    console.log("sv iniciado en puerto 8080")
});















