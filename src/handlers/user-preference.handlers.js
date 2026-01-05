import dbInstance from "../../connection.js";
import { sendError } from "../../utils/send-error.utils.js";
import RptUserPreferencesFlat from "../models/RptUserPreferencesFlat/index.js";

export const userPreferencesHandler = (app) => {
    app.get("/UserPreferences/id", async (req, res) => {
        const id = req.query.id;
        if (!id) return res.status(400).send("invalid request");

        res.json(await RptUserPreferencesFlat.findOne({ where: { id } }));
    });

    app.get("/UserPreferences", async (req, res) => {
        res.json(await RptUserPreferencesFlat.findAll());
    });

    app.post("/UserPreferences/new", async (req, res) => {
        try {
            if (!req.body) return res.status(400).send("invalid request");

            const result = await RptUserPreferencesFlat.create(req.body);
            res.json({ message: "operation successful", result });
        } catch (error) {
            sendError(res , error)
        }
    });

    app.put("/UserPreferences/update", async (req, res) => {
        try {
            const id = req.body.id;
            if (!id) return res.status(400).send("invalid request");

            const item = await RptUserPreferencesFlat.findOne({ where: { id } });
            if (!item) return res.status(400).send("invalid request");

            await item.update(req.body);
            res.json({ message: "operation successful" });
        } catch (error) {
            sendError(res , error)
        }
    });

    app.delete("/UserPreferences/remove", async (req, res) => {
        const id = req.query.id;
        if (!id) return res.status(400).send("invalid request");

        await RptUserPreferencesFlat.destroy({ where: { id } });
        res.json({ message: "operation successful" });
    });


    //aggregations
    app.get("/UserPreferences/aggregations/count_by_username", async (req, res) => {
        const result = await RptUserPreferencesFlat.findAll({
            attributes: ['username', [dbInstance.fn('COUNT', dbInstance.col('id')), 'count_by_username']],
            group: ['username']
        })

        res.json(result);
    })
}