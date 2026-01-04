import dbInstance from "../../connection.js";
import RptStreamingPreference from "../models/RptStreamingPreference/index.js";

export const streamingPrefHandler = (app) => {

    app.get("/StreamingPreference/id", async (req, res) => {
        const id = req.query.id;
        if (!id) return res.status(400).send("invalid request");

        res.json(await RptStreamingPreference.findOne({ where: { id } }));
    });

    app.get("/StreamingPreference", async (req, res) => {
        res.json(await RptStreamingPreference.findAll());
    });

    app.post("/StreamingPreference/new", async (req, res) => {
        if (!req.body) return res.status(400).send("invalid request");

        await RptStreamingPreference.create(req.body);
        res.json({ message: "operation successful" });
    });

    app.put("/StreamingPreference/update", async (req, res) => {
        const id = req.body.id;
        if (!id) return res.status(400).send("invalid request");

        const item = await RptStreamingPreference.findOne({ where: { id } });
        if (!item) return res.status(400).send("invalid request");

        await item.update(req.body);
        res.json({ message: "operation successful" });
    });

    app.delete("/StreamingPreference/remove", async (req, res) => {
        const id = req.query.id;
        if (!id) return res.status(400).send("invalid request");

        await RptStreamingPreference.destroy({ where: { id } });
        res.json({ message: "operation successful" });
    });


    // aggregations
    app.get("/StreamingPreference/aggregations/count_by_type", async (req, res) => {
        const result = await RptStreamingPreference.findAll({
            attributes: ['preferrence_type',[ dbInstance.fn("COUNT", dbInstance.col('id')), 'preferrence_type']],
            group:['preferrence_type']
        })

        res.json(result);
    })
}