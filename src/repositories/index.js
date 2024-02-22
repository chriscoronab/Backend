import { Products, Carts, Users, Messages } from "../dao/factory.js";
import ProductRepository from "./products.repository.js";
import CartRepository from "./carts.repository.js";
import UserRepository from "./users.repository.js";
import MessageRepository from "./messages.repository.js";

export const productService = new ProductRepository(new Products());
export const cartService = new CartRepository(new Carts());
export const userService = new UserRepository(new Users());
export const messageService = new MessageRepository(new Messages());