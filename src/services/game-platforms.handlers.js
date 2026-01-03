import RptIgdbGamePlatforms from "../models/RptIgdbGamePlatforms/index.js";

export const gamePlatformsHandler = (app) => {
    app.get("/GamePlatforms/id", async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).send("invalid request");

  res.json(await RptIgdbGamePlatforms.findOne({ where: { id } }));
});

app.get("/GamePlatforms", async (req, res) => {
  res.json(await RptIgdbGamePlatforms.findAll());
});

app.post("/GamePlatforms/new", async (req, res) => {
  if (!req.body) return res.status(400).send("invalid request");

  await RptIgdbGamePlatforms.create(req.body);
  res.json({ message: "operation successful" });
});

app.put("/GamePlatforms/update", async (req, res) => {
  const id = req.body.id;
  if (!id) return res.status(400).send("invalid request");

  const item = await RptIgdbGamePlatforms.findOne({ where: { id } });
  if (!item) return res.status(400).send("invalid request");

  await item.update(req.body);
  res.json({ message: "operation successful" });
});

app.delete("/GamePlatforms/remove", async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).send("invalid request");

  await RptIgdbGamePlatforms.destroy({ where: { id } });
  res.json({ message: "operation successful" });
});
}