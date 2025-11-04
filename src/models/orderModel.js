import * as mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

const isPositiveInteger = (number) => (Number.isInteger(number) && number > 0);
const isNonNegativeInteger = (number) => (Number.isInteger(number) && number >= 0);

const addressSchema = new mongoose.Schema(
    {
        street: {
            type: String,
            required: [true, "Address: street is required."],
            match: [/^[\p{L}\s-]*$/u, "Address: street is not in correct format."]
        },
        houseNumber: {
            type: Number,
            required: [true, "Address: house number is required."],
            validate: {
                validator: isPositiveInteger,
                message: "Address: house number must be a positive integer."
            }
        },
        apartmentNumber: {
            type: Number,
            required: false,
            validate: {
                validator: (val) => val == null || isPositiveInteger(val),
                message: "Address: apartment number must be a positive integer."
            }
        },
        postalCode: {
            type: String,
            required: [true, "Address: postal code is required."],
            match: [/^\d{2}-(?!000)\d{3}$/, "Address: postal code is not in correct format."]
        },
        city: {
            type: String,
            required: [true, "Address: city is required."],
            match: [/^[\p{L}\s-]*$/u, "Address: city is not in correct format."]
        },
        voivodeship: {
            type: String,
            required: [true, "Address: voivodeship is required."],
            match: [/^[\p{L}\s-]*$/u, "Address: voivodeship is not in correct format."]
        },
        country: {
            type: String,
            required: [true, "Address: country is required."],
            match: [/^[\p{L}\s-]*$/u, "Address: country is not in correct format."]
        }
    },
    {
        _id: false
    }
);

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: Number,
            required: [true, "User ID is required."],
            validate: {
                validator: isNonNegativeInteger,
                message: "User ID must be a non-negative integer."
            }
        },
        address: addressSchema,
        products: {
            type: [
                {
                    productId: {
                        type: Number,
                        required: [true, "Product ID is required."],
                        validate: {
                            validator: isNonNegativeInteger,
                            message: "Product ID must be a non-negative integer."
                        }
                    },
                    quantity: {
                        type: Number,
                        required: [true, "Quantity is required."],
                        validate: {
                            validator: isPositiveInteger,
                            message: "Quantity must be a positive integer."
                        }
                    },
                    price: {
                        type: Number,
                        required: [true, "Price is required."],
                        validate: {
                            validator: value => (value !== undefined) && (value >= 0),
                            message: "The price cannot be negative."
                        },
                        get: v => (v / 100).toFixed(2),
                        set: v => (v * 100).toFixed(0)
                    },
                },
            ],
            validate: [arr => arr.length > 0, "Order must have at least one product."]
        },
        status: {
            type: String,
            enum: {
                values: ["pending", "paid", "shipped", "delivered", "cancelled"],
                message: "Status `{VALUE}` is not valid."
            },
            default: "pending",
            required: true
        }
    },
    {
        timestamps: true,
        toJSON: {
            getters: true
        },
        toObject: {
            getters: true
        }
    }
);

orderSchema.plugin(AutoIncrement, { id: "order_schema_id", inc_field: "id", start_seq: 0 });

const Order = mongoose.model("Order", orderSchema);

export default Order;