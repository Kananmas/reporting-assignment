import bodyParser from "body-parser";
import express from "express";

import RptIgdbGameUserFeedbackFlat from "./src/models/RptIgdbGameUserFeedbackFlat/index.js";
import RptTwitchGameRecommendationFlat from "./src/models/RptTwitchGameRecommendationFlat/index.js";
import RptUserBoostsFlat from "./src/models/RptUserBoostsFlat/index.js";
import { userHandlers } from "./src/services/user.handlers.js";
import { gameHandler } from "./src/services/game.handlers.js";
import { streamingPrefHandler } from "./src/services/streaming-preference.js";
import { userPreferencesHandler } from "./src/services/user-preference.handlers.js";
import { gamePlatformsHandler } from "./src/services/game-platforms.handlers.js";
import { userFeedbackHandler } from "./src/services/game-user-feedback.handlers.js";
import { twitchGameRecomHandler } from "./src/services/twich-game-recommendation.handlers.js";

const app = express();
app.use(bodyParser.json());

/* =========================================================
   rpt-igdb-game
   ========================================================= */
 gameHandler(app);
/* =========================================================
   rpt-user-flat
   ========================================================= */
 userHandlers(app);
/* =========================================================
   rpt-streaming-preference
   ========================================================= */
 streamingPrefHandler(app)
/* =========================================================
   rpt-user-preferences-flat
   ========================================================= */
 userPreferencesHandler(app)
/* =========================================================
   rpt-igdb-game-platforms
   ========================================================= */
 gamePlatformsHandler(app)
/* =========================================================
   rpt-igdb-game-user-feedback-flat
   ========================================================= */
 userFeedbackHandler(app)
/* =========================================================
   rpt-twitch-game-recommendation-flat
   ========================================================= */
 twitchGameRecomHandler(app)
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
