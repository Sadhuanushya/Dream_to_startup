import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchEntrepreneursList, deleteEntrepreneur } from "../Slice/Entreprenuer-Slice";
import { useNavigate } from "react-router-dom";
import "../style/entrepreneurs.css";

const MapPin = () => (
  <svg className="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const VerifiedBadge = () => (
  <svg className="icon-medium verified-icon" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd"
      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd" />
  </svg>
);

export default function Entrepreneurs() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, listLoading, listError } = useSelector((state) => state.Entrepreneur);

  useEffect(() => {
    dispatch(fetchEntrepreneursList());
  }, [dispatch]);

  const role = localStorage.getItem("role");

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Entrepreneur?");
    if (confirmDelete) {
      dispatch(deleteEntrepreneur(id));
    }
  };

  const handleViewProfile = (Eid) => {
    navigate("/dashboard/account/EntrepreneurAccount", { state: { Eid } });
  };

  const handleMessage = (receiverId, name) => {
    localStorage.setItem("receiverId", receiverId);
    localStorage.setItem("receivername", name);
    navigate("/dashboard/entrepreneur/message");
  };

  const placeholderImg = "https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&h=300&fit=crop";

  return (
    <div className="entrepreneurs-page">
      <div className="entrepreneurs-container">

        <header className="entrepreneurs-header">
          <h1>Founders Network</h1>
          <p>Direct access to innovative minds and their ventures.</p>
        </header>

        {listError && <div className="error-box">Failed to load entrepreneurs</div>}

        {listLoading ? (
          <div className="loading-box">Loading entrepreneurs...</div>
        ) : !data || data.length === 0 ? (
          <div className="empty-box">No entrepreneurs found</div>
        ) : (

          <div className="entrepreneurs-grid">
            {data.map((ele) => (
              <div key={ele._id} className="entrepreneur-card">

                <div className="entrepreneur-card-content">

                  <div className="entrepreneur-image-wrapper">
                    <img
                      src={ele.profilePicture?.DocumentUrl || placeholderImg}
                      alt={ele.fullname}
                      className="entrepreneur-image"
                    />
                    {ele.isVerified && (
                      <div className="verified-badge">
                        <VerifiedBadge />
                      </div>
                    )}
                  </div>

                  <div className="entrepreneur-info">
                    <h2 className="entrepreneur-name">{ele.fullname}</h2>

                    <div className="entrepreneur-meta">
                      {ele.skills && ele.skills.length > 0 && (
                        <span className="skill-badge">{ele.pastProject.map(ele=>{
                          return ele.projectname
                        })}</span>
                      )}

                      {ele.address?.city && (
                        <span className="location-badge">
                          <MapPin /> {ele.address.city}
                        </span>
                      )}
                    </div>

                     <p className="entrepreneur-bio">
                      {ele.bio || "Entrepreneur building disruptive solutions."}
                    </p> 
                  </div>

                  <div className="entrepreneur-actions">
                    <button
                      className="btn-primary"
                      onClick={() => handleMessage(ele.userId._id, ele.userId.username)}
                    >
                      Message
                    </button>

                    <button
                      className="btn-outline"
                      onClick={() => handleViewProfile(ele.userId._id)}
                    >
                      Profile
                    </button>

                    {role === "admin" && (
                      <button
                        className="btn-danger"
                        onClick={() => handleDelete(ele._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>

                </div>

              </div>
            ))}
          </div>

        )}
      </div>
    </div>
  );
}
