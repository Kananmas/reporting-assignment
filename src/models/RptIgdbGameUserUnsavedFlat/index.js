import { DataTypes } from "sequelize";
import db from "../../../connection.js";


const RptIgdbGameUserUnsavedFlat = db.define(
  "rpt_igdb_game_user_unsaved_flat",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    igdb_game_id: DataTypes.INTEGER,
    username: DataTypes.STRING,
    comment: DataTypes.TEXT,
    original_feedback: DataTypes.INTEGER,
    saved_date: DataTypes.DATE,
    selected_preferences: DataTypes.TEXT,
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
  { tableName: "rpt_igdb_game_user_unsaved_flat", timestamps: false }
);

export default RptIgdbGameUserUnsavedFlat;
