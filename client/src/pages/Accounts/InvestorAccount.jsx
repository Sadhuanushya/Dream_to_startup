import React, { useEffect, useState,useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInvestor,
  submitInvestorProfile,
  updateInvestorProfile,
} from "../../Slice/Investor-Slice";
import "../../style/account-pages.css";
import { useNavigate,useLocation } from "react-router-dom";
import UserContext from "../../Context/UserContext";

export default function InvestorAccount() {
  const dispatch = useDispatch();
 const location = useLocation();
 const navigate=useNavigate()
  const InvestorProfile = useSelector(
    (state) => state.investor?.InvestorProfile
  );
  const {user}=useContext(UserContext)
  console.log("in",InvestorProfile)
  const { Iid } = location.state || "";
  
  const userId = localStorage.getItem("userId");
  
  const [newAccount, setNewAccount] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    bio: "",
    linkedinUrl: "",
    investorType: "",
    customInvestorType: "",
    officeLocation: { address: "", city: "", state: "", country: "", pincode: "" },
    prefferedSector: [{ sector: "", description: "", targetInvestment: "" }],
    profilePicture: null,
    verificationDocument: null,
  });

 useEffect(() => {
    const idToFetch = Iid || userId;
    if (idToFetch) {
      dispatch(fetchInvestor(idToFetch));
    }
  }, [dispatch, Iid, userId]);

  useEffect(() => {
    console.log("profile",InvestorProfile)
    if (InvestorProfile?.userId) {
      setNewAccount(false);
      setForm({
        fullName: InvestorProfile.fullName || "",
        email: InvestorProfile.email || "",
        bio: InvestorProfile.bio || "",
        linkedinUrl: InvestorProfile.linkedinUrl || "",
        investorType: InvestorProfile.investorType || "",
        customInvestorType: InvestorProfile.customInvestorType || "",
        officeLocation: InvestorProfile.officeLocation || {
          address: "",
          city: "",
          state: "",
          country: "",
          pincode: "",
        },
        prefferedSector:
          InvestorProfile.prefferedSector.length > 0
            ? InvestorProfile.prefferedSector
            : [{ sector: "", description: "", targetInvestment: "" }],
        profilePicture: null,
        verificationDocument: null,
      });
      setIsEditing(false);
    } else {
      setNewAccount(true);
      setIsEditing(true);
          setForm(prev => ({
      ...prev,
      fullName: user?.username|| "",
      email: user?.email || "",
    }));
    }
  }, [InvestorProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const toSend = new FormData();

    toSend.append("fullName", form.fullName);
    toSend.append("email", form.email);
    toSend.append("bio", form.bio);
    toSend.append("linkedinUrl", form.linkedinUrl);
    toSend.append("investorType", form.investorType);

    if (form.investorType === "Other") {
      toSend.append("customInvestorType", form.customInvestorType);
    }

    toSend.append("officeLocation[address]", form.officeLocation.address);
    toSend.append("officeLocation[city]", form.officeLocation.city);
    toSend.append("officeLocation[state]", form.officeLocation.state);
    toSend.append("officeLocation[country]", form.officeLocation.country);
    toSend.append(
      "officeLocation[pincode]",
      form.officeLocation.pincode
    );

    form.prefferedSector.forEach((sec, i) => {
      toSend.append(`prefferedSector[${i}][sector]`, sec.sector);
      toSend.append(
        `prefferedSector[${i}][description]`,
        sec.description
      );
      toSend.append(
        `prefferedSector[${i}][targetInvestment]`,
        sec.targetInvestment
      );
    });

    if (form.profilePicture)
      toSend.append("profilePicture", form.profilePicture);

    if (form.verificationDocument)
      toSend.append("verificationDocument", form.verificationDocument);

    try {
      if (newAccount) {
        const result = await dispatch(submitInvestorProfile(toSend));
        if (result.error) {
          setSubmitError("Failed to create investor account.");
          return;
        }
      
        setNewAccount(false);
        setIsEditing(false);
      } else {
        const result = await dispatch(
          updateInvestorProfile({ id: userId, formData: toSend })
        );
        if (result.error) {
          setSubmitError("Failed to update investor account.");
          return;
        }
     
        setIsEditing(false);
      }
    } catch (err) {
      setSubmitError("Network/server error");
    }
  };
  const handleLogout=()=>{
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className="account-wrapper">
      <h1 className="account-title">
        {newAccount ? "Create Investor Account" : "Investor Account"}
      </h1>

      {InvestorProfile?.profilePicture?.DocumentUrl && (
        <div className="account-section">
          <h2>Profile Picture</h2>
          <img
            src={InvestorProfile.profilePicture.DocumentUrl}
            alt="Investor Profile"
            className="profile-image"
          />
        </div>
      )}
      {isEditing && (
        <div className="account-section">
          <h2>Upload Profile Picture</h2>
          <input
            type="file"
            onChange={(e) =>
              setForm({ ...form, profilePicture: e.target.files[0] })
            }
            className="account-input"
          />
        </div>
      )}
      <div className="verification-status">
      <h3 style={{ marginTop: "10px" }}>
        Investor: {InvestorProfile.isVerified ? (
          <span style={{ color: "#28a745", fontWeight: "bold" }}>Verified ✅</span>
        ) : (
          <span style={{ color: "#ffc107", fontWeight: "bold" }}>Pending Verification </span>
        )}
      </h3>
    </div>

      <div className="account-section">
        <h2>Basic Info</h2>
        <input
          disabled={!isEditing}
          value={form.fullName}
          onChange={(e) =>
            setForm({ ...form, fullName: e.target.value })
          }
          className="account-input"
          placeholder="Full Name"
        />

        <input
          disabled={!isEditing}
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          className="account-input"
          placeholder="Email"
        />

        <textarea
          disabled={!isEditing}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          className="account-input"
          placeholder="Bio"
        />

        <input
          disabled={!isEditing}
          value={form.linkedinUrl}
          onChange={(e) =>
            setForm({ ...form, linkedinUrl: e.target.value })
          }
          className="account-input"
          placeholder="LinkedIn URL"
        />
      </div>

      <div className="account-section">
        <h2>Investor Type</h2>
        <select
          disabled={!isEditing}
          value={form.investorType}
          onChange={(e) =>
            setForm({ ...form, investorType: e.target.value })
          }
          className="account-input"
        >
          <option value="">Select Type</option>
          <option value="Angel Investor">Angel Investor</option>
          <option value="Seed Investor">Seed Investor</option>
          <option value="Accelerator Investor">
            Accelerator Investor
          </option>
          <option value="Other">Other</option>
        </select>

        {form.investorType === "Other" && (
          <input
            disabled={!isEditing}
            value={form.customInvestorType}
            onChange={(e) =>
              setForm({ ...form, customInvestorType: e.target.value })
            }
            className="account-input"
            placeholder="Custom Investor Type"
          />
        )}
      </div>

      <div className="account-section">
        <h2>Office Location</h2>
        {Object.keys(form.officeLocation).map((field) => (
          <input
            key={field}
            disabled={!isEditing}
            value={form.officeLocation[field]}
            onChange={(e) =>
              setForm({
                ...form,
                officeLocation: {
                  ...form.officeLocation,
                  [field]: e.target.value,
                },
              })
            }
            className="account-input"
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          />
        ))}
      </div>

      <div className="account-section">
        <h2>Preferred Sectors</h2>
        {form.prefferedSector.map((sec, idx) => (
          <div key={idx} className="sub-section">
            <input
              disabled={!isEditing}
              value={sec.sector}
              onChange={(e) => {
                const newArr = [...form.prefferedSector];
                newArr[idx].sector = e.target.value;
                setForm({ ...form, prefferedSector: newArr });
              }}
              className="account-input"
              placeholder="Sector"
            />

            <input
              disabled={!isEditing}
              value={sec.description}
              onChange={(e) => {
                const newArr = [...form.prefferedSector];
                newArr[idx].description = e.target.value;
                setForm({ ...form, prefferedSector: newArr });
              }}
              className="account-input"
              placeholder="Description"
            />

            <input
              disabled={!isEditing}
              value={sec.targetInvestment}
              onChange={(e) => {
                const newArr = [...form.prefferedSector];
                newArr[idx].targetInvestment = e.target.value;
                setForm({ ...form, prefferedSector: newArr });
              }}
              className="account-input"
              placeholder="Target Investment"
            />

            {isEditing && (
              <button
                onClick={() =>
                  setForm({
                    ...form,
                    prefferedSector: form.prefferedSector.filter(
                      (_, i) => i !== idx
                    ),
                  })
                }
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {isEditing && (
          <button
            onClick={() =>
              setForm({
                ...form,
                prefferedSector: [
                  ...form.prefferedSector,
                  { sector: "", description: "", targetInvestment: "" },
                ],
              })
            }
          >
            + Add Sector
          </button>
        )}
      </div>

      <div className="account-section">
        <h2>Upload Verification Document</h2>

        {InvestorProfile?.verificationDocument?.DocumentUrl && (
          <a
            href={InvestorProfile.verificationDocument.DocumentUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Verification Document
          </a>
        )}

        {isEditing && (
          <input
            type="file"
            onChange={(e) =>
              setForm({ ...form, verificationDocument: e.target.files[0] })
            }
            className="account-input"
          />
        )}
      </div>

      {submitError && <p className="error-text">{submitError}</p>}
{(newAccount || localStorage.getItem("userId") === InvestorProfile?.userId?._id) && (
  <div style={{ textAlign: "right", marginTop: "1rem" }}>
    {isEditing ? (
      <button onClick={handleSave} className="save-btn">
        {newAccount ? "Create Account" : "Save Changes"}
      </button>
    ) : (
      <button
        onClick={() => setIsEditing(true)}
        className="edit-toggle-btn"
      >
        Edit Profile
      </button>
    )}
    <button onClick={handleLogout} className="logout-btn">
      Logout
    </button>
  </div>
)}
    </div>
  );
}
