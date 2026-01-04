import dbInstance from "../../connection.js";
import RptIgdbGameUserUnsavedFlat from "../models/RptIgdbGameUserUnsavedFlat/index.js";

export const gameUserUnsavedHandler = (app) => {
    app.get("/GamePlatformsAgg/id", async (req, res) => {
        const id = req.query.id;
        if (!id) return res.status(400).send("invalid request");

        res.json(await RptIgdbGameUserUnsavedFlat.findOne({ where: { id } }));
    });

    app.get("/GamePlatformsAgg", async (req, res) => {
        res.json(await RptIgdbGameUserUnsavedFlat.findAll());
    });

    app.post("/GamePlatformsAgg/new", async (req, res) => {
        if (!req.body) return res.status(400).send("invalid request");

        await RptIgdbGameUserUnsavedFlat.create(req.body);
        res.json({ message: "operation successful" });
    });

    app.put("/GamePlatformsAgg/update", async (req, res) => {
        const id = req.body.id;
        if (!id) return res.status(400).send("invalid request");

        const item = await RptIgdbGameUserUnsavedFlat.findOne({ where: { id } });
        if (!item) return res.status(400).send("invalid request");

        await item.update(req.body);
        res.json({ message: "operation successful" });
    });

    app.delete("/GamePlatformsAgg/remove", async (req, res) => {
        const id = req.query.id;
        if (!id) return res.status(400).send("invalid request");

        await RptIgdbGameUserUnsavedFlat.destroy({ where: { id } });
        res.json({ message: "operation successful" });
    });

    //aggregation
    app.get("/GamePlatformsAgg/aggregation/username", async (req, res) => {
        const result = await RptIgdbGameUserUnsavedFlat.findAll({
            attributes: ["username", [dbInstance.fn("COUNT", dbInstance.col("id")), "count"]],
            group: ["username"]
        })
        res.json(result);
    })
}