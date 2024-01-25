import { Products, Carts, Users, Messages } from "../dao/factory.js";
import ProductService from "./products.service.js";
import CartService from "./carts.service.js";
import UserService from "./users.service.js";
import MessageService from "./messages.service.js";

export const productService = new ProductService(new Products());
export const cartService = new CartService(new Carts());
export const userService = new UserService(new Users());
export const messageService = new MessageService(new Messages());