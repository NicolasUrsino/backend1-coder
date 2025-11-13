const socket = io();

const form = document.getElementById("productForm");
const productList = document.getElementById("productList");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const product = Object.fromEntries(formData);

  try {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Producto agregado correctamente:", data);
      form.reset();
    } else {
      console.error("Error al agregar producto");
    }
  } catch (error) {
    console.error("Error al enviar producto:", error);
  }
});

socket.on("productAdded", (product) => {
  const li = document.createElement("li");
  li.innerHTML = `<strong>${product.title}</strong> - $${product.price}`;
  productList.appendChild(li);
});
