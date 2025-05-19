import { products } from "../entity/products.entity.js";

export const checkProductInDB = async (req, res, next) => {
    const { id } = req.params;

    const product = await products.findOne({ where: { id: +id } });

    if (!product) {
        return res.status(404).json({
            error: "Product doesn't exist",
        });
    }

    next();
};
