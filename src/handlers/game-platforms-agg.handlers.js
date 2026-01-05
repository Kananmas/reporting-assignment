import dbInstance from "../../connection.js";
import { sendError } from "../../utils/send-error.utils.js";
import RptIgdbGamePlatformsAgg from "../models/RptIgdbGamePlatformsAgg/index.js";

export const gamePlatformAggHandler = (app) => {
    app.get("/GamePlatformsAgg/id", async (req, res) => {
        const id = req.query.id;
        if (!id) return res.status(400).send("invalid request");

        res.json(await RptIgdbGamePlatformsAgg.findOne({ where: { igdb_game_id: id } }));
    });

    app.get("/GamePlatformsAgg", async (req, res) => {
        res.json(await RptIgdbGamePlatformsAgg.findAll());
    });

    app.post("/GamePlatformsAgg/new", async (req, res) => {
        try {
            if (!req.body) return res.status(400).send("invalid request");
            const result = await RptIgdbGamePlatformsAgg.create(req.body);
            res.json({ message: "operation successful", result });
        } catch (error) {
            sendError(res , error)
        }
    });

    app.put("/GamePlatformsAgg/update", async (req, res) => {
        try {
            const id = req.body.igdb_game_id;
            if (!id) return res.status(400).send("invalid request");

            const item = await RptIgdbGamePlatformsAgg.findOne({ where: { igdb_game_id: id } });
            if (!item) return res.status(400).send("invalid request");

            await item.update(req.body);
            res.json({ message: "operation successful" });
        } catch (error) {
            sendError(res , error);
        }
    });

    app.delete("/GamePlatformsAgg/remove", async (req, res) => {
        const id = req.query.id;
        if (!id) return res.status(400).send("invalid request");

        await RptIgdbGamePlatformsAgg.destroy({ where: { igdb_game_id: id } });
        res.json({ message: "operation successful" });
    });


    //aggregations
    app.get("/GamePlatformAgg/arregations/count_by_gameid", async (req, res) => {
        const result = await RptIgdbGamePlatformsAgg.findAll({
            attributes: ['igdb_game_id', [dbInstance.fn("COUNT",
                dbInstance.col("igdb_game_id")), "count_by_gameid"]],
            group: ['igdb_game_id']
        })
        res.json(result)
    })
}