const form = document.querySelector("#loginForm");

form.addEventListener("submit", async (e) => {
    try {
        e.preventDefault();
        const data = new FormData(form);
        const object = {};
        data.forEach((value, key) => object[key] = value);
        await fetch("/session", { 
            method: "POST",
            body: JSON.stringify(object)
        })
        .then(() => {
            document.location.href = "/products";
        })
    } catch (error) {
        console.error(error);
    };
});