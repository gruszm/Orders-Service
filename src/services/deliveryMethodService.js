import DeliveryMethod from "../models/deliveryMethodModel.js";

export async function createDeliveryMethod(deliveryMethodDetails) {
    const savedMethod = await new DeliveryMethod(deliveryMethodDetails).save();

    return savedMethod;
}

export async function getAllDeliveryMethods() {
    const methods = await DeliveryMethod.find().select("-__v");

    return methods;
}