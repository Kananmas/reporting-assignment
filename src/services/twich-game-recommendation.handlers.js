import dbInstance from "../../connection.js";
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

    //aggregations
    app.get("/Recommendation/aggregations/count_by_type", async (req, res) => {
        const result = await RptTwitchGameRecommendationFlat.findAll({
            attributes: ['recommendation_type', [dbInstance.fn("COUNT",
                dbInstance.col("id")), 'count_by_type']],
            group:['recommendation_type']
        })
        res.json(result)
    })

    app.get("/Recommendation/aggregations/count_by_username" , async (req , res) => {
        const result = await RptTwitchGameRecommendationFlat.findAll({
            attributes:['username' , [dbInstance.fn('COUNT' , dbInstance.col("id")) , "count_by_username"]],
            group:['username']
        })

        res.json(result)
    })
}