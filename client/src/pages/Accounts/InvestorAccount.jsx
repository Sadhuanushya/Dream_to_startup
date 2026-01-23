import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInvestor,
  updateInvestorProfile,
} from "../../Slice/Investor-Slice";

export default function InvestorAccount() {
  const dispatch = useDispatch();

  const investorProfile = useSelector(
    (state) => state.investor.InvestorProfile
  );

  const [editForm, setEditForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  /* ================= LOAD INVESTOR ================= */
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) dispatch(fetchInvestor(userId));
  }, [dispatch]);

  /* ================= SYNC STORE → FORM ================= */
  useEffect(() => {
    if (investorProfile) {
      setEditForm({
        ...investorProfile,
        officeLocation: investorProfile.officeLocation || {},
        prefferedSector: investorProfile.prefferedSector || [],
        pastInvestment: investorProfile.pastInvestment || {},
      });
    }
  }, [investorProfile]);

  const handleSave = () => {
    const userId = localStorage.getItem("userId");
    dispatch(updateInvestorProfile({ id: userId, formData: editForm }));
    setIsEditing(false);
  };

  if (!investorProfile) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading Investor Profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Investor Account</h1>

      {/* ================= BASIC ================= */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="font-semibold mb-4">Basic Information</h2>

        <input
          value={editForm.fullName || ""}
          disabled
          className="w-full border p-2 rounded mb-2 bg-gray-100"
          placeholder="Full Name"
        />

        <input
          value={editForm.email || ""}
          disabled
          className="w-full border p-2 rounded bg-gray-100"
          placeholder="Email"
        />

        <div className="mt-3 text-sm">
          Status:{" "}
          <span
            className={
              editForm.isVerified ? "text-green-600" : "text-yellow-600"
            }
          >
            {editForm.isVerified ? "Verified" : "Pending Verification"}
          </span>
        </div>
      </div>

      {/* ================= PROFILE ================= */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="font-semibold mb-4">Profile Details</h2>

        {editForm.profilePicture?.DocumentUrl && (
          <img
            src={editForm.profilePicture.DocumentUrl}
            className="w-28 h-28 rounded-full mb-4"
            alt="profile"
          />
        )}

        <input
          disabled={!isEditing}
          value={editForm.linkedinUrl || ""}
          onChange={(e) =>
            setEditForm({ ...editForm, linkedinUrl: e.target.value })
          }
          className="w-full border p-2 rounded mb-3"
          placeholder="LinkedIn URL"
        />

        <select
          disabled={!isEditing}
          value={editForm.investorType || ""}
          onChange={(e) =>
            setEditForm({ ...editForm, investorType: e.target.value })
          }
          className="w-full border p-2 rounded mb-3"
        >
          <option value="">Select Investor Type</option>
          <option>Angel Investor</option>
          <option>Accelerator Investor</option>
          <option>Seed Investor</option>
          <option>Other</option>
        </select>

        {editForm.investorType === "Other" && (
          <input
            disabled={!isEditing}
            value={editForm.customInvestorType || ""}
            onChange={(e) =>
              setEditForm({ ...editForm, customInvestorType: e.target.value })
            }
            className="w-full border p-2 rounded mb-3"
            placeholder="Custom Investor Type"
          />
        )}

        <textarea
          disabled={!isEditing}
          value={editForm.bio || ""}
          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
          className="w-full border p-2 rounded"
          placeholder="Bio"
        />
      </div>

      {/* ================= OFFICE LOCATION ================= */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="font-semibold mb-4">Office Location</h2>

        {["address", "city", "state", "country", "pincode"].map((f) => (
          <input
            key={f}
            disabled={!isEditing}
            value={editForm.officeLocation?.[f] || ""}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                officeLocation: {
                  ...editForm.officeLocation,
                  [f]: e.target.value,
                },
              })
            }
            className="w-full border p-2 rounded mb-2"
            placeholder={f}
          />
        ))}
      </div>

      {/* ================= PREFERRED SECTORS ================= */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="font-semibold mb-4">Preferred Sectors</h2>

        {editForm.prefferedSector?.map((sec, idx) => (
          <div key={idx} className="grid md:grid-cols-2 gap-2 mb-3">
            <input
              disabled={!isEditing}
              value={sec.sector || ""}
              onChange={(e) => {
                const arr = [...editForm.prefferedSector];
                arr[idx].sector = e.target.value;
                setEditForm({ ...editForm, prefferedSector: arr });
              }}
              className="border p-2 rounded"
              placeholder="Sector"
            />

            <input
              disabled={!isEditing}
              value={sec.targetInvestment || ""}
              onChange={(e) => {
                const arr = [...editForm.prefferedSector];
                arr[idx].targetInvestment = e.target.value;
                setEditForm({ ...editForm, prefferedSector: arr });
              }}
              className="border p-2 rounded"
              placeholder="Target Investment"
            />
          </div>
        ))}
      </div>

      {/* ================= PAST INVESTMENT ================= */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="font-semibold mb-4">Past Investment</h2>

        <input
          disabled={!isEditing}
          value={editForm.pastInvestment?.projectName || ""}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              pastInvestment: {
                ...editForm.pastInvestment,
                projectName: e.target.value,
              },
            })
          }
          className="w-full border p-2 rounded mb-2"
          placeholder="Project Name"
        />

        <input
          disabled={!isEditing}
          value={editForm.pastInvestment?.investment || ""}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              pastInvestment: {
                ...editForm.pastInvestment,
                investment: e.target.value,
              },
            })
          }
          className="w-full border p-2 rounded"
          placeholder="Investment Amount"
        />
      </div>

      {/* ================= DOCUMENT ================= */}
      {editForm.verificationDocument?.DocumentUrl && (
        <a
          href={editForm.verificationDocument.DocumentUrl}
          target="_blank"
          rel="noreferrer"
          className="text-indigo-600 underline"
        >
          View Verification Document
        </a>
      )}

      {/* ================= ACTION ================= */}
      <div className="text-right mt-6">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="bg-green-600 text-black px-6 py-2 rounded"
          >
            Save Changes
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-indigo-600 text-black px-6 py-2 rounded"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
