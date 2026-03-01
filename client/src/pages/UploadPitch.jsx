import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { submitPitch, fetchPitchList } from '../Slice/Pitch-Slice';
import '../style/uploadpitch.css';



export default function UploadPitch() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { submitLoading, submitError, submitSuccess } = useSelector(state => state.Pitch);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const handleVideoSelect = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
   
      if (!file.type.startsWith('video/')) {
        alert('Please select a valid video file');
        return;
      }


      if (file.size > 100 * 1024 * 1024) {
        alert('Video file must be less than 100MB');
        return;
      }

      setVideoFile(file);
      setUploadingVideo(true);

   
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result);
        setUploadingVideo(false);
      };
      reader.readAsDataURL(file);

   
      setFieldValue('pitchUrl', file);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append('startup', values.startup);
      formData.append('requireCapital', values.requireCapital);
      formData.append('summary', values.summary);
      
      if (videoFile) {
       
        formData.append('Pitch', videoFile);
      }

      const resultAction = await dispatch(submitPitch(formData));
      
      if (submitPitch.fulfilled.match(resultAction)) {
   
        dispatch(fetchPitchList());
      
        setTimeout(() => {
          navigate('/dashboard/Pitch');
        }, 1500);
      }
    } catch (error) {
      console.error('Error uploading pitch:', error);
    }
    setSubmitting(false);
  };

return (
  <div className="upload-page">
    <div className="upload-container">
      
   
      <div className="upload-header">
        <h1>Upload Your Pitch</h1>
        <p>Share your startup idea with potential investors.</p>
      </div>

      <div className="upload-body">
        <Formik
          initialValues={{
            startup: '',
            requireCapital: '',
            summary: '',
            pitchUrl: ''
          }}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, errors, touched, isSubmitting }) => (
            <Form className="upload-form">

          
              <div className="form-group">
                <label>Startup Name <span>*</span></label>
                <Field
                  name="startup"
                  type="text"
                  placeholder="Enter your startup name"
                  className={`input-field ${
                    touched.startup && errors.startup ? 'input-error' : ''
                  }`}
                />
                <ErrorMessage name="startup" component="p" className="error-text" />
              </div>

        
              <div className="form-group">
                <label>Required Capital ($) <span>*</span></label>
                <Field
                  name="requireCapital"
                  type="number"
                  placeholder="Enter capital requirement"
                  className={`input-field ${
                    touched.requireCapital && errors.requireCapital ? 'input-error' : ''
                  }`}
                />
                <ErrorMessage name="requireCapital" component="p" className="error-text" />
              </div>

             
              <div className="form-group">
                <label>Pitch Summary <span>*</span></label>
                <Field
                  name="summary"
                  as="textarea"
                  rows="4"
                  placeholder="Describe your startup idea..."
                  className={`input-field textarea ${
                    touched.summary && errors.summary ? 'input-error' : ''
                  }`}
                />
                <ErrorMessage name="summary" component="p" className="error-text" />
              </div>

             
              <div className="form-group">
                <label>Pitch Video <span>*</span></label>

                <div className={`video-upload-box ${
                  uploadingVideo ? 'uploading' :
                  videoFile ? 'uploaded' : ''
                }`}>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleVideoSelect(e, setFieldValue)}
                    className="hidden-input"
                    id="pitchVideo"
                    disabled={uploadingVideo}
                  />

                  <label htmlFor="pitchVideo" className="upload-label">
                    {uploadingVideo ? (
                      <>
                        <div className="upload-icon spin">⏳</div>
                        <p>Processing video...</p>
                      </>
                    ) : videoFile ? (
                      <>
                        <div className="upload-icon">✅</div>
                        <p>{videoFile.name}</p>
                      </>
                    ) : (
                      <>
                        <div className="upload-icon">🎥</div>
                        <p>Click to upload your pitch video</p>
                        <small>Max 100MB</small>
                      </>
                    )}
                  </label>
                </div>
              </div>

           
              {videoPreview && (
                <div className="preview-section">
                  <p>Video Preview</p>
                  <video
                    src={videoPreview}
                    controls
                    className="video-preview"
                  />
                </div>
              )}

        
              {submitSuccess && (
                <div className="success-box">
                  ✓ Pitch uploaded successfully! Redirecting...
                </div>
              )}

              {submitError && (
                <div className="error-box">
                  ✗ {typeof submitError === 'string' ? submitError : 'Please try again'}
                </div>
              )}

           
              <button
                type="submit"
                disabled={isSubmitting || uploadingVideo || submitLoading}
                className="submit-btn"
              >
                {isSubmitting || submitLoading ? 'Uploading...' : 'Upload Pitch'}
              </button>

             
              <button
                type="button"
                onClick={() => navigate('/dashboard/Pitch')}
                className="cancel-btn"
              >
                Cancel
              </button>

            </Form>
          )}
        </Formik>
      </div>
    </div>
  </div>
);

}
