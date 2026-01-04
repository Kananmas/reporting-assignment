import dbInstance from "../../connection.js";
import { sendError } from "../../utils/send-error.js";
import RptUserFlat from "../models/RptUserFlat/index.js";

export const userHandlers = (app) => {
    app.get("/User/id", async (req, res) => {
        const username = req.query.username;
        if (!username) return res.status(400).send("invalid request");

        res.json(await RptUserFlat.findOne({ where: { username } }));
    });

    app.get("/User", async (req, res) => {
        res.json(await RptUserFlat.findAll());
    });

    app.post("/User/new", async (req, res) => {
        try {
            if (!req.body) return res.status(400).send("invalid request");

            const result = await RptUserFlat.create(req.body);
            res.json({ message: "operation successful", result });
        } catch (error) {
           sendError(res , error);
        }
    });

    app.put("/User/update", async (req, res) => {
        try {
            const username = req.body.username;
            if (!username) return res.status(400).send("invalid request");

            const item = await RptUserFlat.findOne({ where: { username } });
            if (!item) return res.status(400).send("invalid request");

            await item.update(req.body);
            res.json({ message: "operation successful" });
        } catch (error) {
           sendError(res , error);
        }
    });

    app.delete("/User/remove", async (req, res) => {
        const username = req.query.username;
        if (!username) return res.status(400).send("invalid request");

        await RptUserFlat.destroy({ where: { username } });
        res.json({ message: "operation successful" });
    });

    //aggregation
    app.get("/User/aggregations/market_alerts", async (req, res) => {
        const result = await RptUserFlat.findAll({
            attributes: ["market_alerts", [dbInstance.fn("COUNT", dbInstance.col("username")), "user_count"]],
            group: ["market_alerts"]
        });
        res.json(result);
    });

}