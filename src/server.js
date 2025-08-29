import express from "express";
import * as MongoConnection from "./config/db.js";
import { secureOrderRouter } from "./routes/secureRoutes.js";

const app = express();

app.use(express.json());
app.use("/api/secure/orders", secureOrderRouter);

MongoConnection.connect(process.env.ORDERS_DB_SERVICE_NAME).then(() => {
    app.listen(process.env.ORDERS_SERVICE_PORT, () => {
        console.log("Orders service is running on port: " + process.env.ORDERS_SERVICE_PORT);
    });
});