import passport from "passport";
import local from "passport-local";
import passportJWT from "passport-jwt";
import GitHubStrategy from "passport-github2";
import { config } from "dotenv";
import userModel from "../dao/models/users.model.js";
import { createHash, isValidPassword, generateToken } from "../utils.js";

config({ path: ".env" });

const LocalStrategy = local.Strategy;
const JWTStrategy = passportJWT.Strategy;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const initializePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        try {
            const { first_name, last_name, email, age } = req.body;
            const user = await userModel.findOne({ email: username });
            if (user) {
                console.error(`El usuario ${user.email} ya existe`);
                return done(null, false);
            };
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            };
            const result = await userModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done({ error: error.message });
        };
    }));
    passport.use("login", new LocalStrategy(
        { usernameField: "email" },
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username });
                if (!user) {
                    console.error("El usuario no existe");
                    return done(null, false);
                };
                if (!isValidPassword(user, password)) {
                    console.error("Contraseña incorrecta");
                    return done(null, false);
                };
                if (user.email === "adminCoder@coder.com") {
                    user.role = "Admin"
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
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:8080/session/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            const email = profile._json.email;
            let user = await userModel.findOne({ email });
            if (!user) {
                user = {
                    first_name: profile.displayName, 
                    last_name: "",
                    email,
                    age: "",
                    password: ""
                };
                const result = await userModel.create(user);
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
        secretOrKey: PRIVATE_KEY
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
        const user = await userModel.findById(id);
        done(null, user);
    });
};

export default initializePassport;