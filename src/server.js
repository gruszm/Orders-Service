import express from "express";
import * as MongoConnection from "./config/db.js";
import { secureOrderRouter } from "./routes/secureOrderRoutes.js";
import { publicDeliveryMethodRouter, secureDeliveryMethodRouter } from "./routes/deliveryMethodRoutes.js";

const app = express();

app.use(express.json());
app.use("/api/secure/orders", secureOrderRouter);
app.use("/api/public/delivery", publicDeliveryMethodRouter);
app.use("/api/secure/delivery", secureDeliveryMethodRouter);

MongoConnection.connect(process.env.ORDERS_DB_SERVICE_NAME).then(() => {
    app.listen(process.env.ORDERS_SERVICE_PORT, () => {
        console.log("Orders service is running on port: " + process.env.ORDERS_SERVICE_PORT);
    });
});