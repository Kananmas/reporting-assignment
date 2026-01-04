import { DataTypes } from "sequelize";
import db from "../../../connection.js";

const RptIgdbGame = db.define(
  "rpt_igdb_game",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true , autoIncrement:true },
    cover: DataTypes.TEXT,
    genres: DataTypes.TEXT,
    name: DataTypes.TEXT,
    display_name: DataTypes.TEXT,
    summary: DataTypes.TEXT,
    themes: DataTypes.TEXT,
    igdb_api_id: DataTypes.INTEGER,
    createdBy: DataTypes.STRING,
    createdDate: DataTypes.DATE,
    updatedBy: DataTypes.STRING,
    updatedDate: DataTypes.DATE,
    isActive: DataTypes.TINYINT,
  },
  { tableName: "rpt_igdb_game", timestamps: false }
);

export default RptIgdbGame;
