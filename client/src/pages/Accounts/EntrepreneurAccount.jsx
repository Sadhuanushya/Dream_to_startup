import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEntrepreneur,
  updateEntrepreneurProfile,
} from "../../Slice/Entreprenuer-Slice";

export default function EntrepreneurAccount() {
  const dispatch = useDispatch();

  const entrepreneurProfile = useSelector(
    (state) => state.Entrepreneur.EntrepreneurProfile
  );

  const [editForm, setEditForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  /* ================= LOAD ENTREPRENEUR ================= */
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) dispatch(fetchEntrepreneur(userId));
  }, [dispatch]);

  /* ================= SYNC STORE → FORM ================= */
  useEffect(() => {
    if (entrepreneurProfile) {
      setEditForm({
        ...entrepreneurProfile,
        address: entrepreneurProfile.address || {},
        skills: entrepreneurProfile.skills || [],
        education: entrepreneurProfile.education || [],
        workExperience: entrepreneurProfile.workExperience || [],
        pastProject: entrepreneurProfile.pastProject || [],
      });
    }
  }, [entrepreneurProfile]);

  const handleSave = () => {
    const userId = localStorage.getItem("userId");
    dispatch(updateEntrepreneurProfile({ id: userId, formData: editForm }));
    setIsEditing(false);
  };

  if (!entrepreneurProfile) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading Entrepreneur Profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Entrepreneur Account</h1>

      {/* ================= BASIC ================= */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="font-semibold mb-4">Basic Information</h2>

        <input
          value={editForm.fullname || ""}
          disabled={!isEditing}
          onChange={(e) =>
            setEditForm({ ...editForm, fullname: e.target.value })
          }
          className="w-full border p-2 rounded mb-2"
          placeholder="Full Name"
        />

        <input
          value={editForm.email || ""}
          disabled={!isEditing}
          onChange={(e) =>
            setEditForm({ ...editForm, email: e.target.value })
          }
          className="w-full border p-2 rounded mb-2"
          placeholder="Email"
        />

        <input
          value={editForm.phone || ""}
          disabled={!isEditing}
          onChange={(e) =>
            setEditForm({ ...editForm, phone: e.target.value })
          }
          className="w-full border p-2 rounded mb-2"
          placeholder="Phone"
        />

        <input
          value={editForm.linkedinUrl || ""}
          disabled={!isEditing}
          onChange={(e) =>
            setEditForm({ ...editForm, linkedinUrl: e.target.value })
          }
          className="w-full border p-2 rounded mb-2"
          placeholder="LinkedIn URL"
        />

        <textarea
          value={editForm.bio || ""}
          disabled={!isEditing}
          onChange={(e) =>
            setEditForm({ ...editForm, bio: e.target.value })
          }
          className="w-full border p-2 rounded mb-2"
          placeholder="Bio"
        />

        <div className="mt-3 text-sm">
          Account Status:{" "}
          <span
            className={
              editForm.isVerified ? "text-green-600" : "text-yellow-600"
            }
          >
            {editForm.isVerified ? "Verified" : "Pending"}
          </span>
        </div>
      </div>

      {/* ================= ADDRESS ================= */}
      <div className="bg-white p-6 rounded shadow mb-6">
                <h2 className="font-semibold mb-4">Profile Details</h2>

        {editForm.profilePicture?.DocumentUrl && (
          <img
            src={editForm.profilePicture.DocumentUrl}
            className="w-28 h-28 rounded-full mb-4"
            alt="profile"
          />
        )}
        <h2 className="font-semibold mb-4">Address</h2>

        {["address", "city", "state", "country", "pincode"].map((f) => (
          <input
            key={f}
            disabled={!isEditing}
            value={editForm.address?.[f] || ""}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                address: {
                  ...editForm.address,
                  [f]: e.target.value,
                },
              })
            }
            className="w-full border p-2 rounded mb-2"
            placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
          />
        ))}
      </div>

      {/* ================= SKILLS ================= */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="font-semibold mb-4">Skills</h2>

        {editForm.skills?.map((skill, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              disabled={!isEditing}
              value={skill}
              onChange={(e) => {
                const updated = [...editForm.skills];
                updated[idx] = e.target.value;
                setEditForm({ ...editForm, skills: updated });
              }}
              className="flex-1 border p-2 rounded"
            />
            {isEditing && (
              <button
                onClick={() =>
                  setEditForm({
                    ...editForm,
                    skills: editForm.skills.filter((_, i) => i !== idx),
                  })
                }
                className="text-red-600 px-2"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        {isEditing && (
          <button
            onClick={() =>
              setEditForm({
                ...editForm,
                skills: [...editForm.skills, ""],
              })
            }
            className="text-blue-600"
          >
            + Add Skill
          </button>
        )}
      </div>

      {/* ================= EDUCATION ================= */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="font-semibold mb-4">Education</h2>

        {editForm.education?.map((edu, idx) => (
          <div key={idx} className="border p-4 rounded mb-3 bg-gray-50">
            <input
              disabled={!isEditing}
              value={edu.institutionName || ""}
              onChange={(e) => {
                const arr = [...editForm.education];
                arr[idx].institutionName = e.target.value;
                setEditForm({ ...editForm, education: arr });
              }}
              className="w-full border p-2 rounded mb-2"
              placeholder="Institution Name"
            />

            <input
              disabled={!isEditing}
              value={edu.course || ""}
              onChange={(e) => {
                const arr = [...editForm.education];
                arr[idx].course = e.target.value;
                setEditForm({ ...editForm, education: arr });
              }}
              className="w-full border p-2 rounded mb-2"
              placeholder="Course"
            />

            <input
              disabled={!isEditing}
              type="number"
              value={edu.year || ""}
              onChange={(e) => {
                const arr = [...editForm.education];
                arr[idx].year = e.target.value;
                setEditForm({ ...editForm, education: arr });
              }}
              className="w-full border p-2 rounded mb-2"
              placeholder="Year"
            />

            {isEditing && (
              <button
                onClick={() =>
                  setEditForm({
                    ...editForm,
                    education: editForm.education.filter((_, i) => i !== idx),
                  })
                }
                className="text-red-600 text-sm"
              >
                Remove Education
              </button>
            )}
          </div>
        ))}

        {isEditing && (
          <button
            onClick={() =>
              setEditForm({
                ...editForm,
                education: [
                  ...editForm.education,
                  { institutionName: "", course: "", year: "" },
                ],
              })
            }
            className="text-blue-600"
          >
            + Add Education
          </button>
        )}
      </div>

      {/* ================= WORK EXPERIENCE ================= */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="font-semibold mb-4">Work Experience</h2>

        {editForm.workExperience?.map((exp, idx) => (
          <div key={idx} className="border p-4 rounded mb-3 bg-gray-50">
            <input
              disabled={!isEditing}
              value={exp.company || ""}
              onChange={(e) => {
                const arr = [...editForm.workExperience];
                arr[idx].company = e.target.value;
                setEditForm({ ...editForm, workExperience: arr });
              }}
              className="w-full border p-2 rounded mb-2"
              placeholder="Company"
            />

            <input
              disabled={!isEditing}
              value={exp.position || ""}
              onChange={(e) => {
                const arr = [...editForm.workExperience];
                arr[idx].position = e.target.value;
                setEditForm({ ...editForm, workExperience: arr });
              }}
              className="w-full border p-2 rounded mb-2"
              placeholder="Position"
            />

            <input
              disabled={!isEditing}
              type="number"
              value={exp.years || ""}
              onChange={(e) => {
                const arr = [...editForm.workExperience];
                arr[idx].years = e.target.value;
                setEditForm({ ...editForm, workExperience: arr });
              }}
              className="w-full border p-2 rounded mb-2"
              placeholder="Years"
            />

            {isEditing && (
              <button
                onClick={() =>
                  setEditForm({
                    ...editForm,
                    workExperience: editForm.workExperience.filter(
                      (_, i) => i !== idx
                    ),
                  })
                }
                className="text-red-600 text-sm"
              >
                Remove Experience
              </button>
            )}
          </div>
        ))}

        {isEditing && (
          <button
            onClick={() =>
              setEditForm({
                ...editForm,
                workExperience: [
                  ...editForm.workExperience,
                  { company: "", position: "", years: "" },
                ],
              })
            }
            className="text-blue-600"
          >
            + Add Experience
          </button>
        )}
      </div>

      {/* ================= PAST PROJECTS ================= */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="font-semibold mb-4">Past Projects</h2>

        {editForm.pastProject?.map((proj, idx) => (
          <div key={idx} className="border p-4 rounded mb-3 bg-gray-50">
            <input
              disabled={!isEditing}
              value={proj.projectname || ""}
              onChange={(e) => {
                const arr = [...editForm.pastProject];
                arr[idx].projectname = e.target.value;
                setEditForm({ ...editForm, pastProject: arr });
              }}
              className="w-full border p-2 rounded mb-2"
              placeholder="Project Name"
            />

            <input
              disabled={!isEditing}
              value={proj.websiteUrl || ""}
              onChange={(e) => {
                const arr = [...editForm.pastProject];
                arr[idx].websiteUrl = e.target.value;
                setEditForm({ ...editForm, pastProject: arr });
              }}
              className="w-full border p-2 rounded mb-2"
              placeholder="Website URL"
            />

            <input
              disabled={!isEditing}
              type="number"
              value={proj.revenue || ""}
              onChange={(e) => {
                const arr = [...editForm.pastProject];
                arr[idx].revenue = e.target.value;
                setEditForm({ ...editForm, pastProject: arr });
              }}
              className="w-full border p-2 rounded mb-2"
              placeholder="Revenue"
            />

            {isEditing && (
              <button
                onClick={() =>
                  setEditForm({
                    ...editForm,
                    pastProject: editForm.pastProject.filter(
                      (_, i) => i !== idx
                    ),
                  })
                }
                className="text-red-600 text-sm"
              >
                Remove Project
              </button>
            )}
          </div>
        ))}

        {isEditing && (
          <button
            onClick={() =>
              setEditForm({
                ...editForm,
                pastProject: [
                  ...editForm.pastProject,
                  { projectname: "", websiteUrl: "", revenue: "" },
                ],
              })
            }
            className="text-blue-600"
          >
            + Add Project
          </button>
        )}
      </div>

{/* ================= DOCUMENTS ================= */}
<div className="bg-white p-6 rounded shadow mb-6">
  <h2 className="font-semibold mb-4">Documents</h2>

  {/* Identity Document */}
  <div className="mb-4">
    <label className="block mb-1 font-medium">Identity Document</label>
    {editForm.identityDocument?.DocumentUrl ? (
      <a
        href={editForm.identityDocument?.DocumentUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        View Identity Document
      </a>
    ) : (
      <span className="text-gray-500">No document uploaded</span>
    )}
    {isEditing && (
      <input
        type="url"
        value={editForm.identityDocument?.DocumentUrl || ""}
        onChange={(e) =>
          setEditForm({ ...editForm, identityDocument: e.target.value })
        }
        placeholder="Paste Identity Document URL"
        className="w-full border p-2 rounded mt-2"
      />
    )}
  </div>

  {/* Business Registration Document */}
  <div className="mb-4">
    <label className="block mb-1 font-medium">Business Registration Document</label>
    {editForm.BusinessRegistrationDocument?.DocumentUrl ? (
      <a
        href={editForm.BusinessRegistrationDocument?.DocumentUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        View Business Registration Document
      </a>
    ) : (
      <span className="text-gray-500">No document uploaded</span>
    )}
    {isEditing && (
      <input
        type="url"
        value={editForm.businessRegistrationDocument?.DocumentUrl || ""}
        onChange={(e) =>
          setEditForm({ ...editForm, businessRegistrationDocument: e.target.value })
        }
        placeholder="Paste Business Registration Document URL"
        className="w-full border p-2 rounded mt-2"
      />
    )}
  </div>
</div>

      {/* ================= ACTION ================= */}
      <div className="text-right mt-6">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Save Changes
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-indigo-600 text-white px-6 py-2 rounded"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
