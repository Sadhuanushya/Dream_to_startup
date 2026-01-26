import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  submitInvestorProfile,
  resetInvestorError,
  resetInvestorSuccess,
} from "../Slice/Investor-Slice";

export default function InvestorProfile() {
  const dispatch = useDispatch();
  const { submitLoading, submitError, submitSuccess, InvestorProfile } =
    useSelector((state) => state.investor);

  const [isReadOnly, setIsReadOnly] = useState(false);
  const [hasLoadedProfile, setHasLoadedProfile] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    bio: "",
    linkedinUrl: "",
    investorType: "Angel Investor",
    customInvestorType: "",
    officeLocation: {
      address: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    },
    prefferedSector: [{ sector: "", description: "", targetInvestment: "" }],
    pastInvestment: { projectName: "", investment: "", investmentDocument: "" },
    profilePicture: {DocumentUrl: null},
    verificationDocument: null,
  });

  const [statusMessage, setStatusMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [uploadingFields, setUploadingFields] = useState({
    profilePicture: false,
    verificationDocument: false,
  });
  const [uploadSuccess, setUploadSuccess] = useState({});
useEffect(() => {  
   setFormData(InvestorProfile);
   console.log("InvestorProfile",InvestorProfile)
},[])
  // Populate form only once from Redux
  useEffect(() => {
    if (InvestorProfile && InvestorProfile._id && !hasLoadedProfile) {
      setIsReadOnly(true);
      setHasLoadedProfile(true);
      setFormData({
        fullName: InvestorProfile.fullName || "",
        email: InvestorProfile.email || "",
        bio: InvestorProfile.bio || "",
        linkedinUrl: InvestorProfile.linkedinUrl || "",
        investorType: InvestorProfile.investorType || "Angel Investor",
        customInvestorType: InvestorProfile.customInvestorType || "",
        officeLocation:
          InvestorProfile.officeLocation || {
            address: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
          },
       prefferedSector: Array.isArray(InvestorProfile.prefferedSector)
  ? InvestorProfile.prefferedSector
  : [
      { sector: "", description: "", targetInvestment: "" },
    ],
        pastInvestment:
          InvestorProfile.pastInvestment || {
            projectName: "",
            investment: "",
            investmentDocument: "",
          },
        profilePicture: InvestorProfile.profilePicture?.DocumentUrl || null,
        verificationDocument: InvestorProfile.verificationDocument?.DocumentUrl || null,
      });
    }
  }, [InvestorProfile, hasLoadedProfile]);

  useEffect(() => {
    if (submitSuccess) {
      setStatusMessage({
        type: "success",
        text: "Investor profile submitted successfully!",
      });
      setTimeout(() => {
        dispatch(resetInvestorSuccess());
        setStatusMessage(null);
      }, 3000);
    }
  }, [submitSuccess, dispatch]);

  useEffect(() => {
    if (submitError) {
      let errorText = "An error occurred during submission";
      if (typeof submitError === "string") errorText = submitError;
      else if (submitError.message) errorText = submitError.message;
      else if (submitError.error) errorText = submitError.error;

      setStatusMessage({ type: "error", text: errorText });
      setTimeout(() => {
        dispatch(resetInvestorError());
      }, 3000);
    }
  }, [submitError, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setUploadingFields((prev) => ({ ...prev, [fieldName]: true }));
      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: file,
        }));
        setUploadingFields((prev) => ({ ...prev, [fieldName]: false }));
        setUploadSuccess((prev) => ({ ...prev, [fieldName]: true }));
        setTimeout(() => {
          setUploadSuccess((prev) => ({ ...prev, [fieldName]: false }));
        }, 2000);
      }, 800);
    }
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const updateSector = (index, field, value) => {
    const sectors = [...formData.prefferedSector];
    sectors[index][field] =
      field === "targetInvestment" ? (value ? Number(value) : "") : value;
    setFormData((prev) => ({ ...prev, prefferedSector: sectors }));
  };

  const addSector = () => {
    setFormData((prev) => ({
      ...prev,
     prefferedSector: Array.isArray(InvestorProfile?.prefferedSector)
  ? InvestorProfile?.prefferedSector
  : [
      { sector: "", description: "", targetInvestment: "" },
    ],
    }));
  };

  const removeSector = (index) => {
    setFormData((prev) => ({
      ...prev,
      prefferedSector: prev.prefferedSector.filter((_, i) => i !== index),
    }));
  };

  const updatePastInvestment = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      pastInvestment: {
        ...prev.pastInvestment,
        [field]:
          field === "investment" ? (value ? Number(value) : "") : value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const toSend = new FormData();

    toSend.append("fullName", formData.fullName);
    toSend.append("email", formData.email);
    toSend.append("bio", formData.bio);
    toSend.append("linkedinUrl", formData.linkedinUrl);
    toSend.append("investorType", formData.investorType);
    if (formData.customInvestorType)
      toSend.append("customInvestorType", formData.customInvestorType);

    Object.entries(formData.officeLocation).forEach(([key, val]) => {
      toSend.append(`officeLocation[${key}]`, val);
    });

    formData.prefferedSector?.forEach((sec, i) => {
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

    if (formData.pastInvestment.projectName)
      toSend.append(
        "pastInvestment[projectName]",
        formData.pastInvestment.projectName
      );
    if (formData.pastInvestment.investment)
      toSend.append(
        "pastInvestment[investment]",
        formData.pastInvestment.investment
      );

    if (formData.profilePicture instanceof File)
      toSend.append("profilePicture", formData.profilePicture);
    if (formData.verificationDocument instanceof File)
      toSend.append(
        "verificationDocument",
        formData.verificationDocument
      );

    dispatch(submitInvestorProfile(toSend));
  };

  const SectionHeader = ({ emoji, title }) => (
    <div className="flex items-center gap-2 border-b-2 border-gray-100 pb-2 mb-6 mt-10">
      <span className="text-2xl">{emoji}</span>
      <h3 className="text-xl font-bold text-gray-700 tracking-tight">
        {title}
      </h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-indigo-800 to-indigo-900 p-10 text-white">
          <h1 className="text-4xl font-black mb-2">
            {isReadOnly ? "Investor Profile" : "create profile"}
          </h1>
          <p className="text-indigo-200">
            {isReadOnly
              ? "View investor information and investment details."
              : "Build your investment portfolio and define your thesis."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">

          {/* — PRIMARY IDENTITY — */}
          <SectionHeader emoji="👤" title="Primary Identity" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Full Legal Name<span className="text-red-500">*</span>
              </label>
              <input
                name="fullName"
                value={formData?.fullName}
                onChange={handleChange}
                disabled={isReadOnly}
                className="w-full bg-gray-50 border rounded-lg p-3"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Business Email<span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                value={formData?.email}
                onChange={handleChange}
                disabled={isReadOnly}
                className="w-full bg-gray-50 border rounded-lg p-3"
              />
            </div>

            {/* LinkedIn */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                LinkedIn URL
              </label>
              <input
                name="linkedinUrl"
                type="url"
                value={formData?.linkedinUrl}
                onChange={handleChange}
                disabled={isReadOnly}
                className="w-full bg-gray-50 border rounded-lg p-3"
              />
            </div>

            {/* Investor Type */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Investor Type
              </label>
              <select
                name="investorType"
                value={formData?.investorType}
                onChange={handleChange}
                disabled={isReadOnly}
                className="w-full bg-gray-50 border rounded-lg p-3"
              >
                <option>Angel Investor</option>
                <option>Accelerator Investor</option>
                <option>Seed Investor</option>
                <option>Other</option>
              </select>
            </div>

            {/* Custom Investor Type */}
            {formData?.investorType === "Other" && (
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Please specify investor type
                </label>
                <input
                  name="customInvestorType"
                  value={formData?.customInvestorType}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="w-full bg-gray-50 border rounded-lg p-3"
                />
              </div>
            )}

            {/* Bio */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Investor Bio
              </label>
              <textarea
                name="bio"
                value={formData?.bio}
                onChange={handleChange}
                disabled={isReadOnly}
                className="w-full bg-gray-50 border rounded-lg p-3"
              />
            </div>
          </div>

          {/* — OFFICE LOCATION — */}
          <SectionHeader emoji="🏢" title="Office Location" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["address", "city", "state", "country", "pincode"].map((field) => (
              <div key={field} className="space-y-1 md:col-span-3">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  value={formData?.officeLocation?.[field]}
                  onChange={(e) =>
                    handleNestedChange("officeLocation", field, e.target.value)
                  }
                  disabled={isReadOnly}
                  className="w-full bg-gray-50 border rounded-lg p-3"
                />
              </div>
            ))}
          </div>

          {/* — PREFERRED SECTORS — */}
          <SectionHeader emoji="🎯" title="Preferred Sectors" />

          {formData?.prefferedSector?.map((sec, idx) => (
            <div key={idx} className="border p-6 rounded-xl bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Sector Name"
                  value={sec.sector}
                  onChange={(e) => updateSector(idx, "sector", e.target.value)}
                  disabled={isReadOnly}
                  className="border-b py-2"
                />
                <input
                  placeholder="Target Ticket Size ($)"
                  type="number"
                  value={sec.targetInvestment}
                  onChange={(e) =>
                    updateSector(idx, "targetInvestment", e.target.value)
                  }
                  disabled={isReadOnly}
                  className="border-b py-2"
                />
                <textarea
                  placeholder="Thesis/Description"
                  value={sec.description}
                  onChange={(e) =>
                    updateSector(idx, "description", e.target.value)
                  }
                  disabled={isReadOnly}
                  className="border-b py-2 md:col-span-2"
                />
              </div>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => removeSector(idx)}
                  className="text-red-500 mt-2"
                >
                  Remove Sector
                </button>
              )}
            </div>
          ))}

          {!isReadOnly && (
            <button
              type="button"
              onClick={addSector}
              className="w-full border-2 border-dashed p-3 rounded-xl"
            >
              + Add Another Sector
            </button>
          )}

          {/* — PAST INVESTMENT — */}
          <SectionHeader emoji="📈" title="Featured Past Investment" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              placeholder="Project Name"
              value={formData?.pastInvestment?.projectName}
              onChange={(e) =>
                updatePastInvestment("projectName", e.target.value)
              }
              disabled={isReadOnly}
              className="bg-indigo-50 border rounded-lg p-3"
            />
            <input
              placeholder="Investment Amount ($)"
              type="number"
              value={formData?.pastInvestment?.investment}
              onChange={(e) =>
                updatePastInvestment("investment", e.target.value)
              }
              disabled={isReadOnly}
              className="bg-indigo-50 border rounded-lg p-3"
            />
          </div>

          {/* — DOCUMENT UPLOADS — */}
          {!isReadOnly && (
            <>
              <SectionHeader emoji="📄" title="Documents & Verification" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Profile Picture */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "profilePicture")}
                  />
                  {formData?.profilePicture && (
                    <p className="mt-2 text-sm">{formData?.profilePicture?.DocumentUrl}</p>
                  )}
                </div>

                {/* Verification Document */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Verification Document
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) =>
                      handleFileUpload(e, "verificationDocument")
                    }
                  />
                  {formData?.verificationDocument && (
                    <p className="mt-2 text-sm">
                      {formData.verificationDocument.DocumentUrl}
                    </p>
                  )}
                </div>

              </div>
            </>
          )}

          {statusMessage && (
            <div
              className={`p-3 rounded ${
                statusMessage.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          {!isReadOnly && (
            <button
              type="submit"
              disabled={submitLoading}
              className="w-full bg-green-800 text-black py-4 rounded-xl"
            >
              {submitLoading ? "Submitting..." : "COMPLETE INVESTOR REGISTRATION"}
            </button>
          )}

          {/* {isReadOnly && (
            <div className="text-center p-4 bg-blue-50 rounded-xl text-blue-700">
              📋 Profile View Mode — Read Only
            </div>
          )} */}
        </form>
      </div>
    </div>
  );
}
