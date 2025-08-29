import Order from "../models/orderModel.js";

async function createOrder(orderDetails) {
    const savedOrder = await new Order(orderDetails).save();

    return savedOrder;
}

export { createOrder };