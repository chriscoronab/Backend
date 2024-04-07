document.addEventListener("DOMContentLoaded", () => {
    const userDisplay = document.querySelector("#user");
    const chatbox = document.querySelector("#chatbox");
    const messagesLogs = document.querySelector("#messagesLogs");
    const setUsername = async () => {
        const { value: username } = await Swal.fire({
            title: "Login",
            input: "text",
            text: "Elige tu nombre de usuario para ingresar al chat",
            inputValidator: value => {
                return !value.trim() && "Debes escribir un nombre de usuario";
            },
            allowOutsideClick: false
        });
        userDisplay.innerHTML = `<b>${username}: </b>`;
        return username;
    };
    const initSocket = username => {
        const socket = io();
        chatbox.addEventListener("keyup", event => {
            if (event.key === "Enter" && chatbox.value.trim().length > 0) {
                const newMessage = {
                    user: username,
                    message: chatbox.value,
                };
                socket.emit("message", newMessage);
                chatbox.value = "";
            };
        });
        socket.on("logs", data => {
            const messagesHTML = data.map(message => {
                return `<div class="bg-primary p-2 m-2 rounded-2">
                        <p><b>${message.user}</b>: ${message.message}</p>
                    </div>`;
                }).join("");
            messagesLogs.innerHTML = messagesHTML;
        });
        socket.on("alert", () => {
            Toastify({
                text: "Nuevo usuario conectado",
                duration: 4000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "green",
                    borderRadius: "10px",
                    fontWeight: "600",
                }
            }).showToast();
        });
    };
    setUsername().then(username => initSocket(username));
});