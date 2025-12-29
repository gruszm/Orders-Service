import DeliveryMethod from "../models/deliveryMethodModel.js";

export async function createDeliveryMethod(deliveryMethodDetails) {
    const savedMethod = await new DeliveryMethod(deliveryMethodDetails).save();

    return savedMethod;
}

export async function getDeliveryMethodById(id) {
    let method = await DeliveryMethod.find({ id: id }).select("-__v");

    method = (method.length > 0) ? method[0] : null;

    return method;
}

export async function getAllDeliveryMethods() {
    const methods = await DeliveryMethod.find().select("-__v");

    return methods;
}