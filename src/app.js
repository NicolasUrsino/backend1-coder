import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Rutas
app.use("/api/products", productsRouter);
app.use("/", viewsRouter);

// Server + Socket.io
const server = app.listen(PORT, () => {
  console.log(`✅ Server funcionando en http://localhost:${PORT}`);
});

const io = new Server(server);


io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado");

  socket.on("newProduct", (data) => {
    io.emit("productAdded", data);
  });
});

export { io };
