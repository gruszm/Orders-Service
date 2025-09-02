import express from "express";
import { StatusCodes as HttpStatus } from "http-status-codes";
import { createOrder } from "../services/orderService.js";
import { checkUserHeader } from "../utils/utils.js";

export const secureOrderRouter = express.Router();

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
secureOrderRouter.post("/", checkUserHeader, async (req, res) => {
    try {
        const orderDetails = req.body.orderDetails;

        orderDetails.userId = JSON.parse(req.headers["x-user"]).id;

        const savedOrder = await createOrder(orderDetails);

        if (savedOrder) {
            res.status(HttpStatus.OK).send();
        } else {
            throw new Error("Order could not be created.");
        }
    } catch (error) {
        if (error.name === "ValidationError") {
            let errorMessage = error.message + "\n";

            for (const failedPath in error.errors) {
                const validationError = error.errors[failedPath];
                errorMessage += `${failedPath}: ${validationError.message}\n`;
            }

            res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        } else {
            console.log(`Error on endpoint: ${req.baseUrl + req.url}\n${error.message}`);

            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: `Internal server error: ${error.message}` });
        }
    }
});