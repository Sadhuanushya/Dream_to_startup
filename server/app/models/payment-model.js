const mongoose = require("mongoose");

const PaymentSchema = mongoose.Schema({
    EntrepreneurId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    planName: {
        type: String,
        enum: ["Monthly", "Yearly"],
        required: true
    },
    Amount: {
        type: Number,
        required: true,
        positive: true
    },
    razorpayOrderId: {
        type: String,
        unique: true,
        sparse: true
    },
    razorpayPaymentId: {
        type: String,
        unique: true,
        sparse: true
    },
    razorpaySignature: {
        type: String
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    },
    paymentMethod: {
        type: String,
        default: "razorpay"
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    expiredDate: {
        type: Date
    },
    errorMessage: {
        type: String
    }
}, { timestamps: true });

// Index for faster queries
PaymentSchema.index({ EntrepreneurId: 1, status: 1 });

const Subscription = mongoose.model("Subscription", PaymentSchema);
module.exports = Subscription;