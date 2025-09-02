import express from "express";
import { StatusCodes as HttpStatus } from "http-status-codes";
import { checkUserHeader } from "../utils/utils.js";
import { createDeliveryMethod, getAllDeliveryMethods } from "../services/deliveryMethodService.js";

export const publicDeliveryMethodRouter = express.Router();
export const secureDeliveryMethodRouter = express.Router();

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
publicDeliveryMethodRouter.get("/", async (req, res) => {
    try {
        const deliveryMethods = await getAllDeliveryMethods();

        res.status(HttpStatus.OK).json(deliveryMethods);
    } catch (error) {
        console.log(`Error on endpoint: ${req.baseUrl + req.url}\n${error.message}`);

        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error." });
    }
});

secureDeliveryMethodRouter.use(express.json());

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
secureDeliveryMethodRouter.post("/", async (req, res) => {
    const userHeader = JSON.parse(req.headers["x-user"]);

    if (!userHeader.hasElevatedRights) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "User is not authorized to create new delivery methods." });

        return;
    }

    if (!req.body.method_name || !req.body.price) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Delivery method: name and price are required." });

        return;
    }

    try {
        const deliveryMethodDetails = { name: req.body.method_name, price: req.body.price };
        const savedMethod = await createDeliveryMethod(deliveryMethodDetails);

        if (savedMethod) {
            res.status(HttpStatus.OK).send();
        } else {
            throw new Error("Delivery method could not be created.");
        }
    } catch (error) {
        if (error.name === "ValidationError") {
            res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        } else {
            console.log(`Error on endpoint: ${req.baseUrl + req.url}\n${error.message}`);

            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error." });
        }
    }
});