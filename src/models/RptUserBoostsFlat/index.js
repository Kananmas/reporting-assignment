import { DataTypes } from "sequelize";
import db from "../../../connection.js";


const RptUserBoostsFlat = db.define(
  "rpt_user_boosts_flat",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true ,  autoIncrement:true },
    username: DataTypes.STRING,
    booster_type: DataTypes.STRING,
    booster_units: DataTypes.DOUBLE,
    booster_units_consumed: DataTypes.DOUBLE,
    expires_on: DataTypes.DATE,
    boost_triggered: DataTypes.TINYINT,
    twitch_name: DataTypes.STRING,
    createdBy: DataTypes.STRING,
    createdDate: DataTypes.DATE,
    updatedBy: DataTypes.STRING,
    updatedDate: DataTypes.DATE,
    isActive: DataTypes.TINYINT,
  },
  { tableName: "rpt_user_boosts_flat", timestamps: false }
);

export default RptUserBoostsFlat;
