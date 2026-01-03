import { DataTypes } from "sequelize";
import db from "../../../connection.js";


const RptStreamingPreference = db.define(
  "rpt_streaming_preference",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    value: DataTypes.TEXT,
    display_name: DataTypes.TEXT,
    preferrence_type: DataTypes.STRING,
    createdBy: DataTypes.STRING,
    createdDate: DataTypes.DATE,
    updatedBy: DataTypes.STRING,
    updatedDate: DataTypes.DATE,
    isActive: DataTypes.TINYINT,
  },
  { tableName: "rpt_streaming_preference", timestamps: false }
);

export default RptStreamingPreference;
