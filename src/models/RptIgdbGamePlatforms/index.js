import { DataTypes } from "sequelize";
import db from "../../../connection.js";


const RptIgdbGamePlatforms = db.define(
  "rpt_igdb_game_platforms",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    igdb_game_id: DataTypes.INTEGER,
    platform_id: DataTypes.INTEGER,
    createdBy: DataTypes.STRING,
    createdDate: DataTypes.DATE,
    updatedBy: DataTypes.STRING,
    updatedDate: DataTypes.DATE,
    isActive: DataTypes.TINYINT,
  },
  { tableName: "rpt_igdb_game_platforms", timestamps: false }
);

export default RptIgdbGamePlatforms;
