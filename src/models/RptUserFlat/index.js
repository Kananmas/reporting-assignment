import { DataTypes } from "sequelize";
import db from "../../../connection.js";


const RptUserFlat = db.define(
  "rpt_user_flat",
  {
    username: { type: DataTypes.STRING, primaryKey: true ,  autoIncrement:true },
    user_profile_id: DataTypes.INTEGER,
    last_login: DataTypes.DATE,
    first_name: DataTypes.STRING,
    middle_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    profile_completed: DataTypes.TINYINT,
    first_use: DataTypes.TINYINT,
    twitch_name: DataTypes.STRING,
    last_activity_email: DataTypes.DATE,
    market_alerts: DataTypes.TINYINT,
    createdBy: DataTypes.STRING,
    createdDate: DataTypes.DATE,
    updatedBy: DataTypes.STRING,
    updatedDate: DataTypes.DATE,
    isActive: DataTypes.TINYINT,
  },
  { tableName: "rpt_user_flat", timestamps: false }
);

export default RptUserFlat;