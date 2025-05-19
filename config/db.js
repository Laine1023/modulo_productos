import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.configDotenv();

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
        dialect: "mariadb",
    }
);

export const configDb = async () => {
    try {
        await sequelize.authenticate();
        console.log("DB Connected");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};