import React, { useState } from 'react';


export default function EntrepreneurProfile(){
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    bio: '',
    linkdinUrl: '',
    address: { address: '', city: '', state: '', country: '', pincode: '' },
    skills: '', 
    education: [{ institutionName: '', course: '', year: '' }],
    workExperience: [{ company: '', position: '', years: '' }],
    pastProject: [{ projectname: '', websiteUrl: '', revenue: '' }],
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
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
    updatedArray[index][field] = value;
    setFormData(prev => ({ ...prev, [collection]: updatedArray }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStatusMessage({ type: 'success', text: 'Profile submitted successfully!' });
    }, 1500);
  };

  const SectionHeader = ({ emoji, title }) => (
    <div className="flex items-center gap-2 border-b-2 border-gray-100 pb-2 mb-6 mt-10">
      <span className="text-2xl">{emoji}</span>
      <h3 className="text-xl font-bold text-gray-700 tracking-tight">{title}</h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-10 text-white">
          <h1 className="text-4xl font-black mb-2">Build Your Profile</h1>
          <p className="text-slate-300">Complete your entrepreneur dossier to connect with investors.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
          
          <SectionHeader emoji="👤" title="Basic Profile" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
              <input name="fullname" type="text" placeholder="John Doe" value={formData.fullname} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Contact Number</label>
              <input name="phone" type="text" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition" />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Bio / Vision</label>
              <textarea name="bio" rows="3" placeholder="Tell us about your entrepreneurial journey..." value={formData.bio} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition" />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">LinkedIn Profile</label>
              <input name="linkdinUrl" type="url" placeholder="https://linkedin.com/in/username" value={formData.linkdinUrl} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition" />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Core Skills (Comma separated)</label>
              <input name="skills" type="text" placeholder="Fintech, SaaS, React, Team Building" value={formData.skills} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition" />
            </div>
          </div>

          <SectionHeader emoji="📍" title="Location" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3 space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
              <input name="address" type="text" value={formData.address.address} onChange={handleAddressChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">City</label>
              <input name="city" type="text" value={formData.address.city} onChange={handleAddressChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">State</label>
              <input name="state" type="text" value={formData.address.state} onChange={handleAddressChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Pincode</label>
              <input name="pincode" type="text" value={formData.address.pincode} onChange={handleAddressChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition" />
            </div>
          </div>

          <SectionHeader emoji="🎓" title="Education" />
          <div className="space-y-4">
            {formData.education.map((edu, idx) => (
              <div key={idx} className="p-6 bg-white border border-gray-200 rounded-xl relative group hover:border-blue-200 transition">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input placeholder="School/University" value={edu.institutionName} onChange={(e) => updateArrayItem('education', idx, 'institutionName', e.target.value)} className="border-b border-gray-200 py-2 focus:border-blue-500 outline-none" />
                  <input placeholder="Degree" value={edu.course} onChange={(e) => updateArrayItem('education', idx, 'course', e.target.value)} className="border-b border-gray-200 py-2 focus:border-blue-500 outline-none" />
                  <input placeholder="Year" value={edu.year} onChange={(e) => updateArrayItem('education', idx, 'year', e.target.value)} className="border-b border-gray-200 py-2 focus:border-blue-500 outline-none" />
                </div>
                {formData.education.length > 1 && (
                  <button type="button" onClick={() => removeArrayItem('education', idx)} className="mt-3 text-xs font-bold text-red-500 hover:text-red-700 uppercase">
                    Remove Entry
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('education')} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition">
              + Add Education
            </button>
          </div>

          <SectionHeader emoji="💼" title="Experience" />
          <div className="space-y-4">
            {formData.workExperience.map((exp, idx) => (
              <div key={idx} className="p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-200 transition">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input placeholder="Company" value={exp.company} onChange={(e) => updateArrayItem('workExperience', idx, 'company', e.target.value)} className="border-b border-gray-200 py-2 focus:border-blue-500 outline-none" />
                  <input placeholder="Position" value={exp.position} onChange={(e) => updateArrayItem('workExperience', idx, 'position', e.target.value)} className="border-b border-gray-200 py-2 focus:border-blue-500 outline-none" />
                  <input placeholder="Duration (Years)" value={exp.years} onChange={(e) => updateArrayItem('workExperience', idx, 'years', e.target.value)} className="border-b border-gray-200 py-2 focus:border-blue-500 outline-none" />
                </div>
                {formData.workExperience.length > 1 && (
                  <button type="button" onClick={() => removeArrayItem('workExperience', idx)} className="mt-3 text-xs font-bold text-red-500 hover:text-red-700 uppercase">
                    Remove Entry
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('workExperience')} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition">
              + Add Work Experience
            </button>
          </div>

          <SectionHeader emoji="🚀" title="Projects & Revenue" />
          <div className="space-y-4">
            {formData.pastProject.map((proj, idx) => (
              <div key={idx} className="p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-200 transition">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input placeholder="Project Name" value={proj.projectname} onChange={(e) => updateArrayItem('pastProject', idx, 'projectname', e.target.value)} className="border-b border-gray-200 py-2 focus:border-blue-500 outline-none" />
                  <input placeholder="Product Link" value={proj.websiteUrl} onChange={(e) => updateArrayItem('pastProject', idx, 'websiteUrl', e.target.value)} className="border-b border-gray-200 py-2 focus:border-blue-500 outline-none" />
                  <input placeholder="Annual Revenue ($)" value={proj.revenue} onChange={(e) => updateArrayItem('pastProject', idx, 'revenue', e.target.value)} className="border-b border-gray-200 py-2 focus:border-blue-500 outline-none" />
                </div>
                {formData.pastProject.length > 1 && (
                  <button type="button" onClick={() => removeArrayItem('pastProject', idx)} className="mt-3 text-xs font-bold text-red-500 hover:text-red-700 uppercase">
                    Remove Project
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('pastProject')} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition">
              + Add Past Project
            </button>
          </div>

          {statusMessage && (
            <div className={`p-4 rounded-xl text-center font-bold animate-bounce ${statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {statusMessage.text}
            </div>
          )}

          <div className="pt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 disabled:bg-gray-300 transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg shadow-blue-200"
            >
              {loading ? 'Submitting...' : 'SAVE PROFESSIONAL PROFILE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

