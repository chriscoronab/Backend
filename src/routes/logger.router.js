import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    try {
        req.logger.fatal("Fatal");
        req.logger.error("Error");
        req.logger.warning("Warning");
        req.logger.info("Info");
        req.logger.http("HTTP");
        req.logger.debug("Debug");
        res.status(200).send({ test: "Logger test" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    };
});

export default router;