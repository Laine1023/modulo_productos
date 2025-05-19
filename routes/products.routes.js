import { Router } from "express";
import { products } from "../entity/products.entity.js";
import { validate } from "../middlewares/validate.js";
import { body, param } from "express-validator";
import { checkProductInDB } from "../middlewares/checkProduct.js";
import { authorize } from "../middlewares/auth.js";
import { cacheValkey } from "../config/cacheValkey.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.configDotenv();

const router = Router();

router.get("/", async (req, res) => {
    const productsCache = await cacheValkey.get("products");

    if (productsCache) {
        return res.json({
            data: JSON.parse(productsCache),
        });
    }

    const products = await Products.findAll();

    await cacheValkey.set("products", JSON.stringify(products), "EX", 60);

    return res.json({
        data: products,
    });
});

router.get(
    "/:id",
    [
        param("id").isInt().exists(),
        validate,
        checkProductInDB,
        authorize,
    ],
    async (req, res) => {
        const { id } = req.params;

        const productCache = await cacheValkey.get(`product_${id}`);
        if (productCache) {
            return res.json({
                data: JSON.parse(productCache),
            });
        }

        const product = await Products.findOne({ where: { id: +id } });

        await cacheValkey.set(`product_${id}`, JSON.stringify(product), "EX", 60);

        return res.json({
            data: product,
        });
    }
);

router.post(
    "/",
    [
        body("id").isEmpty(),
        body("Producto").isString().exists(),
        body("precio").isNumeric().exists(),
        body("stock").isInt().exists(),
        validate,
        authorize,
    ],
    async (req, res) => {
        const productCreate = req.body;
        const createdProduct = await Products.create(productCreate);

        return res.json({
            data: createdProduct,
        });
    }
);

router.post(
    "/login",
    [
        body("email").isString().isEmail().exists(),
        body("password").isString().exists(),
        validate,
    ],
    async (req, res) => {
        const { email, password } = req.body;

        const productAdmin = await Products.findOne({
            where: { Producto: email },
        });

        if (!productAdmin) {
            return res.status(401).json({
                error: "Invalid Email",
            });
        }

        if (password !== productAdmin.password) {
            return res.status(401).json({
                error: "Invalid Password",
            });
        }

        const payload = {
            id: productAdmin.id,
            Producto: productAdmin.Producto,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h",
        });

        res.status(200).json({
            token: token,
        });
    }
);

router.patch(
    "/:id",
    [
        param("id").isInt().exists(),
        body("id").isEmpty(),
        body("Producto").isString().optional(),
        body("precio").isNumeric().optional(),
        body("stock").isInt().optional(),
        validate,
        checkProductInDB,
    ],
    async (req, res) => {
        const { id } = req.params;
        const productUpdate = req.body;

        const updatedProduct = await Products.update(productUpdate, {
            where: { id: +id },
        });

        return res.json({
            data: updatedProduct,
        });
    }
);

router.delete(
    "/:id",
    [
        param("id").isInt().exists(),
        validate,
        checkProductInDB,
    ],
    async (req, res) => {
        const { id } = req.params;

        await Products.destroy({ where: { id: +id } });
        await cacheValkey.del(`product_${id}`);
        await cacheValkey.del("products");

        return res.json({
            message: "Product deleted successfully",
        });
    }
);

export default router;
