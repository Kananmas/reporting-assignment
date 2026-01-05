import dbInstance from "../../connection.js";
import { sendError } from "../../utils/send-error.utils.js";
import RptIgdbGame from "../models/RptIgdbGame/index.js";

export const gameHandler = (app) => {

    app.get("/IGDBGame/id", async (req, res) => {
        const id = req.query.id;
        if (!id) return res.status(400).send("invalid request");

        res.json(await RptIgdbGame.findOne({ where: { id } }));
    });

    app.get("/IGDBGame", async (req, res) => {
        res.json(await RptIgdbGame.findAll());
    });

    app.post("/IGDBGame/new", async (req, res) => {
        try {
            if (!req.body) return res.status(400).send("invalid request");

            const result = await RptIgdbGame.create(req.body);
            res.json({ message: "operation successful", result });
        } catch (error) {
            res.status(500).json({ error: error.message, details: error })
        }
    });

    app.put("/IGDBGame/update", async (req, res) => {
        try {
            const id = req.body.id;
            if (!id) return res.status(400).send("invalid request");

            const item = await RptIgdbGame.findOne({ where: { id } });
            if (!item) return res.status(400).send("invalid request");

            await item.update(req.body);
            res.json({ message: "operation successful" });
        } catch (error) {
            sendError(res , error)
        }
    });

    app.delete("/IGDBGame/remove", async (req, res) => {
        const id = req.query.id;
        if (!id) return res.status(400).send("invalid request");

        await RptIgdbGame.destroy({ where: { id } });
        res.json({ message: "operation successful" });
    });

    // aggregations
    app.get("/IGDBGame/aggregations/group_by_genre", async (req, res) => {
        const result = await RptIgdbGame.findAll({
            attributes: ["genres", [dbInstance.fn("COUNT", dbInstance.col("id")), "game_count"]],
            group: ["genres"]
        });
        res.json(result);
    });
}