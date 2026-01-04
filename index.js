import bodyParser from "body-parser";
import express from "express";
import open from "open";

import { userHandlers } from "./src/services/user.handlers.js";
import { gameHandler } from "./src/services/game.handlers.js";
import { streamingPrefHandler } from "./src/services/streaming-preference.js";
import { userPreferencesHandler } from "./src/services/user-preference.handlers.js";
import { gamePlatformsHandler } from "./src/services/game-platforms.handlers.js";
import { userFeedbackHandler } from "./src/services/game-user-feedback.handlers.js";
import { twitchGameRecomHandler } from "./src/services/twich-game-recommendation.handlers.js";
import { userBoostsHandler } from "./src/services/user-boosts.handlers.js";
import { gameUserUnsavedHandler } from "./src/services/game-user-unsaved.handlers.js";
import { gamePlatformAggHandler } from "./src/services/game-platforms-agg.handlers.js";


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
 userBoostsHandler(app)
/* ========================================================= */
/* =========================================================
   rpt-igdb-game-user-unsaved-flat
   ========================================================= */
 gameUserUnsavedHandler(app)
/* ========================================================= */
/* =========================================================
   rpt-igdb-game-user-platform-agg
   ========================================================= */
 gamePlatformAggHandler(app)
/* ========================================================= */

app.get("/docs", (req, res) => {
  res.type("html");
  res.sendFile(process.cwd() + "/docs.html");
});

app.listen(8081, (e) => {
  if (e) {
    console.log(`error: ${e.message}`);
    return;
  }
  console.log("connected successfully");
  open("http://localhost:8081/docs")
});
