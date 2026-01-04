import { DataTypes } from "sequelize";
import db from "../../../connection.js";


const RptIgdbGamePlatformsAgg = db.define(
  "rpt_igdb_game_platforms_agg",
  {
    igdb_game_id: { type: DataTypes.INTEGER, primaryKey: true ,  autoIncrement:true  },
    platform_ids: DataTypes.TEXT,
    platform_count: DataTypes.INTEGER,
    createdBy: DataTypes.STRING,
    createdDate: DataTypes.DATE,
    updatedBy: DataTypes.STRING,
    updatedDate: DataTypes.DATE,
    isActive: DataTypes.TINYINT,
  },
  { tableName: "rpt_igdb_game_platforms_agg", timestamps: false }
);

export default RptIgdbGamePlatformsAgg;
