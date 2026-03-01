import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStory, resetStory } from "../Slice/Story-Slice";
import "../style/storyform.css";

export default function StoryForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();

  const { loading, success, error } = useSelector(
    (state) => state.Stories
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createStory({ title, description }));
  };

  useEffect(() => {
    if (success) {
      alert("Story created successfully!");
      dispatch(resetStory());
      setTitle("");
      setDescription("");
    }
  }, [success, dispatch]);

  return (
    <>
      {/* full-screen grey background */}
      <div className="story-form-page-bg"></div>

      {/* wrapper to center content */}
      <div className="story-form-wrapper">
        <div className="story-form-container">
          <h1>Create Story</h1>

          {error && (
            <p className="error-text">
              {error.message || "Something went wrong"}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Story title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              placeholder="Write your story description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <button
              className="btn-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Story"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
