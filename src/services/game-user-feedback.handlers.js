import dbInstance from "../../connection.js";
import { sendError } from "../../utils/send-error.js";
import RptIgdbGameUserFeedbackFlat from "../models/RptIgdbGameUserFeedbackFlat/index.js";

export const userFeedbackHandler = (app) => {
  app.get("/Feedback/id", async (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).send("invalid request");

    res.json(await RptIgdbGameUserFeedbackFlat.findOne({ where: { id } }));
  });

  app.get("/Feedback", async (req, res) => {
    res.json(await RptIgdbGameUserFeedbackFlat.findAll());
  });

  app.post("/Feedback/new", async (req, res) => {
    try {
      if (!req.body) return res.status(400).send("invalid request");

      const result = await RptIgdbGameUserFeedbackFlat.create(req.body);
      res.json({ message: "operation successful", result });
    } catch (error) {
      sendError(res , error)
    }
  });

  app.put("/Feedback/update", async (req, res) => {
    try {
      const id = req.body.id;
      if (!id) return res.status(400).send("invalid request");

      const item = await RptIgdbGameUserFeedbackFlat.findOne({ where: { id } });
      if (!item) return res.status(400).send("invalid request");

      await item.update(req.body);
      res.json({ message: "operation successful" });
    } catch (error) {
      sendError(res, error);
    }
  });

  app.delete("/Feedback/remove", async (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).send("invalid request");

    await RptIgdbGameUserFeedbackFlat.destroy({ where: { id } });
    res.json({ message: "operation successful" });
  });


  // aggregations
  app.get("/Feedback/aggregations/per-game", async (req, res) => {
    const result = await RptIgdbGameUserFeedbackFlat.findAll({
      attributes: ["igdb_game_id", [dbInstance.fn("COUNT", dbInstance.col("id")), "feedback_count"]],
      group: ["igdb_game_id"]
    });
    res.json(result);
  });

}