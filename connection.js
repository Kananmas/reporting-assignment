import { Sequelize } from "sequelize";
import { readFileSync } from "fs"
import populateTables from "./populate-tables.js";
import { injectEnv } from "./utils/inject-env.js";

injectEnv();

const dbInstance = new Sequelize({
    dialect: "mysql",
    password: process.env.DB_USER,
    username: process.env.DB_PASS,
    database: "reporting_db",
    logging:true
});

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