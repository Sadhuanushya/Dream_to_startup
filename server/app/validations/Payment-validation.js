const Joi = require("joi");

const PaymentValidation = {};

// Validation for creating payment order
PaymentValidation.createOrder = (data) => {
    const schema = Joi.object({
        EntrepreneurId: Joi.string().required(),
        planName: Joi.string().valid("Basic", "Professional", "Enterprise").required(),
        Amount: Joi.number().positive().required(),
        email: Joi.string().email().required(),
        contact: Joi.string().pattern(/^[0-9]{10}$/).required()
    });
    return schema.validate(data);
};

// Validation for verifying payment
PaymentValidation.verifyPayment = (data) => {
    const schema = Joi.object({
        razorpay_payment_id: Joi.string().required(),
        razorpay_order_id: Joi.string().required(),
        razorpay_signature: Joi.string().required()
    });
    return schema.validate(data);
};

// Validation for subscription update
PaymentValidation.updateSubscription = (data) => {
    const schema = Joi.object({
        paymentId: Joi.string().required(),
        status: Joi.string().valid("pending", "completed", "failed").required()
    });
    return schema.validate(data);
};

module.exports = PaymentValidation;
