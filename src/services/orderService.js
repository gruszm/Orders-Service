import Order from "../models/orderModel.js";

export async function createOrder(orderDetails) {
    const savedOrder = await new Order(orderDetails).save();

    return savedOrder;
}

export async function updateOrderStatus(orderId, status) {
    const order = await Order.findOne({ id: orderId });

    if (!order) {
        throw new Error(`Order with ID = ${orderId} not found.`);
    }

    order.status = status;

    return await order.save();
}