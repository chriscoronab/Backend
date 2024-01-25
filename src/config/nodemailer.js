import nodemailer from "nodemailer";
import config from "./config.js";

const sendEmail = async (userEmail, ticket) => {
    try {
        const transport = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                user: config.nodemailerMail,
                pass: config.nodemailerPassword
            }
        });
        return await transport.sendMail({
            from: "Flow NBA",
            to: userEmail,
            subject: "Ticket de compra",
            html: `<div>
                <h3>¡Muchas gracias por tu compra!</h3>
                <br>
                <p><b>N° de compra:</b> ${ticket.code}</p>
                <p><b>Usuario:</b> ${ticket.purchaser}</p>
                <p><b>Fecha:</b> ${ticket.purchase_datetime}</p>
                <p><b>Total:</b> ${ticket.amount}</p>
                <br>
                <p>* Los productos sin stock no pudieron ser procesados</p>
                </div>`
        });
    } catch (error) {
        console.error(error);
    };
};

export default sendEmail;