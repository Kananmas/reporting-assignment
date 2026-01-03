import { Sequelize } from "sequelize";

const dbInstance =  new Sequelize({
    dialect:"mysql",
    password:"yourpassword",
    username:"yourusername",
    database:"reporting_db"
});

try {
    await dbInstance.authenticate();
} catch (error) {
    console.log(`error : ${error.message ?? error}`)
}

export default dbInstance;