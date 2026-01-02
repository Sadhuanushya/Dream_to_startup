import React, { useState } from 'react';
export default function InvesterProfile(){
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    bio: '',
    linkedinUrl: '',
    officeLocation: { address: '', city: '', state: '', country: '', pincode: '' },
    prefferedSector: [{ sector: '', description: '', targetInvestment: '' }],
    pastInvestment: { projectName: '', investment: '', investmentDocument: '' },
    profilePicture: null,
    verificationDocument: null
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const updateSector = (index, field, value) => {
    const sectors = [...formData.prefferedSector];
    sectors[index][field] = value;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API logic
    setTimeout(() => {
      setLoading(false);
      setStatus({ type: 'success', text: 'Investor Profile Saved Successfully!' });
    }, 1500);
  };

  const SectionHeader = ({ emoji, title }) => (
    <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-6 mt-10">
      <span className="text-2xl">{emoji}</span>
      <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider">{title}</h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-100">
        
        {/* Header Section */}
        <div className="bg-slate-900 p-10 text-white relative">
          <div className="relative z-10">
            <h1 className="text-4xl font-black mb-2">Investor Onboarding</h1>
            <p className="text-slate-400 font-medium">Define your investment thesis and portfolio preferences.</p>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl">💰</div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
          
          {/* Personal Info */}
          <SectionHeader emoji="👤" title="Primary Identity" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Username</label>
              <input name="username" type="text" value={formData.username} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. angel_investor_99" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Legal Name</label>
              <input name="fullName" type="text" value={formData.fullName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Enter full name" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Business Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="investor@firm.com" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">LinkedIn URL</label>
              <input name="linkedinUrl" type="url" value={formData.linkedinUrl} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Investor Bio</label>
              <textarea name="bio" rows="3" value={formData.bio} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Briefly describe your investment background and value-add..." />
            </div>
          </div>

          {/* Office Location */}
          <SectionHeader emoji="🏢" title="Office Location" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3 space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Street Address</label>
              <input type="text" value={formData.officeLocation.address} onChange={(e) => handleNestedChange('officeLocation', 'address', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">City</label>
              <input type="text" value={formData.officeLocation.city} onChange={(e) => handleNestedChange('officeLocation', 'city', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Country</label>
              <input type="text" value={formData.officeLocation.country} onChange={(e) => handleNestedChange('officeLocation', 'country', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Pincode</label>
              <input type="text" value={formData.officeLocation.pincode} onChange={(e) => handleNestedChange('officeLocation', 'pincode', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>

          {/* Preferred Sectors */}
          <SectionHeader emoji="🎯" title="Preferred Sectors" />
          <div className="space-y-4">
            {formData.prefferedSector.map((sec, idx) => (
              <div key={idx} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-indigo-600 uppercase">Sector Name</label>
                    <input placeholder="e.g. FinTech" value={sec.sector} onChange={(e) => updateSector(idx, 'sector', e.target.value)} className="w-full bg-white border-b border-slate-300 py-2 outline-none focus:border-indigo-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-indigo-600 uppercase">Target Ticket Size ($)</label>
                    <input type="number" placeholder="50000" value={sec.targetInvestment} onChange={(e) => updateSector(idx, 'targetInvestment', e.target.value)} className="w-full bg-white border-b border-slate-300 py-2 outline-none focus:border-indigo-500" />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-black text-indigo-600 uppercase">Thesis/Description</label>
                    <input placeholder="Why are you interested in this sector?" value={sec.description} onChange={(e) => updateSector(idx, 'description', e.target.value)} className="w-full bg-white border-b border-slate-300 py-2 outline-none focus:border-indigo-500" />
                  </div>
                </div>
                {formData.prefferedSector.length > 1 && (
                  <button type="button" onClick={() => removeSector(idx)} className="mt-4 text-xs font-bold text-red-500 hover:text-red-700 uppercase flex items-center gap-1">
                    ✕ Remove Sector
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addSector} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 transition">
              + Add Another Sector
            </button>
          </div>

          {/* Past Investment */}
          <SectionHeader emoji="📈" title="Featured Past Investment" />
          <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-900 uppercase">Project Name</label>
                <input type="text" value={formData.pastInvestment.projectName} onChange={(e) => handleNestedChange('pastInvestment', 'projectName', e.target.value)} className="w-full bg-white border border-indigo-200 rounded-xl p-3 outline-none" placeholder="Exit or Current Portfolio" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-900 uppercase">Investment Amount ($)</label>
                <input type="number" value={formData.pastInvestment.investment} onChange={(e) => handleNestedChange('pastInvestment', 'investment', e.target.value)} className="w-full bg-white border border-indigo-200 rounded-xl p-3 outline-none" placeholder="Total Capital Deployed" />
              </div>
            </div>
          </div>

          {/* Verification Documents */}
          <SectionHeader emoji="📜" title="Verification & Identity" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center hover:border-indigo-400 transition cursor-pointer">
              <p className="text-sm font-bold text-slate-600">Profile Picture</p>
              <p className="text-xs text-slate-400 mt-1">Click to upload JPG/PNG</p>
            </div>
            <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center hover:border-indigo-400 transition cursor-pointer">
              <p className="text-sm font-bold text-slate-600">Accreditation Document</p>
              <p className="text-xs text-slate-400 mt-1">Upload PDF proof of status</p>
            </div>
          </div>

          {/* Submission */}
          {status && (
            <div className={`p-4 rounded-2xl text-center font-bold ${status.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {status.text}
            </div>
          )}

          <div className="pt-10">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 disabled:bg-slate-300 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest"
            >
              {loading ? 'Processing...' : 'Complete Investor Registration'}
            </button>
            <p className="text-center text-slate-400 text-xs mt-4">By submitting, you agree to our Investor Verification Terms.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

