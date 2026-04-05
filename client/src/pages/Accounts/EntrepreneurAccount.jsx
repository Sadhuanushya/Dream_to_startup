import{ useEffect, useState,useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEntrepreneur,
  updateEntrepreneurProfile,
  submitEntrepreneurProfile,
} from "../../Slice/Entreprenuer-Slice";
import { useNavigate, useLocation } from "react-router-dom";
import "../../style/account-pages.css";
import UserContext from "../../Context/UserContext";
export default function EntrepreneurAccount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
const {user}=useContext(UserContext);
  const { Eid } = location.state || "";
  const userId = localStorage.getItem("userId");

  const entrepreneurProfile = useSelector(
    (state) => state.Entrepreneur.EntrepreneurProfile
  );
  const [newAccount, setNewAccount] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
const [submitError,setSubmitError]=useState("")
  const [editForm, setEditForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    linkedinUrl: "",
    bio: "",
    address: { address: "", city: "", state: "", country: "", pincode: "" },
    skills: [],
    education: [],
    workExperience: [],
    pastProject: [],
    identityDocument: { DocumentUrl: "" },
    BusinessRegistrationDocument: { DocumentUrl: "" },
    profilePicture: { DocumentUrl: "" },
    profilePictureFile: null,
    identityDocumentFile: null,
    businessDocumentFile: null,
  });


  useEffect(() => {
    const idToFetch = Eid || userId;
    if (idToFetch) {
      dispatch(fetchEntrepreneur(idToFetch));
    }
  }, [dispatch, Eid, userId]);

  useEffect(() => {
    if (entrepreneurProfile && entrepreneurProfile.userId) {
      setNewAccount(false);
      setEditForm((prev) => ({
        ...prev,
        fullname: entrepreneurProfile.fullname || "",
        email: entrepreneurProfile.email || "",
        phone: entrepreneurProfile.phone || "",
        linkedinUrl: entrepreneurProfile.linkedinUrl || "",
        bio: entrepreneurProfile.bio || "",
        address: entrepreneurProfile.address || {},
        skills: entrepreneurProfile.skills || [],
        education: entrepreneurProfile.education || [],
        workExperience: entrepreneurProfile.workExperience || [],
        pastProject: entrepreneurProfile.pastProject || [],
        identityDocument:
          entrepreneurProfile.identityDocument || { DocumentUrl: "" },
        BusinessRegistrationDocument:
          entrepreneurProfile.BusinessRegistrationDocument || {
            DocumentUrl: "",
          },
        profilePicture:
          entrepreneurProfile.profilePicture || { DocumentUrl: "" },
      }));
      setIsEditing(false);
    } else {

      setNewAccount(true);
    setIsEditing(true);

    setEditForm(prev => ({
      ...prev,
      fullname: user?.username|| "",
      email: user?.email || "",
    }));

    }
  }, [entrepreneurProfile]);
const handleLogout=()=>{
  localStorage.clear();
  navigate("/login")
}
const handleSave = async (e) => {
  e.preventDefault();
  setSubmitError("");



  const toSend = new FormData();

  toSend.append("fullname", editForm.fullname);
  toSend.append("email", editForm.email);
  toSend.append("phone", editForm.phone);
  toSend.append("bio", editForm.bio);
  toSend.append("linkedinUrl", editForm.linkedinUrl);


  Object.entries(editForm.address).forEach(([key, val]) => {
    toSend.append(`address[${key}]`, val);
  });

 
  editForm.skills.forEach((skill, i) => {
    toSend.append(`skills[${i}]`, skill);
  });


  editForm.education.forEach((edu, i) => {
    toSend.append(`education[${i}][institutionName]`, edu.institutionName);
    toSend.append(`education[${i}][course]`, edu.course);
    toSend.append(`education[${i}][year]`, edu.year);
  });


  editForm.workExperience.forEach((exp, i) => {
    toSend.append(`workExperience[${i}][company]`, exp.company);
    toSend.append(`workExperience[${i}][position]`, exp.position);
    toSend.append(`workExperience[${i}][years]`, exp.years);
  });


  editForm.pastProject.forEach((proj, i) => {
    toSend.append(`pastProject[${i}][projectname]`, proj.projectname);
    toSend.append(`pastProject[${i}][websiteUrl]`, proj.websiteUrl);
    toSend.append(`pastProject[${i}][revenue]`, proj.revenue);
  });


  if (editForm.profilePictureFile instanceof File)
    toSend.append("profilePicture", editForm.profilePictureFile);

  if (editForm.identityDocumentFile instanceof File)
    toSend.append("identityDocument", editForm.identityDocumentFile);

  if (editForm.businessDocumentFile instanceof File)
    toSend.append(
      "BusinessRegistrationDocument",
      editForm.businessDocumentFile
    );

  try {
    if (newAccount) {
      const result = await dispatch(submitEntrepreneurProfile(toSend));

      if (result.error) {
      
        setSubmitError(result.error.message || "Creation failed");
        return; 
      }

   
      setNewAccount(false);
      setIsEditing(false);
    } else {
      const result = await dispatch(
        updateEntrepreneurProfile({ id: userId, formData: toSend })
      );

      if (result.error) {
        setSubmitError(result.error.message || "Update failed");
        return;
      }

      setIsEditing(false);
    }
  } catch (err) {
    setSubmitError("Network/server error");
  }
};



  return (
    <div className="account-wrapper">
      {newAccount ? (
        <h1 className="account-title">Create Entrepreneur Account</h1>
      ) : (
        <h1 className="account-title">Entrepreneur Account</h1>
      )}

  
      <div className="account-section">
        <h2>Profile Picture</h2>
        {editForm.profilePicture?.DocumentUrl && (
          <img
            src={editForm.profilePicture.DocumentUrl}
            alt="Profile"
            className="profile-image"
          />
        )}
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setEditForm({
                ...editForm,
                profilePictureFile: e.target.files[0],
              })
            }
            className="account-input"
          />
        )}
      </div>


      <div className="account-section">
        <h2>Basic Information</h2>
        <input
          value={editForm.fullname}
          disabled={!isEditing||newAccount}
          onChange={(e) =>
            setEditForm({ ...editForm, fullname: e.target.value })
          }
          className="account-input"
          placeholder="Full Name"
        />
        <input
          value={editForm.email}
          disabled={!isEditing|| newAccount}
          onChange={(e) =>
            setEditForm({ ...editForm, email: e.target.value })
          }
          className="account-input"
          placeholder="Email"
        />
        <input
          value={editForm.phone}
          disabled={!isEditing}
          onChange={(e) =>
            setEditForm({ ...editForm, phone: e.target.value })
          }
          className="account-input"
          placeholder="Phone"
        />
        <input
          value={editForm.linkedinUrl}
          disabled={!isEditing}
          onChange={(e) =>
            setEditForm({ ...editForm, linkedinUrl: e.target.value })
          }
          className="account-input"
          placeholder="LinkedIn URL"
        />
        <textarea
          value={editForm.bio}
          disabled={!isEditing}
          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
          className="account-input"
          placeholder="Bio"
        />

        {!newAccount && (
          <div className="account-info">
            Account Status:{" "}
            <span
              className={
                editForm.isVerified ? "status-verified" : "status-pending"
              }
            >
              {editForm.isVerified ? "Verified" : "Pending"}
            </span>
          </div>
        )}
      </div>


      <div className="account-section">
        <h2>Address</h2>
        {["address", "city", "state", "country", "pincode"].map((f) => (
          <input
            key={f}
            disabled={!isEditing}
            value={editForm.address[f] || ""}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                address: { ...editForm.address, [f]: e.target.value },
              })
            }
            className="account-input"
            placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
          />
        ))}
      </div>

    
      <div className="account-section">
        <h2>Skills</h2>
        {editForm.skills.map((skill, idx) => (
          <div key={idx} className="skill-row">
            <input
              disabled={!isEditing}
              value={skill}
              onChange={(e) => {
                const updated = [...editForm.skills];
                updated[idx] = e.target.value;
                setEditForm({ ...editForm, skills: updated });
              }}
              className="account-input"
            />
            {isEditing && (
              <button
                onClick={() =>
                  setEditForm({
                    ...editForm,
                    skills: editForm.skills.filter((_, i) => i !== idx),
                  })
                }
              >
                ✕
              </button>
            )}
          </div>
        ))}
        {isEditing && (
          <button
            onClick={() =>
              setEditForm({ ...editForm, skills: [...editForm.skills, ""] })
            }
          >
            + Add Skill
          </button>
        )}
      </div>

      <div className="account-section">
        <h2>Education</h2>
        {editForm.education.map((edu, idx) => (
          <div key={idx} className="sub-section">
            <input
              disabled={!isEditing}
              value={edu.institutionName}
              onChange={(e) => {
                const arr = [...editForm.education];
                arr[idx].institutionName = e.target.value;
                setEditForm({ ...editForm, education: arr });
              }}
              className="account-input"
              placeholder="Institution Name"
            />
            <input
              disabled={!isEditing}
              value={edu.course}
              onChange={(e) => {
                const arr = [...editForm.education];
                arr[idx].course = e.target.value;
                setEditForm({ ...editForm, education: arr });
              }}
              className="account-input"
              placeholder="Course"
            />
            <input
              disabled={!isEditing}
              type="number"
              value={edu.year}
              onChange={(e) => {
                const arr = [...editForm.education];
                arr[idx].year = e.target.value;
                setEditForm({ ...editForm, education: arr });
              }}
              className="account-input"
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
              >
                Remove
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
          >
            + Add Education
          </button>
        )}
      </div>

  
      <div className="account-section">
        <h2>Work Experience</h2>
        {editForm.workExperience.map((exp, idx) => (
          <div key={idx} className="sub-section">
            <input
              disabled={!isEditing}
              value={exp.company}
              onChange={(e) => {
                const arr = [...editForm.workExperience];
                arr[idx].company = e.target.value;
                setEditForm({ ...editForm, workExperience: arr });
              }}
              className="account-input"
              placeholder="Company"
            />
            <input
              disabled={!isEditing}
              value={exp.position}
              onChange={(e) => {
                const arr = [...editForm.workExperience];
                arr[idx].position = e.target.value;
                setEditForm({ ...editForm, workExperience: arr });
              }}
              className="account-input"
              placeholder="Position"
            />
            <input
              disabled={!isEditing}
              type="number"
              value={exp.years}
              onChange={(e) => {
                const arr = [...editForm.workExperience];
                arr[idx].years = e.target.value;
                setEditForm({ ...editForm, workExperience: arr });
              }}
              className="account-input"
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
              >
                Remove
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
          >
            + Add Experience
          </button>
        )}
      </div>

      <div className="account-section">
        <h2>Past Projects</h2>
        {editForm.pastProject.map((proj, idx) => (
          <div key={idx} className="sub-section">
            <input
              disabled={!isEditing}
              value={proj.projectname}
              onChange={(e) => {
                const arr = [...editForm.pastProject];
                arr[idx].projectname = e.target.value;
                setEditForm({ ...editForm, pastProject: arr });
              }}
              className="account-input"
              placeholder="Project Name"
            />
            <input
              disabled={!isEditing}
              value={proj.websiteUrl}
              onChange={(e) => {
                const arr = [...editForm.pastProject];
                arr[idx].websiteUrl = e.target.value;
                setEditForm({ ...editForm, pastProject: arr });
              }}
              className="account-input"
              placeholder="Website URL"
            />
            <input
              disabled={!isEditing}
              type="number"
              value={proj.revenue}
              onChange={(e) => {
                const arr = [...editForm.pastProject];
                arr[idx].revenue = e.target.value;
                setEditForm({ ...editForm, pastProject: arr });
              }}
              className="account-input"
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
              >
                Remove
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
          >
            + Add Project
          </button>
        )}
      </div>

   
      <div className="account-section">
        <h2>Upload Documents</h2>

        <div>
          {editForm.identityDocument?.DocumentUrl && (
            <a
              href={editForm.identityDocument.DocumentUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Identity Document
            </a>
          )}
          {isEditing && (
            <>
            <h3>identity Document</h3>
            <input
              type="file"
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  identityDocumentFile: e.target.files[0],
                })
              }
              className="account-input"
            />
            </>
          )}
        </div>

        <div>
          {editForm.BusinessRegistrationDocument?.DocumentUrl && (
            <a
              href={editForm.BusinessRegistrationDocument.DocumentUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Business Registration Doc
            </a>
          )}
          {isEditing && (
            <>            <h3>businessRegistration documet</h3>
            <input
              type="file"
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  businessDocumentFile: e.target.files[0],
                })
              }
              className="account-input"
            />
            
            </>

          )}
        </div>
      </div>

{(newAccount || userId === entrepreneurProfile?.userId) && (
  <div style={{ textAlign: "right", marginTop: "1.5rem" }}>
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
      logout
    </button>
  </div>
)}
  

    </div>
  );
}
