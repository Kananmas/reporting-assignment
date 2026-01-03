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
  if (!req.body) return res.status(400).send("invalid request");

  await RptIgdbGameUserFeedbackFlat.create(req.body);
  res.json({ message: "operation successful" });
});

app.put("/Feedback/update", async (req, res) => {
  const id = req.body.id;
  if (!id) return res.status(400).send("invalid request");

  const item = await RptIgdbGameUserFeedbackFlat.findOne({ where: { id } });
  if (!item) return res.status(400).send("invalid request");

  await item.update(req.body);
  res.json({ message: "operation successful" });
});

app.delete("/Feedback/remove", async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).send("invalid request");

  await RptIgdbGameUserFeedbackFlat.destroy({ where: { id } });
  res.json({ message: "operation successful" });
});

}