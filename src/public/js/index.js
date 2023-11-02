const socket = io();

const form = document.querySelector("#form");
const productsTable = document.querySelector("#productsTable");
const tbody = productsTable.querySelector("#tbody");

form.addEventListener("submit", async (e) => {
    try {
        e.preventDefault();
        let product = {
            title: document.querySelector("#title").value,
            description: document.querySelector("#description").value,
            category: document.querySelector("#category").value,
            price: document.querySelector("#price").value,
            code: document.querySelector("#code").value,
            stock: document.querySelector("#stock").value
        };
        await fetch("/api/products", {
            method: "POST",
            body: JSON.stringify(product),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const res = await fetch("/api/products");
        const result = await res.json();
        socket.emit("productsList", result.products);
        Toastify({
            text: "Producto agregado con éxito",
            duration: 4000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#32CD32",
                borderRadius: "10px",
                fontWeight: "600",
            }
        }).showToast();
        document.querySelector("#title").value = "";
        document.querySelector("#description").value = "";
        document.querySelector("#category").value = "";
        document.querySelector("#price").value = "";
        document.querySelector("#code").value = "";
        document.querySelector("#stock").value = "";
    } catch (error) {
        console.log(error);
    };
});

const deleteProduct = async (id) => {
    try {
        await fetch(`/api/products/${id}`, {
            method: "DELETE"
        });
        const res = await fetch("/api/products");
        const result = await res.json();
        socket.emit("productsList", result.products);
        Toastify({
            text: "Producto eliminado con éxito",
            duration: 4000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "red",
                borderRadius: "10px",
                fontWeight: "600",
            }
        }).showToast();
    } catch (error) {
        console.log(error);
    };
};

socket.on("updatedProducts", products => {      
    tbody.innerHTML = "";
    products.forEach(item => {              
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.title}</td>
            <td>${item.description}</td>
            <td>${item.category}</td>
            <td>${item.price}</td>
            <td>${item.code}</td>
            <td>${item.stock}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteProduct(${item.id})" id="deleteButton">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
});