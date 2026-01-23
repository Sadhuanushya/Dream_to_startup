import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  submitEntrepreneurProfile,
  resetEntrepreneurError,
  resetEntrepreneurSuccess,
} from "../Slice/Entreprenuer-Slice";

export default function EntrepreneurProfile() {
  const dispatch = useDispatch();
  const { submitLoading, submitError, submitSuccess, EntrepreneurProfile } =
    useSelector((state) => state.Entrepreneur);

  const [isReadOnly, setIsReadOnly] = useState(false);
  const [hasLoadedProfile, setHasLoadedProfile] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    bio: "",
    linkedinUrl: "",
    address: {
      address: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    },
    skills: [],
    education: [{ institutionName: "", course: "", year: "" }],
    workExperience: [{ company: "", position: "", years: "" }],
    pastProject: [{ projectname: "", websiteUrl: "", revenue: "" }],
    profilePicture: null,
    identityDocument: null,
    BusinessRegistrationDocument: null,
  });

  const [statusMessage, setStatusMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [uploadingFields, setUploadingFields] = useState({
    profilePicture: false,
    identityDocument: false,
    BusinessRegistrationDocument: false,
  });
  const [uploadSuccess, setUploadSuccess] = useState({});

  // Populate form only once from Redux
  useEffect(() => {
    if (EntrepreneurProfile && EntrepreneurProfile._id && !hasLoadedProfile) {
      setIsReadOnly(true);
      setHasLoadedProfile(true);
      setFormData({
        fullname: EntrepreneurProfile.fullname || "",
        email: EntrepreneurProfile.email || "",
        phone: EntrepreneurProfile.phone || "",
        bio: EntrepreneurProfile.bio || "",
        linkedinUrl: EntrepreneurProfile.linkedinUrl || "",
        address:
          EntrepreneurProfile.address || {
            address: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
          },
        skills: EntrepreneurProfile.skills || [],
        education:
          EntrepreneurProfile.education || [
            { institutionName: "", course: "", year: "" },
          ],
        workExperience:
          EntrepreneurProfile.workExperience || [
            { company: "", position: "", years: "" },
          ],
        pastProject:
          EntrepreneurProfile.pastProject || [
            { projectname: "", websiteUrl: "", revenue: "" },
          ],
        profilePicture: EntrepreneurProfile.profilePicture?.DocumentUrl || null,
        identityDocument: EntrepreneurProfile.identityDocument?.DocumentUrl || null,
        BusinessRegistrationDocument: EntrepreneurProfile.BusinessRegistrationDocument?.DocumentUrl || null,
      });
    }
  }, [EntrepreneurProfile, hasLoadedProfile]);

  useEffect(() => {
    if (submitSuccess) {
      setStatusMessage({
        type: "success",
        text: "Entrepreneur profile submitted successfully!",
      });
      setTimeout(() => {
        dispatch(resetEntrepreneurSuccess());
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
        dispatch(resetEntrepreneurError());
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

  const addSkill = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, ""],
    }));
  };

  const updateSkill = (index, value) => {
    const skills = [...formData.skills];
    skills[index] = value;
    setFormData((prev) => ({ ...prev, skills }));
  };

  const removeSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { institutionName: "", course: "", year: "" },
      ],
    }));
  };

  const updateEducation = (index, field, value) => {
    const education = [...formData.education];
    education[index][field] = field === "year" ? (value ? Number(value) : "") : value;
    setFormData((prev) => ({ ...prev, education }));
  };

  const removeEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addWorkExperience = () => {
    setFormData((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        { company: "", position: "", years: "" },
      ],
    }));
  };

  const updateWorkExperience = (index, field, value) => {
    const workExperience = [...formData.workExperience];
    workExperience[index][field] = field === "years" ? (value ? Number(value) : "") : value;
    setFormData((prev) => ({ ...prev, workExperience }));
  };

  const removeWorkExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index),
    }));
  };

  const addPastProject = () => {
    setFormData((prev) => ({
      ...prev,
      pastProject: [
        ...prev.pastProject,
        { projectname: "", websiteUrl: "", revenue: "" },
      ],
    }));
  };

  const updatePastProject = (index, field, value) => {
    const pastProject = [...formData.pastProject];
    pastProject[index][field] = field === "revenue" ? (value ? Number(value) : "") : value;
    setFormData((prev) => ({ ...prev, pastProject }));
  };

  const removePastProject = (index) => {
    setFormData((prev) => ({
      ...prev,
      pastProject: prev.pastProject.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const toSend = new FormData();

    toSend.append("fullname", formData.fullname);
    toSend.append("email", formData.email);
    toSend.append("phone", formData.phone);
    toSend.append("bio", formData.bio);
    toSend.append("linkedinUrl", formData.linkedinUrl);

    Object.entries(formData.address).forEach(([key, val]) => {
      toSend.append(`address[${key}]`, val);
    });

    formData.skills.forEach((skill, i) => {
      toSend.append(`skills[${i}]`, skill);
    });

    formData.education.forEach((edu, i) => {
      toSend.append(`education[${i}][institutionName]`, edu.institutionName);
      toSend.append(`education[${i}][course]`, edu.course);
      toSend.append(`education[${i}][year]`, edu.year);
    });

    formData.workExperience.forEach((exp, i) => {
      toSend.append(`workExperience[${i}][company]`, exp.company);
      toSend.append(`workExperience[${i}][position]`, exp.position);
      toSend.append(`workExperience[${i}][years]`, exp.years);
    });

    formData.pastProject.forEach((proj, i) => {
      toSend.append(`pastProject[${i}][projectname]`, proj.projectname);
      toSend.append(`pastProject[${i}][websiteUrl]`, proj.websiteUrl);
      toSend.append(`pastProject[${i}][revenue]`, proj.revenue);
    });

    if (formData.profilePicture instanceof File)
      toSend.append("profilePicture", formData.profilePicture);
    if (formData.identityDocument instanceof File)
      toSend.append("identityDocument", formData.identityDocument);
    if (formData.BusinessRegistrationDocument instanceof File)
      toSend.append(
        "BusinessRegistrationDocument",
        formData.BusinessRegistrationDocument
      );

    dispatch(submitEntrepreneurProfile(toSend));
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
            {isReadOnly ? "Entrepreneur Profile" : "Entrepreneur Onboarding"}
          </h1>
          <p className="text-indigo-200">
            {isReadOnly
              ? "View entrepreneur information and business details."
              : "Build your entrepreneur profile and showcase your ventures."}
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
                name="fullname"
                value={formData.fullname}
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
                value={formData.email}
                onChange={handleChange}
                disabled={isReadOnly}
                className="w-full bg-gray-50 border rounded-lg p-3"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                disabled={isReadOnly}
                className="w-full bg-gray-50 border rounded-lg p-3"
              />
            </div>

            {/* LinkedIn */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                LinkedIn URL
              </label>
              <input
                name="linkedinUrl"
                type="url"
                value={formData.linkedinUrl}
                onChange={handleChange}
                disabled={isReadOnly}
                className="w-full bg-gray-50 border rounded-lg p-3"
              />
            </div>

            {/* Bio */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={isReadOnly}
                className="w-full bg-gray-50 border rounded-lg p-3"
              />
            </div>
          </div>

          {/* — ADDRESS — */}
          <SectionHeader emoji="📍" title="Address" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["address", "city", "state", "country", "pincode"].map((field) => (
              <div key={field} className="space-y-1 md:col-span-1">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  value={formData.address[field]}
                  onChange={(e) =>
                    handleNestedChange("address", field, e.target.value)
                  }
                  disabled={isReadOnly}
                  className="w-full bg-gray-50 border rounded-lg p-3"
                />
              </div>
            ))}
          </div>

          {/* — SKILLS — */}
          <SectionHeader emoji="🎯" title="Skills" />

          {formData.skills.map((skill, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                placeholder="Add a skill"
                value={skill}
                onChange={(e) => updateSkill(idx, e.target.value)}
                disabled={isReadOnly}
                className="flex-1 border rounded-lg p-3 bg-gray-50"
              />
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => removeSkill(idx)}
                  className="text-red-500 px-3 py-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          {!isReadOnly && (
            <button
              type="button"
              onClick={addSkill}
              className="w-full border-2 border-dashed p-3 rounded-xl"
            >
              + Add Skill
            </button>
          )}

          {/* — EDUCATION — */}
          <SectionHeader emoji="🎓" title="Education" />

          {formData.education.map((edu, idx) => (
            <div key={idx} className="border p-6 rounded-xl bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Institution Name"
                  value={edu.institutionName}
                  onChange={(e) =>
                    updateEducation(idx, "institutionName", e.target.value)
                  }
                  disabled={isReadOnly}
                  className="border-b py-2"
                />
                <input
                  placeholder="Course"
                  value={edu.course}
                  onChange={(e) =>
                    updateEducation(idx, "course", e.target.value)
                  }
                  disabled={isReadOnly}
                  className="border-b py-2"
                />
                <input
                  placeholder="Year"
                  type="number"
                  value={edu.year}
                  onChange={(e) =>
                    updateEducation(idx, "year", e.target.value)
                  }
                  disabled={isReadOnly}
                  className="border-b py-2"
                />
              </div>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => removeEducation(idx)}
                  className="text-red-500 mt-2"
                >
                  Remove Education
                </button>
              )}
            </div>
          ))}

          {!isReadOnly && (
            <button
              type="button"
              onClick={addEducation}
              className="w-full border-2 border-dashed p-3 rounded-xl"
            >
              + Add Education
            </button>
          )}

          {/* — WORK EXPERIENCE — */}
          <SectionHeader emoji="💼" title="Work Experience" />

          {formData.workExperience.map((exp, idx) => (
            <div key={idx} className="border p-6 rounded-xl bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Company Name"
                  value={exp.company}
                  onChange={(e) =>
                    updateWorkExperience(idx, "company", e.target.value)
                  }
                  disabled={isReadOnly}
                  className="border-b py-2"
                />
                <input
                  placeholder="Position"
                  value={exp.position}
                  onChange={(e) =>
                    updateWorkExperience(idx, "position", e.target.value)
                  }
                  disabled={isReadOnly}
                  className="border-b py-2"
                />
                <input
                  placeholder="Years of Experience"
                  type="number"
                  value={exp.years}
                  onChange={(e) =>
                    updateWorkExperience(idx, "years", e.target.value)
                  }
                  disabled={isReadOnly}
                  className="border-b py-2"
                />
              </div>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => removeWorkExperience(idx)}
                  className="text-red-500 mt-2"
                >
                  Remove Experience
                </button>
              )}
            </div>
          ))}

          {!isReadOnly && (
            <button
              type="button"
              onClick={addWorkExperience}
              className="w-full border-2 border-dashed p-3 rounded-xl"
            >
              + Add Work Experience
            </button>
          )}

          {/* — PAST PROJECTS — */}
          <SectionHeader emoji="📊" title="Past Projects" />

          {formData.pastProject.map((proj, idx) => (
            <div key={idx} className="border p-6 rounded-xl bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Project Name"
                  value={proj.projectname}
                  onChange={(e) =>
                    updatePastProject(idx, "projectname", e.target.value)
                  }
                  disabled={isReadOnly}
                  className="border-b py-2"
                />
                <input
                  placeholder="Website URL"
                  type="url"
                  value={proj.websiteUrl}
                  onChange={(e) =>
                    updatePastProject(idx, "websiteUrl", e.target.value)
                  }
                  disabled={isReadOnly}
                  className="border-b py-2"
                />
                <input
                  placeholder="Revenue ($)"
                  type="number"
                  value={proj.revenue}
                  onChange={(e) =>
                    updatePastProject(idx, "revenue", e.target.value)
                  }
                  disabled={isReadOnly}
                  className="border-b py-2"
                />
              </div>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => removePastProject(idx)}
                  className="text-red-500 mt-2"
                >
                  Remove Project
                </button>
              )}
            </div>
          ))}

          {!isReadOnly && (
            <button
              type="button"
              onClick={addPastProject}
              className="w-full border-2 border-dashed p-3 rounded-xl"
            >
              + Add Past Project
            </button>
          )}

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
                  {formData.profilePicture && (
                    <p className="mt-2 text-sm">{formData.profilePicture.name || "Profile picture selected"}</p>
                  )}
                </div>

                {/* Identity Document */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Identity Document
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) =>
                      handleFileUpload(e, "identityDocument")
                    }
                  />
                  {formData.identityDocument && (
                    <p className="mt-2 text-sm">
                      {formData.identityDocument.name || "Document selected"}
                    </p>
                  )}
                </div>

                {/* Business Registration Document */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Business Registration Document
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) =>
                      handleFileUpload(e, "BusinessRegistrationDocument")
                    }
                  />
                  {formData.BusinessRegistrationDocument && (
                    <p className="mt-2 text-sm">
                      {formData.BusinessRegistrationDocument.name || "Document selected"}
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
              className="w-full bg-green-800 text-white py-4 rounded-xl"
            >
              {submitLoading ? "Submitting..." : "COMPLETE ENTREPRENEUR REGISTRATION"}
            </button>
          )}

          {isReadOnly && (
            <div className="text-center p-4 bg-blue-50 rounded-xl text-blue-700">
              📋 Profile View Mode — Read Only
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
