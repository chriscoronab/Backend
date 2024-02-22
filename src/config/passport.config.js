import passport from "passport";
import local from "passport-local";
import passportJWT from "passport-jwt";
import GitHubStrategy from "passport-github2";
import config from "./config.js";
import { userService, cartService } from "../repositories/index.js";
import { createHash, isValidPassword, generateToken } from "../utils.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = passportJWT.Strategy;

const initializePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        try {
            const { first_name, last_name, email, age } = req.body;
            const user = await userService.getUserByUsername({ email: username });
            if (user) {
                console.error(`El usuario ${user.email} ya existe`);
                return done(null, false);
            };
            const cartNewUser = await cartService.createCart({});
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: cartNewUser._id
            };
            if (newUser.email === "adminCoder@coder.com") {
                newUser.role = "Admin"
            };
            const result = await userService.createUser(newUser);
            return done(null, result);
        } catch (error) {
            return done({ error: error.message });
        };
    }));
    passport.use("login", new LocalStrategy(
        { usernameField: "email" },
        async (username, password, done) => {
            try {
                const user = await userService.getUserByUsername({ email: username });
                if (!user) {
                    console.error("El usuario no existe");
                    return done(null, false);
                };
                if (!isValidPassword(user, password)) {
                    console.error("Contraseña incorrecta");
                    return done(null, false);
                };
                const token = generateToken(user);
                user.token = token;
                return done(null, user);
            } catch (error) {
                return done({ error: error.message });
            };
        }
    ));
    passport.use("github", new GitHubStrategy({
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: "http://127.0.0.1:8080/session/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile._json.email;
            let user = await userService.getUserByEmail(email);
            if (!user) {
                const cartNewUser = await cartService.createCart({});
                user = {
                    first_name: profile.displayName, 
                    last_name: "",
                    email,
                    age: "",
                    password: "",
                    cart: cartNewUser._id,
                    role: "User"
                };
                if (user.email === "adminCoder@coder.com") {
                    user.role = "Admin"
                };
                const result = await userService.createUser(user);
                user._id = result._id;
            };
            const token = generateToken(user);
            user.token = token;
            return done(null, user);
        } catch (error) {
            return done({ error: error.message });
        };
    }));
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([req => req?.cookies?.cookieJWT ?? null]),
        secretOrKey: config.privateKey
    }, (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch {
            return done({ error: error.message });
        };
    }));
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async(id, done) => {
        const user = await userService.getUserByID(id);
        done(null, user);
    });
};

export default initializePassport;