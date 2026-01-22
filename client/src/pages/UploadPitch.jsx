import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { submitPitch, fetchPitchList } from '../Slice/Pitch-Slice';

// // Validation Schema
// const pitchValidationSchema = Yup.object().shape({
//   startup: Yup.string()
//     .min(3, 'Startup name must be at least 3 characters')
//     .max(100, 'Startup name must not exceed 100 characters')
//     .required('Startup name is required'),
//   requireCapital: Yup.number()
//     .min(1000, 'Capital requirement must be at least 1000')
//     .required('Required capital is required'),
//   summary: Yup.string()
//     .min(10, 'Summary must be at least 10 characters')
//     .max(500, 'Summary must not exceed 500 characters')
//     .required('Summary is required'),
//   pitchUrl: Yup.string()
//     .required('Pitch video is required')
// });

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
      // Validate file type
      if (!file.type.startsWith('video/')) {
        alert('Please select a valid video file');
        return;
      }

      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        alert('Video file must be less than 100MB');
        return;
      }

      setVideoFile(file);
      setUploadingVideo(true);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result);
        setUploadingVideo(false);
      };
      reader.readAsDataURL(file);

      // Set field value
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
        // Field name must match server's multer config: 'Pitch'
        formData.append('Pitch', videoFile);
      }

      const resultAction = await dispatch(submitPitch(formData));
      
      if (submitPitch.fulfilled.match(resultAction)) {
        // Refresh pitch list
        dispatch(fetchPitchList());
        // Navigate back to pitch page
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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-indigo-800 to-indigo-900 p-10 text-white">
          <h1 className="text-4xl font-black mb-2">Upload Your Pitch</h1>
          <p className="text-indigo-200">Share your startup idea with potential investors.</p>
        </div>

        <div className="p-8 md:p-12">
          <Formik
            initialValues={{
              startup: '',
              requireCapital: '',
              summary: '',
              pitchUrl: ''
            }}
            
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values, errors, touched, isSubmitting }) => (
              <Form className="space-y-8">
                {/* Startup Name */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase">
                    Startup Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="startup"
                    type="text"
                    placeholder="Enter your startup name"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                      touched.startup && errors.startup
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-indigo-500'
                    }`}
                  />
                  <ErrorMessage name="startup">
                    {msg => <p className="text-sm text-red-500 mt-1">{msg}</p>}
                  </ErrorMessage>
                </div>

                {/* Required Capital */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase">
                    Required Capital ($) <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="requireCapital"
                    type="number"
                    placeholder="Enter capital requirement"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                      touched.requireCapital && errors.requireCapital
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-indigo-500'
                    }`}
                  />
                  <ErrorMessage name="requireCapital">
                    {msg => <p className="text-sm text-red-500 mt-1">{msg}</p>}
                  </ErrorMessage>
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase">
                    Pitch Summary <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="summary"
                    as="textarea"
                    rows="4"
                    placeholder="Describe your startup idea, problem you're solving, and your solution..."
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition resize-none ${
                      touched.summary && errors.summary
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-indigo-500'
                    }`}
                  />
                  <ErrorMessage name="summary">
                    {msg => <p className="text-sm text-red-500 mt-1">{msg}</p>}
                  </ErrorMessage>
                </div>

                {/* Pitch Video Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase">
                    Pitch Video <span className="text-red-500">*</span>
                  </label>
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer ${
                    uploadingVideo ? 'border-yellow-400 bg-yellow-50' :
                    videoFile ? 'border-green-400 bg-green-50' :
                    'border-gray-300 hover:border-indigo-400 bg-gray-50'
                  }`}>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleVideoSelect(e, setFieldValue)}
                      className="hidden"
                      id="pitchVideo"
                      disabled={uploadingVideo}
                    />
                    <label htmlFor="pitchVideo" className="cursor-pointer block">
                      {uploadingVideo ? (
                        <>
                          <div className="text-4xl mb-3 animate-spin">⏳</div>
                          <p className="text-sm font-bold text-yellow-600">Processing video...</p>
                        </>
                      ) : videoFile ? (
                        <>
                          <div className="text-4xl mb-3">✅</div>
                          <p className="text-sm font-bold text-green-600">Video ready to upload</p>
                          <p className="text-xs text-green-500 mt-1">{videoFile.name}</p>
                        </>
                      ) : (
                        <>
                          <div className="text-4xl mb-3">🎥</div>
                          <p className="text-sm font-bold text-gray-700">Click to upload your pitch video</p>
                          <p className="text-xs text-gray-500 mt-2">MP4, WebM, or other video formats (Max 100MB)</p>
                        </>
                      )}
                    </label>
                  </div>
                  <ErrorMessage name="pitchUrl">
                    {msg => <p className="text-sm text-red-500 mt-1">{msg}</p>}
                  </ErrorMessage>
                </div>

                {/* Video Preview */}
                {videoPreview && (
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-gray-700">Video Preview</p>
                    <video
                      src={videoPreview}
                      controls
                      className="w-full rounded-lg border border-gray-200"
                      style={{ maxHeight: '300px' }}
                    />
                  </div>
                )}

                {/* Success/Error Messages */}
                {submitSuccess && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    <p className="font-bold">✓ Pitch uploaded successfully!</p>
                    <p className="text-sm">Redirecting to pitch page...</p>
                  </div>
                )}

                {submitError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-bold">✗ Error uploading pitch</p>
                    <p className="text-sm">{typeof submitError === 'string' ? submitError : 'Please try again'}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || uploadingVideo || submitLoading}
                  className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider transition-all ${
                    isSubmitting || uploadingVideo || submitLoading
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-100'
                  }`}
                >
                  {isSubmitting || submitLoading ? 'Uploading Pitch...' : 'Upload Pitch'}
                </button>

                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/Pitch')}
                  className="w-full py-3 rounded-xl font-bold uppercase tracking-wider border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
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
