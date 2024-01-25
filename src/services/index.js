import { Products, Carts, Users, Tickets, Messages } from "../dao/factory.js";
import ProductService from "./products.service.js";
import CartService from "./carts.service.js";
import UserService from "./users.service.js";
import TicketService from "./tickets.service.js";
import MessageService from "./messages.service.js";

export const productService = new ProductService(new Products());
export const cartService = new CartService(new Carts());
export const userService = new UserService(new Users());
export const ticketService = new TicketService(new Tickets());
export const messageService = new MessageService(new Messages());