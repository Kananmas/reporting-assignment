import bodyParser from "body-parser";
import express from "express";

import RptIgdbGame from "./src/models/RptIgdbGame/index.js";
import RptUserFlat from "./src/models/RptUserFlat/index.js";
import RptStreamingPreference from "./src/models/RptStreamingPreference/index.js";
import RptUserPreferencesFlat from "./src/models/RptUserPreferencesFlat/index.js";
import RptIgdbGamePlatforms from "./src/models/RptIgdbGamePlatforms/index.js";
import RptIgdbGameUserFeedbackFlat from "./src/models/RptIgdbGameUserFeedbackFlat/index.js";
import RptTwitchGameRecommendationFlat from "./src/models/RptTwitchGameRecommendationFlat/index.js";
import RptUserBoostsFlat from "./src/models/RptUserBoostsFlat/index.js";

const app = express();
app.use(bodyParser.json());

/* =========================================================
   rpt-igdb-game
   ========================================================= */

app.get("/IGDBGame/id", async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).send("invalid request");

  res.json(await RptIgdbGame.findOne({ where: { id } }));
});

app.get("/IGDBGame", async (req, res) => {
  res.json(await RptIgdbGame.findAll());
});

app.post("/IGDBGame/new", async (req, res) => {
  if (!req.body) return res.status(400).send("invalid request");

  await RptIgdbGame.create(req.body);
  res.json({ message: "operation successful" });
});

app.put("/IGDBGame/update", async (req, res) => {
  const id = req.body.id;
  if (!id) return res.status(400).send("invalid request");

  const item = await RptIgdbGame.findOne({ where: { id } });
  if (!item) return res.status(400).send("invalid request");

  await item.update(req.body);
  res.json({ message: "operation successful" });
});

app.delete("/IGDBGame/remove", async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).send("invalid request");

  await RptIgdbGame.destroy({ where: { id } });
  res.json({ message: "operation successful" });
});

/* =========================================================
   rpt-user-flat
   ========================================================= */

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

/* =========================================================
   rpt-streaming-preference
   ========================================================= */

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

/* =========================================================
   rpt-user-preferences-flat
   ========================================================= */

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

/* =========================================================
   rpt-igdb-game-platforms
   ========================================================= */

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

/* =========================================================
   rpt-igdb-game-user-feedback-flat
   ========================================================= */

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

/* =========================================================
   rpt-twitch-game-recommendation-flat
   ========================================================= */

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

/* =========================================================
   rpt-user-boosts-flat
   ========================================================= */

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

/* ========================================================= */

app.listen(8081, (e) => {
  if (e) {
    console.log(`error: ${e.message}`);
    return;
  }
  console.log("connected successfully");
});
