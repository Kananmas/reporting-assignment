import dbInstance from "../../connection.js";
import { sendError } from "../../utils/send-error.js";
import RptIgdbGameUserUnsavedFlat from "../models/RptIgdbGameUserUnsavedFlat/index.js";

export const gameUserUnsavedHandler = (app) => {
    app.get("/GameUserUnsaved/id", async (req, res) => {
        const id = req.query.id;
        if (!id) return res.status(400).send("invalid request");

        res.json(await RptIgdbGameUserUnsavedFlat.findOne({ where: { id } }));
    });

    app.get("/GameUserUnsaved", async (req, res) => {
        res.json(await RptIgdbGameUserUnsavedFlat.findAll());
    });

    app.post("/GameUserUnsaved/new", async (req, res) => {
        try {
            if (!req.body) return res.status(400).send("invalid request");

            const result = await RptIgdbGameUserUnsavedFlat.create(req.body);
            res.json({ message: "operation successful", result });
        } catch (error) {
            sendError(res, error)
        }
    });

    app.put("/GameUserUnsaved/update", async (req, res) => {
        try {
            const id = req.body.id;
            if (!id) return res.status(400).send("invalid request");

            const item = await RptIgdbGameUserUnsavedFlat.findOne({ where: { id } });
            if (!item) return res.status(400).send("invalid request");

            await item.update(req.body);
            res.json({ message: "operation successful" });
        } catch (error) {
            sendError(res, error)
        }
    });

    app.delete("/GameUserUnsaved/remove", async (req, res) => {
        const id = req.query.id;
        if (!id) return res.status(400).send("invalid request");

        await RptIgdbGameUserUnsavedFlat.destroy({ where: { id } });
        res.json({ message: "operation successful" });
    });

    //aggregation
    app.get("/GameUserUnsaved/aggregations/count_by_username", async (req, res) => {
        const result = await RptIgdbGameUserUnsavedFlat.findAll({
            attributes: ["username", [dbInstance.fn("COUNT", dbInstance.col("id")), "count_by_user"]],
            group: ["username"]
        })
        res.json(result);
    })

    app.get("/GameUserUnsaved/aggregations/count_by_gameid", async (req, res) => {
        const result = await RptIgdbGameUserUnsavedFlat.findAll({
            attributes: ["igdb_game_id", [dbInstance.fn("COUNT", dbInstance.col("id")), "count_by_game"]],
            group: ["igdb_game_id"]
        })
        res.json(result);
    })
}