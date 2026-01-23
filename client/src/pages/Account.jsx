import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import InvestorAccount from "./Accounts/InvestorAccount";
import EntrepreneurAccount from "./Accounts/EntrepreneurAccount";

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
      <div className="text-center py-20 text-gray-500">
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
      <div className="text-center py-20 text-gray-500">
        Unable to determine account type. Please log in again.
      </div>
    );
  }
}
