import { useEffect, useState } from "react";
import InvestorAccount from "./Accounts/InvestorAccount";
import EntrepreneurAccount from "./Accounts/EntrepreneurAccount";
import "../style/account.css";

export default function Account() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="account-loading">
        Loading...
      </div>
    );
  }

  if (role === "entrepreneur") {
    return <EntrepreneurAccount />;
  } else if (role === "investor") {
    return <InvestorAccount />;
  } else {
    return (
      <div className="account-error">
        Unable to determine account type. Please log in again.
      </div>
    );
  }
}
