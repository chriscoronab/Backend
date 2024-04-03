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

export const sendTicketMail = async (email, ticket) => {
    try {
        return await transport.sendMail({
            from: config.nodemailerMail,
            to: email,
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

export const sendPasswordRecoveryMail = async (email, token) => {
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

export const sendDeletedUserMail = async user => {
    try {
        const link = "http://127.0.0.1:8080/register";
        return await transport.sendMail({
            from: config.nodemailerMail,
            to: user.email,
            subject:"Flow NBA: Usuario eliminado por inactividad",
            html: `<div>
            <p>Hola, ${user.first_name}. Te informamos que tu usuario ha sido eliminado de nuestra base de datos por inactividad por más de 2 días.</p>
            <br>
            <p>Si deseas volver a registrarte en nuestra web, haz click en el siguiente enlance:</p>
            <br>
            <a href="${link}"><button>Registrarse</button></a>        
            </div>`
        });
    } catch (error) {
        console.error(error);
    };
};

export const sendDeletedProductMail = async email => {
    try {
        return await transport.sendMail({
            from: config.nodemailerMail,
            to: email,
            subject:"Flow NBA: Producto eliminado",
            html: `<div>
            <p>¡Hola! Te informamos que tu producto ha sido eliminado de nuestra base de datos por decisión de la tienda de no vender más dicho producto.</p>
            <br>
            <p>Gracias por ser parte de Flow NBA.</p>`
        });
    } catch (error) {
        console.error(error);
    };
};