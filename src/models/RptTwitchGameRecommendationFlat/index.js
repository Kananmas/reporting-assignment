import { DataTypes } from "sequelize";
import db from "../../../connection.js";


const RptTwitchGameRecommendationFlat = db.define(
  "rpt_twitch_game_recommendation_flat",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true ,  autoIncrement:true  },
    igdb_game_id: DataTypes.INTEGER,
    username: DataTypes.STRING,
    stat_type: DataTypes.STRING,
    recommendation_reason: DataTypes.TEXT,
    batch_number: DataTypes.STRING,
    is_queued: DataTypes.TINYINT,
    recommendation_type: DataTypes.STRING,
    hidden: DataTypes.TINYINT,
    game_display_name: DataTypes.TEXT,
    game_genres: DataTypes.TEXT,
    game_themes: DataTypes.TEXT,
    game_cover: DataTypes.TEXT,
    game_igdb_api_id: DataTypes.INTEGER,
    twitch_name: DataTypes.STRING,
    createdBy: DataTypes.STRING,
    createdDate: DataTypes.DATE,
    updatedBy: DataTypes.STRING,
    updatedDate: DataTypes.DATE,
    isActive: DataTypes.TINYINT,
  },
  { tableName: "rpt_twitch_game_recommendation_flat", timestamps: false }
);

export default RptTwitchGameRecommendationFlat;
