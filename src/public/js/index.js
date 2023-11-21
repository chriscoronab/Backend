document.addEventListener("DOMContentLoaded", () => {
    const userDisplay = document.getElementById("user");
    const chatbox = document.getElementById("chatbox");
    const messagesLogs = document.getElementById("messagesLogs");
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
    const initSocket = (username) => {
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
        socket.on("logs", (data) => {
            const messagesHTML = data
                // .reverse()
                .map((message) => {
                    return `<div class="bg-primary p-2 m-2 rounded-2">
                            <p><b>${message.user}</b>: ${message.message}</p>
                        </div>`;
                })
                .join("");
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
    setUsername().then((username) => initSocket(username))
});

// console.log("Init my chat");

// let socket = io();

// socket.on("logs")
// let user = sessionStorage.getItem("user") || "";

// if (user) {
//     document.querySelector("#username").innerHTML = user + ": ";
//     //initIO();
// } else {
//     Swal.fire({
//         title: "Login",
//         input: "text",
//         text: "Elige tu nombre de usuario para ingresar al chat",
//         inputValidator: value => {
//             return !value.trim() && "Debes escribir un nombre de usuario";
//         },
//         allowOutsideClick: false
//     }).then(result => {
//         user = result.value;
//         sessionStorage.setItem("user", user);
//         document.querySelector("#username").innerHTML = user + ": ";
//         // initIO();
//     });
// };

// const input = document.querySelector("#message");
// input.addEventListener("keyup", event => {
//     if (event.key === "Enter") sendMessage(event.currentTarget.value);
// });

// document.querySelector("#send").addEventListener("click", event => sendMessage(input.value));

// function sendMessage(message) {
//     if (message.trim().length > 0) {
//         socket = io();
//         socket.emit("message", { user, message });
//         input.value = "";
//     };
// };

// function initIO() {
//     socket = io();
//     socket.on("logs", messages => {
//         const box = document.querySelector("#chatbox");
//         let html = "";
//         messages.reverse().forEach(message => {
//             html += `<p><i>${message.user}</i>: ${message.message}</p>`
//         });
//         box.innerHTML = html;
//     });
// };