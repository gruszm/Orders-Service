import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

const deliveryMethodSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Delivery method: name is required."],
            match: [/^[\p{L}\s]*$/u, "Delivery method: name is not in correct format."]
        },
        price: {
            type: Number,
            required: [true, "Price is required."],
            validate: {
                validator: value => (value !== undefined) && (value >= 0),
                message: "Delivery method: price cannot be negative."
            },
            get: v => (v / 100).toFixed(2),
            set: v => (v * 100).toFixed(0)
        },
    },
    {
        toJSON: { getters: true },
        toObject: { getters: true }
    }
);

deliveryMethodSchema.plugin(AutoIncrement, { id: "delivery_method_id", inc_field: "id", start_seq: 0 });

const DeliveryMethod = mongoose.model("DeliveryMethod", deliveryMethodSchema);

export default DeliveryMethod;