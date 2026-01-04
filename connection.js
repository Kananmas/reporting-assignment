import { Sequelize } from "sequelize";
import { readFileSync } from "fs"
import populateTables from "./populate-tables.js";
import { injectEnv } from "./utils/inject-env.js";

injectEnv();

const dbInstance = new Sequelize('reporting_db', process.env.DB_USER, process.env.DB_PASS, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Set to console.log for debugging
  dialectOptions: {
    multipleStatements: true
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

try {
    await dbInstance.authenticate();

    const items = readFileSync("./flat-db-example.sql").toString().split(";").filter(st => st.trim());
    for (const item of items) {
        await dbInstance.query(item);
    }

    const populator = new populateTables.ReportingDataPopulator();
    await populator.connect();
    await populator.clearExistingData();
    await populator.run();
} catch (error) {
    console.log(`error : ${error.message ?? error}`)
}

export default dbInstance;