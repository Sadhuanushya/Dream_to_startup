import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, verifyPayment, getPaymentHistory, resetPaymentState } from "../Slice/Payment-Slice";
import axios from "axios";
import { useContext } from "react";
import UserContext from "../Context/UserContext";
export default function Subscription() {
    const dispatch = useDispatch();
    const { loading, error, success, message, currentOrder, razorpayKey, paymentHistory } = useSelector(state => state.payment);
    // const { user } = useSelector(state => state.Users);
    const { user } = useContext(UserContext);   
console.log(user);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [formData, setFormData] = useState({
        planName: "",
        Amount: 0,
        email: "",
        contact: ""
    });
    const [paymentHistory2, setPaymentHistory2] = useState([]);
    const [activeTab, setActiveTab] = useState("plans");

    const plans = [
        {
            name: "Monthly",
            price: 499,
            duration: "month",
            features: [
                "Upload unlimited pitches",
                "Send messages to investors",
                "Request meetings with investors",
                "View investor profiles",
                "Email support"
            ]
        },
        {
            name: "Yearly",
            price: 4999,
            duration: "year",
            features: [
                "Upload unlimited pitches",
                "Send unlimited messages to investors",
                "Priority request meetings",
                "View investor profiles",
                "Advanced analytics",
                "24/7 priority support",
                "Best value - Save 20%"
            ]
        }
    ];

    useEffect(() => {
        if (user?._id) {
            dispatch(getPaymentHistory(user._id));
        }
    }, [user?._id, dispatch]);

    useEffect(() => {
        if (success) {
            const timeout = setTimeout(() => {
                dispatch(resetPaymentState());
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [success, dispatch]);

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan.name);
        setFormData({
            planName: plan.name,
            Amount: plan.price,
            email: user?.email || "",
            contact: ""
        });
        setActiveTab("checkout");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePaymentClick = async () => {
        // Validate form data
        if (!formData.planName || !formData.Amount || !formData.email || !formData.contact) {
            alert("Please fill all required fields");
            return;
        }

        if (!/^[0-9]{10}$/.test(formData.contact)) {
            alert("Please enter a valid 10-digit phone number");
            return;
        }

        // Create order
        const paymentData = {
            EntrepreneurId: user?._id,
            planName: formData.planName,
            Amount: formData.Amount,
            email: formData.email,
            contact: formData.contact
        };

        const response = await dispatch(createOrder(paymentData));

        if (response.payload?.success) {
            // Initialize Razorpay payment
            const options = {
                key: response.payload.key,
                amount: response.payload.amount * 100,
                currency: "INR",
                name: "Dream to Startup",
                description: `${formData.planName} Plan Subscription`,
                order_id: response.payload.orderId,
                handler: handlePaymentSuccess,
                prefill: {
                    email: formData.email,
                    contact: formData.contact
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on("payment.failed", handlePaymentError);
            razorpay.open();
        }
    };

    const handlePaymentSuccess = async (response) => {
        const verifyData = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
        };

        const result = await dispatch(verifyPayment(verifyData));

        if (result.payload?.success) {
            alert("Payment successful! Your subscription is active.");
            setFormData({
                planName: "",
                Amount: 0,
                email: "",
                contact: ""
            });
            setSelectedPlan(null);
            setActiveTab("history");
            // Refresh payment history
            if (user?._id) {
                dispatch(getPaymentHistory(user._id));
            }
        }
    };

    const handlePaymentError = (error) => {
        alert(`Payment failed: ${error.description}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Subscription Plans
                    </h1>
                    <p className="text-gray-600">
                        Choose the perfect plan for your startup journey
                    </p>
                </div>

                {/* Alert Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        {message}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-8 border-b">
                    <button
                        onClick={() => setActiveTab("plans")}
                        className={`px-6 py-3 font-medium transition ${
                            activeTab === "plans"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Plans
                    </button>
                    <button
                        onClick={() => setActiveTab("checkout")}
                        className={`px-6 py-3 font-medium transition ${
                            activeTab === "checkout"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Checkout
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`px-6 py-3 font-medium transition ${
                            activeTab === "history"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        History
                    </button>
                </div>

                {/* Plans Tab */}
                {activeTab === "plans" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {plan.name}
                                </h2>
                                <div className="mb-4">
                                    <span className="text-4xl font-bold text-gray-900">
                                        ₹{plan.price}
                                    </span>
                                    <span className="text-gray-600 ml-2">/{plan.duration}</span>
                                </div>
                                <ul className="mb-6 space-y-3">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-gray-700">
                                            <span className="text-green-500 mr-2">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handlePlanSelect(plan)}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
                                >
                                    Select Plan
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Checkout Tab */}
                {activeTab === "checkout" && selectedPlan && (
                    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            Checkout - {selectedPlan} Plan
                        </h2>

                        <form className="space-y-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Entrepreneur ID
                                </label>
                                <input
                                    type="text"
                                    value={user?._id || ""}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={user?.username || ""}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleInputChange}
                                    placeholder="Enter 10-digit phone number"
                                    maxLength="10"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                                />
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-700">Plan:</span>
                                    <span className="font-medium">{formData.planName}</span>
                                </div>
                                <div className="flex justify-between border-t pt-2">
                                    <span className="text-lg font-medium">Total Amount:</span>
                                    <span className="text-lg font-bold text-blue-600">
                                        ₹{formData.Amount}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("plans")}
                                    className="flex-1 bg-gray-300 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-400 transition font-medium"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePaymentClick}
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400"
                                >
                                    {loading ? "Processing..." : "Pay Now"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* History Tab */}
                {activeTab === "history" && (
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            Payment History
                        </h2>
                        {paymentHistory && paymentHistory.length > 0 ? (
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-100 border-b">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-gray-700 font-medium">
                                                Plan
                                            </th>
                                            <th className="px-6 py-3 text-left text-gray-700 font-medium">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-gray-700 font-medium">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-gray-700 font-medium">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-gray-700 font-medium">
                                                Expires
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paymentHistory.map((payment, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="px-6 py-3 text-gray-900">
                                                    {payment.planName}
                                                </td>
                                                <td className="px-6 py-3 font-medium">
                                                    ₹{payment.Amount}
                                                </td>
                                                <td className="px-6 py-3">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                            payment.status === "completed"
                                                                ? "bg-green-100 text-green-800"
                                                                : payment.status === "pending"
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {payment.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-gray-600 text-sm">
                                                    {new Date(payment.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-3 text-gray-600 text-sm">
                                                    {payment.expiredDate
                                                        ? new Date(payment.expiredDate).toLocaleDateString()
                                                        : "N/A"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                                <p className="text-gray-600 mb-4">No payment history yet</p>
                                <button
                                    onClick={() => setActiveTab("plans")}
                                    className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
                                >
                                    View Plans
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}