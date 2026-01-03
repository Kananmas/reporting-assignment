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
        if (!req.body) return res.status(400).send("invalid request");

        await RptUserFlat.create(req.body);
        res.json({ message: "operation successful" });
    });

    app.put("/User/update", async (req, res) => {
        const username = req.body.username;
        if (!username) return res.status(400).send("invalid request");

        const item = await RptUserFlat.findOne({ where: { username } });
        if (!item) return res.status(400).send("invalid request");

        await item.update(req.body);
        res.json({ message: "operation successful" });
    });

    app.delete("/User/remove", async (req, res) => {
        const username = req.query.username;
        if (!username) return res.status(400).send("invalid request");

        await RptUserFlat.destroy({ where: { username } });
        res.json({ message: "operation successful" });
    });
}