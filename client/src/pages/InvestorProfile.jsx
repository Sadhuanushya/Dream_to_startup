import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitInvestorProfile, resetInvestorError, resetInvestorSuccess } from '../Slice/Investor-Slice';

export default function InvestorProfile() {
  const dispatch = useDispatch();
  const { submitLoading, submitError, submitSuccess } = useSelector(state => state.investor);
  
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    bio: '',
    linkedinUrl: '',
    investorType: 'Angel Investor',
    customInvestorType: '',
    officeLocation: { address: '', city: '', state: '', country: '', pincode: '' },
    prefferedSector: [{ sector: '', description: '', targetInvestment: '' }],
    pastInvestment: { projectName: '', investment: '', investmentDocument: '' },
    profilePicture: null,
    verificationDocument: null
  });

  const [statusMessage, setStatusMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [uploadingFields, setUploadingFields] = useState({
    profilePicture: false,
    verificationDocument: false
  });
  const [uploadSuccess, setUploadSuccess] = useState({});

  // Reset status message after submission
  useEffect(() => {
    if (submitSuccess) {
      setStatusMessage({ type: 'success', text: 'Investor profile submitted successfully!' });
      setTimeout(() => {
        dispatch(resetInvestorSuccess());
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
        dispatch(resetInvestorError());
      }, 3000);
    }
  }, [submitError, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setUploadingFields(prev => ({ ...prev, [fieldName]: true }));
      
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          [fieldName]: file
        }));
        
        setUploadingFields(prev => ({ ...prev, [fieldName]: false }));
        setUploadSuccess(prev => ({ ...prev, [fieldName]: true }));
        
        setTimeout(() => {
          setUploadSuccess(prev => ({ ...prev, [fieldName]: false }));
        }, 2000);
      }, 800);
    }
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const updateSector = (index, field, value) => {
    const sectors = [...formData.prefferedSector];
    sectors[index][field] = field === 'targetInvestment' ? (value ? Number(value) : '') : value;
    setFormData(prev => ({ ...prev, prefferedSector: sectors }));
  };

  const addSector = () => {
    setFormData(prev => ({
      ...prev,
      prefferedSector: [...prev.prefferedSector, { sector: '', description: '', targetInvestment: '' }]
    }));
  };

  const removeSector = (index) => {
    setFormData(prev => ({
      ...prev,
      prefferedSector: prev.prefferedSector.filter((_, i) => i !== index)
    }));
  };

  const updatePastInvestment = (field, value) => {
    setFormData(prev => ({
      ...prev,
      pastInvestment: { ...prev.pastInvestment, [field]: field === 'investment' ? (value ? Number(value) : '') : value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create FormData for multipart file upload
    const formDataToSend = new FormData();
    
    // Add text fields
    formDataToSend.append('username', formData.username);
    formDataToSend.append('fullName', formData.fullName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('bio', formData.bio);
    formDataToSend.append('linkedinUrl', formData.linkedinUrl);
    formDataToSend.append('investorType', formData.investorType);
    if (formData.customInvestorType) {
      formDataToSend.append('customInvestorType', formData.customInvestorType);
    }
    
    // Add office location fields individually
    formDataToSend.append('officeLocation[address]', formData.officeLocation.address);
    formDataToSend.append('officeLocation[city]', formData.officeLocation.city);
    formDataToSend.append('officeLocation[state]', formData.officeLocation.state);
    formDataToSend.append('officeLocation[country]', formData.officeLocation.country);
    formDataToSend.append('officeLocation[pincode]', formData.officeLocation.pincode);
    
    // Add sectors with array notation
    formData.prefferedSector.forEach((sector, index) => {
      formDataToSend.append(`prefferedSector[${index}][sector]`, sector.sector);
      formDataToSend.append(`prefferedSector[${index}][description]`, sector.description);
      formDataToSend.append(`prefferedSector[${index}][targetInvestment]`, sector.targetInvestment);
    });
    
    // Add past investment fields
    if (formData.pastInvestment.projectName || formData.pastInvestment.investment) {
      formDataToSend.append('pastInvestment[projectName]', formData.pastInvestment.projectName);
      formDataToSend.append('pastInvestment[investment]', formData.pastInvestment.investment);
    }
    
    // Add files if they exist
    if (formData.profilePicture instanceof File) {
      formDataToSend.append('profilePicture', formData.profilePicture);
    }
    if (formData.verificationDocument instanceof File) {
      formDataToSend.append('verificationDocument', formData.verificationDocument);
    }

    console.log('Submitting investor profile...');
    dispatch(submitInvestorProfile(formDataToSend));
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
        className={`w-full bg-gray-50 border rounded-lg p-3 focus:ring-2 focus:outline-none transition ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-indigo-800 to-indigo-900 p-10 text-white">
          <h1 className="text-4xl font-black mb-2">Investor Onboarding</h1>
          <p className="text-indigo-200">Build your investment portfolio and define your thesis.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
          
          {/* Personal Identity Section */}
          <SectionHeader emoji="👤" title="Primary Identity" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Username"
              name="username"
              placeholder="e.g. angel_investor_99"
              required
              error={fieldErrors.username}
            />
            <InputField
              label="Full Legal Name"
              name="fullName"
              placeholder="Enter full name"
              required
              error={fieldErrors.fullName}
            />
            <InputField
              label="Business Email"
              name="email"
              type="email"
              placeholder="investor@firm.com"
              required
              error={fieldErrors.email}
            />
            <InputField
              label="LinkedIn URL"
              name="linkedinUrl"
              type="url"
              placeholder="https://linkedin.com/in/..."
              required
              error={fieldErrors.linkedinUrl}
            />
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Investor Type <span className="text-red-500">*</span>
              </label>
              <select
                name="investorType"
                value={formData.investorType}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="Angel Investor">Angel Investor</option>
                <option value="Accelerator Investor">Accelerator Investor</option>
                <option value="Seed Investor">Seed Investor</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {formData.investorType === 'Other' && (
              <InputField
                label="Please specify investor type"
                name="customInvestorType"
                placeholder="Enter your investor type"
                error={fieldErrors.customInvestorType}
              />
            )}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Investor Bio <span className="text-red-500">*</span>
              </label>
              <textarea
                name="bio"
                rows="3"
                placeholder="Describe your investment background and value-add..."
                value={formData.bio}
                onChange={handleChange}
                className={`w-full bg-gray-50 border rounded-lg p-3 focus:ring-2 focus:outline-none transition ${
                  fieldErrors.bio ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                }`}
              />
              {fieldErrors.bio && <p className="text-xs text-red-500 mt-1">{fieldErrors.bio}</p>}
            </div>
          </div>

          {/* Office Location Section */}
          <SectionHeader emoji="🏢" title="Office Location" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3 space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Street Address</label>
              <input
                type="text"
                value={formData.officeLocation.address}
                onChange={(e) => handleNestedChange('officeLocation', 'address', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Enter street address"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">City</label>
              <input
                type="text"
                value={formData.officeLocation.city}
                onChange={(e) => handleNestedChange('officeLocation', 'city', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="City"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">State</label>
              <input
                type="text"
                value={formData.officeLocation.state}
                onChange={(e) => handleNestedChange('officeLocation', 'state', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="State"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Country</label>
              <input
                type="text"
                value={formData.officeLocation.country}
                onChange={(e) => handleNestedChange('officeLocation', 'country', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Country"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Pincode</label>
              <input
                type="text"
                value={formData.officeLocation.pincode}
                onChange={(e) => handleNestedChange('officeLocation', 'pincode', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Pincode"
              />
            </div>
          </div>

          {/* Preferred Sectors Section */}
          <SectionHeader emoji="🎯" title="Preferred Sectors" />
          <div className="space-y-4">
            {formData.prefferedSector.map((sec, idx) => (
              <div key={idx} className="p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-200 transition">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-blue-600 uppercase">Sector Name</label>
                    <input
                      placeholder="e.g. FinTech, SaaS"
                      value={sec.sector}
                      onChange={(e) => updateSector(idx, 'sector', e.target.value)}
                      className="w-full border-b border-gray-300 py-2 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-blue-600 uppercase">Target Ticket Size ($)</label>
                    <input
                      type="number"
                      placeholder="50000"
                      value={sec.targetInvestment}
                      onChange={(e) => updateSector(idx, 'targetInvestment', e.target.value)}
                      className="w-full border-b border-gray-300 py-2 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-black text-blue-600 uppercase">Thesis/Description</label>
                    <textarea
                      placeholder="Why are you interested in this sector?"
                      value={sec.description}
                      onChange={(e) => updateSector(idx, 'description', e.target.value)}
                      className="w-full border-b border-gray-300 py-2 outline-none focus:border-blue-500 resize-none"
                      rows="2"
                    />
                  </div>
                </div>
                {formData.prefferedSector.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSector(idx)}
                    className="mt-3 text-xs font-bold text-red-500 hover:text-red-700 uppercase"
                  >
                    ✕ Remove Sector
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSector}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition"
            >
              + Add Another Sector
            </button>
          </div>

          {/* Featured Past Investment Section */}
          <SectionHeader emoji="📈" title="Featured Past Investment" />
          <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-xl space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-900 uppercase">Project Name</label>
                <input
                  type="text"
                  value={formData.pastInvestment.projectName}
                  onChange={(e) => updatePastInvestment('projectName', e.target.value)}
                  className="w-full bg-white border border-indigo-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Exit or Current Portfolio"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-900 uppercase">Investment Amount ($)</label>
                <input
                  type="number"
                  value={formData.pastInvestment.investment}
                  onChange={(e) => updatePastInvestment('investment', e.target.value)}
                  className="w-full bg-white border border-indigo-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Total Capital Deployed"
                />
              </div>
            </div>
          </div>

          {/* Documents & Verification Section */}
          <SectionHeader emoji="📄" title="Documents & Verification" />
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

            {/* Verification Document Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Verification Document <span className="text-red-500">*</span>
              </label>
              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer ${
                uploadingFields.verificationDocument ? 'border-yellow-400 bg-yellow-50' : 
                uploadSuccess.verificationDocument ? 'border-green-400 bg-green-50' :
                'border-gray-300 hover:border-blue-400'
              }`}>
                <input
                  type="file"
                  id="verificationDocument"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e, 'verificationDocument')}
                  className="hidden"
                  disabled={uploadingFields.verificationDocument}
                />
                <label htmlFor="verificationDocument" className="cursor-pointer block">
                  {uploadingFields.verificationDocument ? (
                    <>
                      <div className="text-3xl mb-2 animate-spin">⏳</div>
                      <p className="text-sm font-semibold text-yellow-600">Uploading...</p>
                    </>
                  ) : uploadSuccess.verificationDocument ? (
                    <>
                      <div className="text-3xl mb-2">✅</div>
                      <p className="text-sm font-semibold text-green-600">Upload successful!</p>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl mb-2">📜</div>
                      <p className="text-sm font-semibold text-gray-600">Click to upload verification proof</p>
                      <p className="text-xs text-gray-400">PDF, JPG, PNG up to 10MB</p>
                    </>
                  )}
                </label>
                {formData.verificationDocument && !uploadSuccess.verificationDocument && !uploadingFields.verificationDocument && (
                  <p className="text-xs text-blue-600 mt-2 font-semibold">📄 {formData.verificationDocument.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className={`p-4 rounded-xl text-center font-bold animate-bounce ${statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {statusMessage.text}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-8">
            <button
              type="submit"
              disabled={submitLoading}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 disabled:bg-gray-300 transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg shadow-indigo-200"
            >
              {submitLoading ? 'Submitting...' : 'COMPLETE INVESTOR REGISTRATION'}
            </button>
            <p className="text-center text-gray-400 text-xs mt-4">By submitting, you agree to our Investor Verification Terms.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

