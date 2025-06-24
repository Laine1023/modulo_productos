import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { customMiddleware } from "./middlewares/customMiddleware.js";
import productsRouter from "./routes/products.routes.js";
import { configDb } from "./config/db.js";
import dotenv from "dotenv";
import { apiRateLimit } from "./middlewares/apiRateLimit.js";

dotenv.config(); // ✅ Corrección

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev')); // ✅ Especifica formato
app.use(apiRateLimit);
app.use("/products", productsRouter);

app.get("/", [customMiddleware], (req, res) => {
    console.log(req.headers.myTime);
    return res.json({
        message: "Hola mundo",
    });
});

configDb();

const server = app.listen(8000, () => { // ✅ Definición de `server`
    console.log("Listening on port 8000");
});

