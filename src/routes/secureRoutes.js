import express from "express";
import { StatusCodes as HttpStatus } from "http-status-codes";
import { createOrder } from "../services/orderService.js";

const secureOrderRouter = express.Router();

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function checkUserHeader(req, res, next) {
    if (!req.headers["x-user"]) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "User header is missing." });

        return;
    }
    else {
        next();
    }
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
secureOrderRouter.post("/", checkUserHeader, async (req, res) => {
    const userHeader = JSON.parse(req.headers["x-user"]);

    try {
        const savedOrder = await createOrder(req.body.orderDetails);

        if (savedOrder) {
            res.status(HttpStatus.OK).send();
        } else {
            throw new Error("Order could not be created.");
        }
    } catch (error) {
        if (error.name === "ValidationError") {
            res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        } else {
            console.error(`Error on endpoint: ${req.baseUrl + req.url}\n${error.message}`);

            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error." });
        }
    }
});

export { secureOrderRouter };