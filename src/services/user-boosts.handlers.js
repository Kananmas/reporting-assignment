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
        if (!req.body) return res.status(400).send("invalid request");

        await RptUserBoostsFlat.create(req.body);
        res.json({ message: "operation successful" });
    });

    app.put("/Boost/update", async (req, res) => {
        const id = req.body.id;
        if (!id) return res.status(400).send("invalid request");

        const item = await RptUserBoostsFlat.findOne({ where: { id } });
        if (!item) return res.status(400).send("invalid request");

        await item.update(req.body);
        res.json({ message: "operation successful" });
    });

    app.delete("/Boost/remove", async (req, res) => {
        const id = req.query.id;
        if (!id) return res.status(400).send("invalid request");

        await RptUserBoostsFlat.destroy({ where: { id } });
        res.json({ message: "operation successful" });
    });
}