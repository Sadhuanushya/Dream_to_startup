const Subscription = require("../models/payment-model");
const instance = require("../utils/Instance");
const PaymentValidation = require("../validations/Payment-validation");
const crypto = require("crypto");

const PaymentCtrl = {};

// Create Razorpay Order
PaymentCtrl.createOrder = async (req, res) => {
    try {
        const { error, value } = PaymentValidation.createOrder(req.body);
        
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { EntrepreneurId, planName, Amount, email, contact } = value;

        // Create Razorpay Order
        const options = {
            amount: Number(Amount) * 100, // Convert to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1
        };

        const order = await instance.orders.create(options);

        if (!order) {
            return res.status(400).json({
                success: false,
                message: "Unable to create order"
            });
        }

        // Save payment details in database
        const payment = new Subscription({
            EntrepreneurId,
            planName,
            Amount,
            email,
            contact,
            razorpayOrderId: order.id,
            status: "pending"
        });

        await payment.save();

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            orderId: order.id,
            amount: Amount,
            currency: "INR",
            key: process.env.RAZORPAY_API_KEY,
            email,
            contact,
            paymentId: payment._id
        });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Verify Payment and Update Status
PaymentCtrl.verifyPayment = async (req, res) => {
    try {
        const { error, value } = PaymentValidation.verifyPayment(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = value;

        // Verify signature
        const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest("hex");

        if (generated_signature !== razorpay_signature) {
            // Update payment status as failed
            await Subscription.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                {
                    status: "failed",
                    errorMessage: "Signature verification failed"
                }
            );

            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        // Update payment status as completed
        const payment = await Subscription.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            {
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                status: "completed",
                expiredDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year subscription
            },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment record not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            payment
        });

    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get Payment History
PaymentCtrl.getPaymentHistory = async (req, res) => {
    try {
        const { EntrepreneurId } = req.params;

        const payments = await Subscription.find({ EntrepreneurId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Payment history retrieved successfully",
            payments
        });

    } catch (error) {
        console.error("Error fetching payment history:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get Single Payment Details
PaymentCtrl.getPayment = async (req, res) => {
    try {
        const { paymentId } = req.params;

        const payment = await Subscription.findById(paymentId);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Payment details retrieved successfully",
            payment
        });

    } catch (error) {
        console.error("Error fetching payment:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Update Payment Status
PaymentCtrl.updatePaymentStatus = async (req, res) => {
    try {
        const { error, value } = PaymentValidation.updateSubscription(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { paymentId, status } = value;

        const payment = await Subscription.findByIdAndUpdate(
            paymentId,
            { status },
            { new: true, runValidators: true }
        );

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Payment status updated successfully",
            payment
        });

    } catch (error) {
        console.error("Error updating payment:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = PaymentCtrl;