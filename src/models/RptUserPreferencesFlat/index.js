import { DataTypes } from "sequelize";
import db from "../../../connection.js";


const RptUserPreferencesFlat = db.define(
  "rpt_user_preferences_flat",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    username: DataTypes.STRING,
    streaming_preference_id: DataTypes.INTEGER,
    preference_value: DataTypes.TEXT,
    preference_display_name: DataTypes.TEXT,
    preferrence_type: DataTypes.STRING,
    createdBy: DataTypes.STRING,
    createdDate: DataTypes.DATE,
    updatedBy: DataTypes.STRING,
    updatedDate: DataTypes.DATE,
    isActive: DataTypes.TINYINT,
  },
  { tableName: "rpt_user_preferences_flat", timestamps: false }
);

export default RptUserPreferencesFlat;