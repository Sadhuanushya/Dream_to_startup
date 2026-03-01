import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, verifyPayment, getPaymentHistory, resetPaymentState } from "../Slice/Payment-Slice";
import axios from "axios";
import { useContext } from "react";
import UserContext from "../Context/UserContext";
import "../style/subscription.css";
export default function Subscription() {
    const dispatch = useDispatch();
    const { loading, error, success, message, currentOrder, razorpayKey, paymentHistory } = useSelector(state => state.payment);
   
    const { user } = useContext(UserContext);   
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [formData, setFormData] = useState({
        planName: "",
        Amount: 0,
        email: "",
        contact: ""
    });
    // const [paymentHistory2, setPaymentHistory2] = useState([]);
    const [activeTab, setActiveTab] = useState("plans");

    const plans = [
        {
            name: "Monthly",
            price: 499,
            duration: "month",
            features: [
                "Upload unlimited pitches",
                "Send messages to investors",
                "View investor profiles",
            ]
        },
        {
            name: "Yearly",
            price: 4999,
            duration: "year",
            features: [
                "Upload unlimited pitches",
                "Send unlimited messages to investors",
                "View investor profiles",
                "Ai features"
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
      
        if (!formData.planName || !formData.Amount || !formData.email || !formData.contact) {
            alert("Please fill all required fields");
            return;
        }

        if (!/^[0-9]{10}$/.test(formData.contact)) {
            alert("Please enter a valid 10-digit phone number");
            return;
        }

     
        const paymentData = {
            EntrepreneurId: user?._id,
            planName: formData.planName,
            Amount: formData.Amount,
            email: formData.email,
            contact: formData.contact
        };

        const response = await dispatch(createOrder(paymentData));

        if (response.payload?.success) {
          
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
         
            if (user?._id) {
                dispatch(getPaymentHistory(user._id));
            }
        }
    };

    const handlePaymentError = (error) => {
        alert(`Payment failed: ${error.description}`);
    };

return (
  <div className="subscription-page">
    <div className="subscription-container">

      <div className="subscription-header">
        <h1>Subscription Plans</h1>
        <p>Choose the perfect plan for your startup journey</p>
      </div>

    
      {error && <div className="alert error-alert">{error}</div>}
      {success && <div className="alert success-alert">{message}</div>}

   
      <div className="subscription-tabs">
        <button
          onClick={() => setActiveTab("plans")}
          className={activeTab === "plans" ? "tab active" : "tab"}
        >
          Plans
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={activeTab === "history" ? "tab active" : "tab"}
        >
          History
        </button>
      </div>

   
      {activeTab === "plans" && (
        <div className="plans-grid">
          {plans.map((plan, index) => (
            <div key={index} className="plan-card">
              <h2>{plan.name}</h2>

              <div className="plan-price">
                ₹{plan.price}
                <span>/{plan.duration}</span>
              </div>

              <ul>
                {plan.features.map((feature, idx) => (
                  <li key={idx}>✓ {feature}</li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanSelect(plan)}
                className="primary-btn"
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>
      )}

    
      {activeTab === "checkout" && selectedPlan && (
        <div className="checkout-card">
          <h2>Checkout - {selectedPlan} Plan</h2>

          <div className="form-group">
            <label>Entrepreneur ID</label>
            <input value={user?._id || ""} disabled />
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input value={user?.username || ""} disabled />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              maxLength="10"
            />
          </div>

          <div className="summary-box">
            <div>
              <span>Plan:</span>
              <span>{formData.planName}</span>
            </div>
            <div className="total">
              <span>Total:</span>
              <span>₹{formData.Amount}</span>
            </div>
          </div>

          <div className="checkout-buttons">
            <button
              className="secondary-btn"
              onClick={() => setActiveTab("plans")}
            >
              Back
            </button>

            <button
              className="primary-btn"
              onClick={handlePaymentClick}
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </div>
      )}

    
      {activeTab === "history" && (
        <div className="history-section">
          <h2>Payment History</h2>

          {paymentHistory?.length > 0 ? (
            <div className="history-table">
              <table>
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Expires</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment, index) => (
                    <tr key={index}>
                      <td>{payment.planName}</td>
                      <td>₹{payment.Amount}</td>
                      <td>
                        <span className={`status ${payment.status}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                      <td>
                        {(() => {
                          const created = new Date(payment.createdAt);
                          let expiry;
                          if (payment.planName === "Monthly") {
                            expiry = new Date(created.setMonth(created.getMonth() + 1));
                          } else if (payment.planName === "Yearly") {
                            expiry = new Date(created.setFullYear(created.getFullYear() + 1));
                          }
                          return expiry ? expiry.toLocaleDateString() : "N/A";
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-history">
              <p>No payment history yet</p>
              <button
                className="primary-btn"
                onClick={() => setActiveTab("plans")}
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