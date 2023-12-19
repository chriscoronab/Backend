import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import userModel from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;

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
            done({ error: error.message });
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
                return done(null, user);
            } catch (error) {
                done({ error: error.message });
            };
        }
    ));
    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.e56c084091a0a3d7",
        clientSecret: "753cbe8324e269a002cac96ab83afcec8d1b89dd",
        callbackURL: "http://127.0.0.1:8080/session/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            const email = profile._json.email;
            const user = await userModel.findOne({ email });
            if (user) {
                console.log("Ya estás registrado");
                return done(null, user);
            };
            const newUser = {
                first_name: profile.displayName, 
                last_name: "",
                email,
                age: "",
                password: ""
            };
            const result = await userModel.create(newUser);
            return done(null, result);
        } catch (error) {
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