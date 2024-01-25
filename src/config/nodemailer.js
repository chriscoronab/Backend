import nodemailer from "nodemailer";
import config from "./config.js";

const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: config.nodemailerMail,
        pass: config.nodemailerPassword
    }
});

// const mail = await transport.sendMail({
//     from: "Flow NBA",
//     to: "userEmail",
//     subject: "Compra realizada",
//     html: `<div>
//             <h2>${req.user.first_name}, tu compra fue realizada con éxito</h2>
//             <p><strong>Monto total:</strong> ${total}</p>
//         </div>`
// });

export default transport;