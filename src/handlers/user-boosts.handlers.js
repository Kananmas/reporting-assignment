import dbInstance from "../../connection.js";
import { sendError } from "../../utils/send-error.utils.js";
import RptUserBoostsFlat from "../models/RptUserBoostsFlat/index.js";

export const userBoostsHandler = (app) => {
    app.get("/Boost/id", async (req, res) => {
        const id = req.query.id;
        if (!id) return res.status(400).send("invalid request");

        res.json(await RptUserBoostsFlat.findOne({ where: { id } }));
    });

    app.get("/Boost", async (req, res) => {
        res.json(await RptUserBoostsFlat.findAll());
    });

    app.post("/Boost/new", async (req, res) => {
        try {
            if (!req.body) return res.status(400).send("invalid request");

            const result = await RptUserBoostsFlat.create(req.body);
            res.json({ message: "operation successful", result });
        } catch (error) {
            sendError(res, error);
        }
    });

    app.put("/Boost/update", async (req, res) => {
        try {
            const id = req.body.id;
            if (!id) return res.status(400).send("invalid request");

            const item = await RptUserBoostsFlat.findOne({ where: { id } });
            if (!item) return res.status(400).send("invalid request");

            await item.update(req.body);
            res.json({ message: "operation successful" });
        } catch (error) {
            sendError(res , error);
        }
    });

    app.delete("/Boost/remove", async (req, res) => {
        const id = req.query.id;
        if (!id) return res.status(400).send("invalid request");

        await RptUserBoostsFlat.destroy({ where: { id } });
        res.json({ message: "operation successful" });
    });

    // aggregations
    app.get("/Boost/aggregations/avg-per-type", async (req, res) => {
        const result = await RptUserBoostsFlat.findAll({
            attributes: ["booster_type", [dbInstance.fn("AVG", dbInstance.col("booster_units")), "avg_units"]],
            group: ["booster_type"]
        });
        res.json(result);
    });
}