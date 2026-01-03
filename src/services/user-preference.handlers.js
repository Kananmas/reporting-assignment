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
        if (!req.body) return res.status(400).send("invalid request");

        await RptUserPreferencesFlat.create(req.body);
        res.json({ message: "operation successful" });
    });

    app.put("/UserPreferences/update", async (req, res) => {
        const id = req.body.id;
        if (!id) return res.status(400).send("invalid request");

        const item = await RptUserPreferencesFlat.findOne({ where: { id } });
        if (!item) return res.status(400).send("invalid request");

        await item.update(req.body);
        res.json({ message: "operation successful" });
    });

    app.delete("/UserPreferences/remove", async (req, res) => {
        const id = req.query.id;
        if (!id) return res.status(400).send("invalid request");

        await RptUserPreferencesFlat.destroy({ where: { id } });
        res.json({ message: "operation successful" });
    });
}