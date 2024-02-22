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

export const sendTicketEmail = async (userEmail, ticket) => {
    try {
        return await transport.sendMail({
            from: config.nodemailerMail,
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

export const sendPasswordRecoveryEmail = async (email, token) => {
    try {
        const link = `http://127.0.0.1:8080/reset-password?token=${token}`;
        return await transport.sendMail({
            from: config.nodemailerMail,
            to: email,
            subject:"Flow NBA: Restablecer contraseña",
            html: `<div>
            <p>Para restablecer tu contraseña, haz click en el siguiente link:</p>
            <br>
            <a href="${link}"><button>Restablecer contraseña</button></a>        
            </div>`
        });
    } catch (error) {
        console.error(error);
    };
};