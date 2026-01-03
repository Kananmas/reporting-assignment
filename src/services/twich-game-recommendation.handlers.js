import RptTwitchGameRecommendationFlat from "../models/RptTwitchGameRecommendationFlat/index.js";

export const twitchGameRecomHandler = (app) => {
    app.get("/Recommendation/id", async (req, res) => {
        const id = req.query.id;
        if (!id) return res.status(400).send("invalid request");

        res.json(await RptTwitchGameRecommendationFlat.findOne({ where: { id } }));
    });

    app.get("/Recommendation", async (req, res) => {
        res.json(await RptTwitchGameRecommendationFlat.findAll());
    });

    app.post("/Recommendation/new", async (req, res) => {
        if (!req.body) return res.status(400).send("invalid request");

        await RptTwitchGameRecommendationFlat.create(req.body);
        res.json({ message: "operation successful" });
    });

    app.put("/Recommendation/update", async (req, res) => {
        const id = req.body.id;
        if (!id) return res.status(400).send("invalid request");

        const item = await RptTwitchGameRecommendationFlat.findOne({ where: { id } });
        if (!item) return res.status(400).send("invalid request");

        await item.update(req.body);
        res.json({ message: "operation successful" });
    });

    app.delete("/Recommendation/remove", async (req, res) => {
        const id = req.query.id;
        if (!id) return res.status(400).send("invalid request");

        await RptTwitchGameRecommendationFlat.destroy({ where: { id } });
        res.json({ message: "operation successful" });
    });
}