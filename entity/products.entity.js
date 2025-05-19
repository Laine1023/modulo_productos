import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const products = sequelize.define("products", {
    Producto: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "name",
    },
    precio: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

products.sync();