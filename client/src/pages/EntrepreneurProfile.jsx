import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Joi from 'joi';
import { submitEntrepreneurProfile, resetEntrepreneurError, resetEntrepreneurSuccess } from '../Slice/Entreprenuer-Slice';

// Joi Validation Schema
// const entrepreneurSchema = Joi.object({
//   fullname: Joi.string()
//     .trim()
//     .min(3)
//     .max(50)
//     .required()
//     .messages({
//       'string.empty': 'Full name is required',
//       'string.min': 'Full name must be at least 3 characters',
//       'string.max': 'Full name must not exceed 50 characters'
//     }),
//   email: Joi.string()
//     .email({ tlds: { allow: false } })
//     .required()
//     .messages({
//       'string.empty': 'Email is required',
//       'string.email': 'Please enter a valid email address'
//     }),
//   phone: Joi.string()
//     .pattern(/^[6-9]\d{9}$/)
//     .required()
//     .messages({
//       'string.empty': 'Phone number is required',
//       'string.pattern.base': 'Phone number must be a valid 10-digit number'
//     }),
//   bio: Joi.string()
//     .trim()
//     .min(10)
//     .max(500)
//     .required()
//     .messages({
//       'string.empty': 'Bio is required',
//       'string.min': 'Bio must be at least 10 characters',
//       'string.max': 'Bio must not exceed 500 characters'
//     }),
//   linkedinUrl: Joi.string()
//     .uri()
//     .required()
//     .messages({
//       'string.empty': 'LinkedIn URL is required',
//       'string.uri': 'Please enter a valid URL'
//     }),
//   skills: Joi.array()
//     .items(Joi.string().trim().min(2).max(50))
//     .min(1)
//     .required()
//     .messages({
//       'array.min': 'Please add at least one skill'
//     }),
//   address: Joi.object({
//     address: Joi.string()
//       .trim()
//       .max(200)
//       .required()
//       .messages({ 'string.empty': 'Address is required' }),
//     city: Joi.string()
//       .trim()
//       .max(40)
//       .required()
//       .messages({ 'string.empty': 'City is required' }),
//     state: Joi.string()
//       .trim()
//       .max(40)
//       .required()
//       .messages({ 'string.empty': 'State is required' }),
//     country: Joi.string()
//       .trim()
//       .max(40)
//       .required()
//       .messages({ 'string.empty': 'Country is required' }),
//     pincode: Joi.string()
//       .pattern(/^\d{6}$/)
//       .required()
//       .messages({
//         'string.empty': 'Pincode is required',
//         'string.pattern.base': 'Pincode must be 6 digits'
//       })
//   }).required(),
//   education: Joi.array()
//     .items(Joi.object({
//       institutionName: Joi.string().trim().min(3).max(80).required(),
//       course: Joi.string().trim().min(3).max(50).required(),
//       year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required()
//     }))
//     .min(1)
//     .required()
//     .messages({ 'array.min': 'Please add at least one education record' }),
//   workExperience: Joi.array()
//     .items(Joi.object({
//       company: Joi.string().trim().min(3).max(100).required(),
//       position: Joi.string().trim().min(3).max(60).required(),
//       years: Joi.number().integer().min(0).max(50).required()
//     }))
//     .min(1)
//     .required()
//     .messages({ 'array.min': 'Please add at least one work experience' }),
//   pastProject: Joi.array()
//     .items(Joi.object({
//       projectname: Joi.string().trim().min(3).max(50).required(),
//       websiteUrl: Joi.string().uri().max(100).required(),
//       revenue: Joi.number().min(0).required()
//     }))
//     .min(1)
//     .required()
//     .messages({ 'array.min': 'Please add at least one project' })
// });

export default function EntrepreneurProfile() {
  const dispatch = useDispatch();
  const { submitLoading, submitError, submitSuccess } = useSelector(state => state.Entrepreneur);
  const { EntrepreneurProfile } = useSelector(state => state.Entrepreneur);
  const [isReadOnly, setIsReadOnly] = useState(false);
  
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    bio: '',
    linkedinUrl: '',
    address: { address: '', city: '', state: '', country: '', pincode: '' },
    skills: '',
    profilePicture: null,
    identityDocument: null,
    BusinessRegistrationDocument: null,
    education: [{ institutionName: '', course: '', year: '' }],
    workExperience: [{ company: '', position: '', years: '' }],
    pastProject: [{ projectname: '', websiteUrl: '', revenue: '' }],
  });

  const [errors, setErrors] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState(null);
  const [uploadingFields, setUploadingFields] = useState({
    profilePicture: false,
    identityDocument: false,
    BusinessRegistrationDocument: false
  });
  const [uploadSuccess, setUploadSuccess] = useState({});

  // Load entrepreneur data when fetched
  useEffect(() => {
    if (EntrepreneurProfile && EntrepreneurProfile._id) {
      setIsReadOnly(true);
      // Populate form with fetched entrepreneur data
      setFormData({
        fullname: EntrepreneurProfile.fullname || '',
        email: EntrepreneurProfile.email || '',
        phone: EntrepreneurProfile.phone || '',
        bio: EntrepreneurProfile.bio || '',
        linkedinUrl: EntrepreneurProfile.linkedinUrl || '',
        address: EntrepreneurProfile.address || { address: '', city: '', state: '', country: '', pincode: '' },
        skills: Array.isArray(EntrepreneurProfile.skills) ? EntrepreneurProfile.skills.join(', ') : EntrepreneurProfile.skills || '',
        profilePicture: EntrepreneurProfile.profilePicture || null,
        identityDocument: EntrepreneurProfile.identityDocument || null,
        BusinessRegistrationDocument: EntrepreneurProfile.BusinessRegistrationDocument || null,
        education: EntrepreneurProfile.education || [{ institutionName: '', course: '', year: '' }],
        workExperience: EntrepreneurProfile.workExperience || [{ company: '', position: '', years: '' }],
        pastProject: EntrepreneurProfile.pastProject || [{ projectname: '', websiteUrl: '', revenue: '' }],
      });
    }
  }, [EntrepreneurProfile]);

  // Reset status message after submission
  useEffect(() => {
    if (submitSuccess) {
      setStatusMessage({ type: 'success', text: 'Profile submitted successfully!' });
      setTimeout(() => {
        dispatch(resetEntrepreneurSuccess());
        setStatusMessage(null);
      }, 3000);
    }
  }, [submitSuccess, dispatch]);

  useEffect(() => {
    if (submitError) {
      let errorText = 'An error occurred during submission';
      if (typeof submitError === 'string') {
        errorText = submitError;
      } else if (submitError?.message) {
        errorText = submitError.message;
      } else if (submitError?.error) {
        errorText = submitError.error;
      }
      setStatusMessage({ type: 'error', text: errorText });
      setTimeout(() => {
        dispatch(resetEntrepreneurError());
      }, 3000);
    }
  }, [submitError, dispatch]);

  // Validate single field
  const validateField = (name, value) => {
    let validateValue = value;
    
    // Convert skills string to array for validation
    if (name === 'skills' && typeof value === 'string') {
      validateValue = value
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
    }
    
  //   const fieldSchema = entrepreneurSchema.extract(name);
  //   const { error } = fieldSchema.validate(validateValue);
    
  //   if (error) {
  //     setFieldErrors(prev => ({ ...prev, [name]: error.message }));
  //     return false;
  //   } else {
  //     setFieldErrors(prev => {
  //       const newErrors = { ...prev };
  //       delete newErrors[name];
  //       return newErrors;
  //     });
  //     return true;
  //   }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      // Start loading
      setUploadingFields(prev => ({ ...prev, [fieldName]: true }));
      
      // Simulate file processing (in real scenario, you might validate file size, type, etc.)
      setTimeout(() => {
        // Store file object for later upload to backend
        setFormData(prev => ({
          ...prev,
          [fieldName]: file
        }));
        
        // Stop loading and show success
        setUploadingFields(prev => ({ ...prev, [fieldName]: false }));
        setUploadSuccess(prev => ({ ...prev, [fieldName]: true }));
        
        // Auto-hide success message after 2 seconds
        setTimeout(() => {
          setUploadSuccess(prev => ({ ...prev, [fieldName]: false }));
        }, 2000);
      }, 800);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
    // Validate the entire address object
  //   const addressSchema = entrepreneurSchema.extract('address');
  //   const { error } = addressSchema.validate({ ...formData.address, [name]: value });
  //   if (error) {
  //     setFieldErrors(prev => ({ ...prev, 'address': error.message }));
  //   } else {
  //     setFieldErrors(prev => {
  //       const newErrors = { ...prev };
  //       delete newErrors['address'];
  //       return newErrors;
  //     });
  //   }
  };

  const addArrayItem = (collection) => {
    const templates = {
      education: { institutionName: '', course: '', year: '' },
      workExperience: { company: '', position: '', years: '' },
      pastProject: { projectname: '', websiteUrl: '', revenue: '' }
    };
    setFormData(prev => ({
      ...prev,
      [collection]: [...prev[collection], templates[collection]]
    }));
  };

  const removeArrayItem = (collection, index) => {
    setFormData(prev => ({
      ...prev,
      [collection]: prev[collection].filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (collection, index, field, value) => {
    const updatedArray = [...formData[collection]];
    updatedArray[index][field] = field === 'year' || field === 'years' || field === 'revenue' 
      ? (value ? Number(value) : '')
      : value;
    setFormData(prev => ({ ...prev, [collection]: updatedArray }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create FormData for multipart file upload
    const formDataToSend = new FormData();
    
    // Add text fields
    formDataToSend.append('fullname', formData.fullname);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('bio', formData.bio);
    formDataToSend.append('linkedinUrl', formData.linkedinUrl);
    
    // Add address as JSON
    formDataToSend.append('address', JSON.stringify(formData.address));
    
    // Add skills as JSON
    const skillsArray = Array.isArray(formData.skills) ? formData.skills : formData.skills.split(',').map(s => s.trim()).filter(Boolean);
    formDataToSend.append('skills', JSON.stringify(skillsArray));
    
    // Add education as JSON
    formDataToSend.append('education', JSON.stringify(formData.education));
    
    // Add workExperience as JSON
    formDataToSend.append('workExperience', JSON.stringify(formData.workExperience));
    
    // Add pastProject as JSON
    formDataToSend.append('pastProject', JSON.stringify(formData.pastProject));
    
    // Add files if they exist
    if (formData.profilePicture instanceof File) {
      formDataToSend.append('profilePicture', formData.profilePicture);
    }
    if (formData.identityDocument instanceof File) {
      formDataToSend.append('identityDocument', formData.identityDocument);
    }
    if (formData.BusinessRegistrationDocument instanceof File) {
      formDataToSend.append('BusinessRegistrationDocument', formData.BusinessRegistrationDocument);
    }

    console.log('Submitting FormData with files...');
    dispatch(submitEntrepreneurProfile(formDataToSend));
  };

  const SectionHeader = ({ emoji, title }) => (
    <div className="flex items-center gap-2 border-b-2 border-gray-100 pb-2 mb-6 mt-10">
      <span className="text-2xl">{emoji}</span>
      <h3 className="text-xl font-bold text-gray-700 tracking-tight">{title}</h3>
    </div>
  );

  const InputField = ({ label, name, type = 'text', placeholder, required = false, error = null }) => (
    <div className="space-y-1">
      <label className="text-xs font-bold text-gray-500 uppercase">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
        disabled={isReadOnly}
        className={`w-full bg-gray-50 border rounded-lg p-3 focus:ring-2 focus:outline-none transition ${
          isReadOnly ? 'bg-gray-100 cursor-not-allowed text-gray-600' : ''
        } ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-10 text-white">
          <h1 className="text-4xl font-black mb-2">{isReadOnly ? 'Entrepreneur Profile' : 'Build Your Profile'}</h1>
          <p className="text-slate-300">{isReadOnly ? 'View your entrepreneur profile and project details.' : 'Complete your entrepreneur dossier to connect with investors.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
          
          {/* Profile Picture Display for Read-Only Mode */}
           {isReadOnly && formData.profilePicture && (
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img 
                  src={typeof formData.profilePicture?.DocumentUrl === 'string' ? formData.profilePicture?.DocumentUrl: 'picture'} 
                  alt="Profile" 
                  className="w-40 h-40 rounded-full object-cover border-4 border-indigo-900 shadow-lg"
                />
              </div>
            </div>
          )}
          <SectionHeader emoji="👤" title="Basic Profile" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Full Name"
              name="fullname"
              placeholder="John Doe"
              required
              error={fieldErrors.fullname}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              required
              error={fieldErrors.email}
            />
            <InputField
              label="Contact Number"
              name="phone"
              placeholder="+1 (555) 000-0000"
              error={fieldErrors.phone}
            />
            <InputField
              label="LinkedIn Profile"
              name="linkedinUrl"
              type="url"
              placeholder="https://linkedin.com/in/username"
              required
              error={fieldErrors.linkedinUrl}
            />
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Bio / Vision <span className="text-red-500">*</span>
              </label>
              <textarea
                name="bio"
                rows="3"
                placeholder="Tell us about your entrepreneurial journey..."
                value={formData.bio}
                onChange={handleChange}
                disabled={isReadOnly}
                className={`w-full bg-gray-50 border rounded-lg p-3 focus:ring-2 focus:outline-none transition ${
                  isReadOnly ? 'bg-gray-100 cursor-not-allowed text-gray-600' : ''
                } ${
                  fieldErrors.bio ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                }`}
              />
              {fieldErrors.bio && <p className="text-xs text-red-500 mt-1">{fieldErrors.bio}</p>}
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Core Skills (Comma separated) <span className="text-red-500">*</span>
              </label>
              <input
                name="skills"
                type="text"
                placeholder="Fintech, SaaS, React, Team Building"
                value={formData.skills}
                onChange={handleChange}
                disabled={isReadOnly}
                className={`w-full bg-gray-50 border rounded-lg p-3 focus:ring-2 focus:outline-none transition ${
                  isReadOnly ? 'bg-gray-100 cursor-not-allowed text-gray-600' : ''
                } ${
                  fieldErrors.skills ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                }`}
              />
              {fieldErrors.skills && <p className="text-xs text-red-500 mt-1">{fieldErrors.skills}</p>}
            </div>
          </div>

          <SectionHeader emoji="📍" title="Location" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3 space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                name="address"
                type="text"
                value={formData.address.address}
                onChange={handleAddressChange}
                disabled={isReadOnly}
                className={`w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition ${
                  isReadOnly ? 'bg-gray-100 cursor-not-allowed text-gray-600' : ''
                }`}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">City</label>
              <input
                name="city"
                type="text"
                value={formData.address.city}
                onChange={handleAddressChange}
                disabled={isReadOnly}
                className={`w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition ${
                  isReadOnly ? 'bg-gray-100 cursor-not-allowed text-gray-600' : ''
                }`}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">State</label>
              <input
                name="state"
                type="text"
                value={formData.address.state}
                onChange={handleAddressChange}
                disabled={isReadOnly}
                className={`w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition ${
                  isReadOnly ? 'bg-gray-100 cursor-not-allowed text-gray-600' : ''
                }`}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Country</label>
              <input
                name="country"
                type="text"
                value={formData.address.country}
                onChange={handleAddressChange}
                disabled={isReadOnly}
                className={`w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition ${
                  isReadOnly ? 'bg-gray-100 cursor-not-allowed text-gray-600' : ''
                }`}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Pincode</label>
              <input
                name="pincode"
                type="text"
                value={formData.address.pincode}
                onChange={handleAddressChange}
                disabled={isReadOnly}
                className={`w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition ${
                  isReadOnly ? 'bg-gray-100 cursor-not-allowed text-gray-600' : ''
                }`}
              />
            </div>
          </div>

          <SectionHeader emoji="🎓" title="Education" />
          <div className="space-y-4">
            {formData.education.map((edu, idx) => (
              <div key={idx} className="p-6 bg-white border border-gray-200 rounded-xl relative group hover:border-blue-200 transition">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    placeholder="School/University *"
                    value={edu.institutionName}
                    onChange={(e) => updateArrayItem('education', idx, 'institutionName', e.target.value)}
                    className="border-b border-gray-200 py-2 focus:border-blue-500 outline-none"
                  />
                  <input
                    placeholder="Degree *"
                    value={edu.course}
                    onChange={(e) => updateArrayItem('education', idx, 'course', e.target.value)}
                    className="border-b border-gray-200 py-2 focus:border-blue-500 outline-none"
                  />
                  <input
                    placeholder="Year *"
                    type="number"
                    value={edu.year}
                    onChange={(e) => updateArrayItem('education', idx, 'year', e.target.value)}
                    className="border-b border-gray-200 py-2 focus:border-blue-500 outline-none"
                  />
                </div>
                {formData.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('education', idx)}
                    className="mt-3 text-xs font-bold text-red-500 hover:text-red-700 uppercase"
                  >
                    Remove Entry
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('education')}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition"
            >
              + Add Education
            </button>
          </div>

          <SectionHeader emoji="💼" title="Experience" />
          <div className="space-y-4">
            {formData.workExperience.map((exp, idx) => (
              <div key={idx} className="p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-200 transition">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    placeholder="Company *"
                    value={exp.company}
                    onChange={(e) => updateArrayItem('workExperience', idx, 'company', e.target.value)}
                    className="border-b border-gray-200 py-2 focus:border-blue-500 outline-none"
                  />
                  <input
                    placeholder="Position *"
                    value={exp.position}
                    onChange={(e) => updateArrayItem('workExperience', idx, 'position', e.target.value)}
                    className="border-b border-gray-200 py-2 focus:border-blue-500 outline-none"
                  />
                  <input
                    placeholder="Duration (Years) *"
                    type="number"
                    value={exp.years}
                    onChange={(e) => updateArrayItem('workExperience', idx, 'years', e.target.value)}
                    className="border-b border-gray-200 py-2 focus:border-blue-500 outline-none"
                  />
                </div>
                {formData.workExperience.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('workExperience', idx)}
                    className="mt-3 text-xs font-bold text-red-500 hover:text-red-700 uppercase"
                  >
                    Remove Entry
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('workExperience')}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition"
            >
              + Add Work Experience
            </button>
          </div>

          <SectionHeader emoji="🚀" title="Projects & Revenue" />
          <div className="space-y-4">
            {formData.pastProject.map((proj, idx) => (
              <div key={idx} className="p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-200 transition">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    placeholder="Project Name *"
                    value={proj.projectname}
                    onChange={(e) => updateArrayItem('pastProject', idx, 'projectname', e.target.value)}
                    className="border-b border-gray-200 py-2 focus:border-blue-500 outline-none"
                  />
                  <input
                    placeholder="Product Link *"
                    value={proj.websiteUrl}
                    onChange={(e) => updateArrayItem('pastProject', idx, 'websiteUrl', e.target.value)}
                    className="border-b border-gray-200 py-2 focus:border-blue-500 outline-none"
                  />
                  <input
                    placeholder="Annual Revenue ($) *"
                    type="number"
                    value={proj.revenue}
                    onChange={(e) => updateArrayItem('pastProject', idx, 'revenue', e.target.value)}
                    className="border-b border-gray-200 py-2 focus:border-blue-500 outline-none"
                  />
                </div>
                {formData.pastProject.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('pastProject', idx)}
                    className="mt-3 text-xs font-bold text-red-500 hover:text-red-700 uppercase"
                  >
                    Remove Project
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('pastProject')}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition"
            >
              + Add Past Project
            </button>
          </div>

          <SectionHeader emoji="📄" title="Documents & Verification" />
          {!isReadOnly && (
            <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Picture Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Profile Picture <span className="text-red-500">*</span>
              </label>
              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer ${
                uploadingFields.profilePicture ? 'border-yellow-400 bg-yellow-50' : 
                uploadSuccess.profilePicture ? 'border-green-400 bg-green-50' :
                'border-gray-300 hover:border-blue-400'
              }`}>
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'profilePicture')}
                  className="hidden"
                  disabled={uploadingFields.profilePicture}
                />
                <label htmlFor="profilePicture" className="cursor-pointer block">
                  {uploadingFields.profilePicture ? (
                    <>
                      <div className="text-3xl mb-2 animate-spin">⏳</div>
                      <p className="text-sm font-semibold text-yellow-600">Uploading...</p>
                    </>
                  ) : uploadSuccess.profilePicture ? (
                    <>
                      <div className="text-3xl mb-2">✅</div>
                      <p className="text-sm font-semibold text-green-600">Upload successful!</p>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl mb-2">🖼️</div>
                      <p className="text-sm font-semibold text-gray-600">Click to upload profile picture</p>
                      <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                    </>
                  )}
                </label>
                {formData.profilePicture && !uploadSuccess.profilePicture && !uploadingFields.profilePicture && (
                  <p className="text-xs text-blue-600 mt-2 font-semibold">📄 {formData.profilePicture.name}</p>
                )}
              </div>
            </div>

            {/* Identity Document Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Identity Document (Aadhar/Passport) <span className="text-red-500">*</span>
              </label>
              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer ${
                uploadingFields.identityDocument ? 'border-yellow-400 bg-yellow-50' : 
                uploadSuccess.identityDocument ? 'border-green-400 bg-green-50' :
                'border-gray-300 hover:border-blue-400'
              }`}>
                <input
                  type="file"
                  id="identityDocument"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e, 'identityDocument')}
                  className="hidden"
                  disabled={uploadingFields.identityDocument}
                />
                <label htmlFor="identityDocument" className="cursor-pointer block">
                  {uploadingFields.identityDocument ? (
                    <>
                      <div className="text-3xl mb-2 animate-spin">⏳</div>
                      <p className="text-sm font-semibold text-yellow-600">Uploading...</p>
                    </>
                  ) : uploadSuccess.identityDocument ? (
                    <>
                      <div className="text-3xl mb-2">✅</div>
                      <p className="text-sm font-semibold text-green-600">Upload successful!</p>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl mb-2">🆔</div>
                      <p className="text-sm font-semibold text-gray-600">Click to upload identity proof</p>
                      <p className="text-xs text-gray-400">PDF, JPG, PNG up to 10MB</p>
                    </>
                  )}
                </label>
                {formData.identityDocument && !uploadSuccess.identityDocument && !uploadingFields.identityDocument && (
                  <p className="text-xs text-blue-600 mt-2 font-semibold">📄 {formData.identityDocument.name}</p>
                )}
              </div>
            </div>

            {/* Business Registration Document */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Business Registration Document <span className="text-red-500">*</span>
              </label>
              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer ${
                uploadingFields.BusinessRegistrationDocument ? 'border-yellow-400 bg-yellow-50' : 
                uploadSuccess.BusinessRegistrationDocument ? 'border-green-400 bg-green-50' :
                'border-gray-300 hover:border-blue-400'
              }`}>
                <input
                  type="file"
                  id="BusinessRegistrationDocument"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e, 'BusinessRegistrationDocument')}
                  className="hidden"
                  disabled={uploadingFields.BusinessRegistrationDocument}
                />
                <label htmlFor="BusinessRegistrationDocument" className="cursor-pointer block">
                  {uploadingFields.BusinessRegistrationDocument ? (
                    <>
                      <div className="text-3xl mb-2 animate-spin">⏳</div>
                      <p className="text-sm font-semibold text-yellow-600">Uploading...</p>
                    </>
                  ) : uploadSuccess.BusinessRegistrationDocument ? (
                    <>
                      <div className="text-3xl mb-2">✅</div>
                      <p className="text-sm font-semibold text-green-600">Upload successful!</p>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl mb-2">📋</div>
                      <p className="text-sm font-semibold text-gray-600">Click to upload business registration (GST/Certificate of Incorporation)</p>
                      <p className="text-xs text-gray-400">PDF, JPG, PNG up to 10MB</p>
                    </>
                  )}
                </label>
                {formData.BusinessRegistrationDocument && !uploadSuccess.BusinessRegistrationDocument && !uploadingFields.BusinessRegistrationDocument && (
                  <p className="text-xs text-blue-600 mt-2 font-semibold">📄 {formData.BusinessRegistrationDocument.name}</p>
                )}
              </div>
            </div>
          </div>
            </>
          )}

          {statusMessage && (
            <div className={`p-4 rounded-xl text-center font-bold animate-bounce ${statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {statusMessage.text}
            </div>
          )}

          <div className="pt-8">
            {!isReadOnly && (
              <>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full bg-green-600 text-black py-5 rounded-2xl text-xl hover:bg-green-700 disabled:bg-gray-300 transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg"
                >
                  {submitLoading ? 'Submitting...' : 'SAVE PROFESSIONAL PROFILE'}
                </button>
              </>
            )}
            {isReadOnly && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
                <p className="text-blue-700 font-semibold">📋 Profile View Mode - Read Only</p>
              </div>
            )}
          </div>
          
        </form>
      </div>
    </div>
  );
};