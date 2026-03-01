import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../style/home.css";
import { getAllStories, deleteStory } from "../Slice/Story-Slice";

export default function StoriesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const stories = useSelector((state) => state.Stories.stories);
const role=localStorage.getItem("role");
  useEffect(() => {
    dispatch(getAllStories());
  }, [dispatch]);

  const handleStory = () => navigate("/storyform");

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      dispatch(deleteStory(id));
    }
  };

  return (
    <div className="milestones-section">
      <div className="milestones-container">
        <div className="milestones-header">
          <div className="title-stack">
            <h2 className="milestones-title">Success Stories</h2>
          </div>

     {role === "admin" && (
            <button className="btn-primary" onClick={handleStory}>
              Add Story
            </button>
          )}
        </div>

        <div className="stories-grid">
          {stories?.length === 0 && (
            <p className="text-slate-500">No stories available</p>
          )}

          {stories?.map((story) => (
            <div key={story._id} className="story-card">
              <div className="story-check-icon">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>

              <h4 className="story-title">{story.title}</h4>
              <p className="story-desc">"{story.description}"</p>

           {role === "admin" && (
              <button       

                className="btn-delete-story"
                onClick={() => handleDelete(story._id)}
              >
                Delete
              </button>)}
            </div>
            
          ))}
        </div>
      </div>
    </div>
  );
}
