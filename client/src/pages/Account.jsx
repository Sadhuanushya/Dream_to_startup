import {useContext, useEffect, useState} from "react";
import UserContext from "../Context/UserContext"
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAccount, updateUserAccount, resetUpdateSuccess } from "../Slice/Users-Slice";
import { AlertCircle, CheckCircle, User as UserIcon } from "lucide-react";

export default function Account(){
  const { user } = useContext(UserContext);
  const dispatch = useDispatch();
  const { account, accountLoading, accountError, updateSuccess } = useSelector(state => state.Users);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullname: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    bio: ''
  });

  useEffect(() => {
    dispatch(fetchUserAccount());
  }, [dispatch]);

  useEffect(() => {
    if (account && Object.keys(account).length > 0) {
      setFormData({
        username: account.username || '',
        email: account.email || '',
        fullname: account.fullname || '',
        phone: account.phone || '',
        address: account.address || '',
        city: account.city || '',
        state: account.state || '',
        country: account.country || '',
        pincode: account.pincode || '',
        bio: account.bio || ''
      });
    }
  }, [account]);

  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => {
        dispatch(resetUpdateSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserAccount(formData));
  };

  if (accountLoading && Object.keys(account).length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading your profile...</div>
      </div>
    );
  }

  const userRole = account?.role || user?.role;
  const entrepreneurProfile = account?.entrepreneurProfile;
  const investorProfile = account?.investorProfile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main Account Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <p className="text-blue-100 mt-2">Update your account information</p>
            <p className="text-blue-200 text-sm mt-3 capitalize">Role: <span className="font-semibold">{userRole}</span></p>
          </div>

          {/* Alerts */}
          {accountError && (
            <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 text-sm">{accountError}</p>
              </div>
            </div>
          )}

          {updateSuccess && (
            <div className="mx-8 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-green-800 font-medium">Success</p>
                <p className="text-green-700 text-sm">Your profile has been updated successfully!</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Basic Information
            </h2>

            <div className="space-y-6">
              {/* Username and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Enter email"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter full name"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter address"
                />
              </div>

              {/* City, State, Pincode Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Enter pincode"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter country"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex gap-4">
              <button
                type="submit"
                disabled={accountLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {accountLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Entrepreneur Profile Section */}
        {userRole === 'entrepreneur' && entrepreneurProfile && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white">Entrepreneur Profile</h2>
              <p className="text-green-100 mt-1">Your professional startup information</p>
            </div>
            <div className="px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* LinkedIn */}
                {entrepreneurProfile.linkedinUrl && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">LinkedIn URL</p>
                    <a href={entrepreneurProfile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                      {entrepreneurProfile.linkedinUrl}
                    </a>
                  </div>
                )}

                {/* Skills */}
                {entrepreneurProfile.skills && entrepreneurProfile.skills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-3">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {entrepreneurProfile.skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Education */}
              {entrepreneurProfile.education && entrepreneurProfile.education.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Education</h3>
                  <div className="space-y-3">
                    {entrepreneurProfile.education.map((edu, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-800">{edu.institutionName}</p>
                        <p className="text-sm text-gray-600">{edu.course} • {edu.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Work Experience */}
              {entrepreneurProfile.workExperience && entrepreneurProfile.workExperience.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Work Experience</h3>
                  <div className="space-y-3">
                    {entrepreneurProfile.workExperience.map((work, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-800">{work.company}</p>
                        <p className="text-sm text-gray-600">{work.position} • {work.years} years</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Past Projects */}
              {entrepreneurProfile.pastProject && entrepreneurProfile.pastProject.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Past Projects</h3>
                  <div className="space-y-3">
                    {entrepreneurProfile.pastProject.map((project, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-800">{project.projectname}</p>
                        {project.websiteUrl && (
                          <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">
                            {project.websiteUrl}
                          </a>
                        )}
                        {project.revenue && <p className="text-sm text-gray-600 mt-1">Revenue: ₹{project.revenue}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Investor Profile Section */}
        {userRole === 'investor' && investorProfile && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white">Investor Profile</h2>
              <p className="text-purple-100 mt-1">Your investment portfolio and preferences</p>
            </div>
            <div className="px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Investor Type */}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Investor Type</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {investorProfile.investorType === 'Other' ? investorProfile.customInvestorType : investorProfile.investorType}
                  </p>
                </div>

                {/* LinkedIn */}
                {investorProfile.linkedinUrl && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">LinkedIn URL</p>
                    <a href={investorProfile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                      {investorProfile.linkedinUrl}
                    </a>
                  </div>
                )}
              </div>

              {/* Office Location */}
              {investorProfile.officeLocation && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Office Location</h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>{investorProfile.officeLocation.address}</p>
                    <p>{investorProfile.officeLocation.city}, {investorProfile.officeLocation.state} {investorProfile.officeLocation.pincode}</p>
                    <p>{investorProfile.officeLocation.country}</p>
                  </div>
                </div>
              )}

              {/* Preferred Sectors */}
              {investorProfile.prefferedSector && investorProfile.prefferedSector.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Preferred Investment Sectors</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {investorProfile.prefferedSector.map((sector, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-800">{sector.sector}</p>
                        {sector.description && <p className="text-sm text-gray-600 mt-1">{sector.description}</p>}
                        {sector.targetInvestment && (
                          <p className="text-sm font-semibold text-purple-600 mt-2">Target: ₹{sector.targetInvestment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Past Investments */}
              {investorProfile.pastInvestment && Object.keys(investorProfile.pastInvestment).length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">Past Investment</h3>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="font-medium text-gray-800">{investorProfile.pastInvestment.projectName}</p>
                    <p className="text-sm text-gray-600 mt-1">Investment: ₹{investorProfile.pastInvestment.investment}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* User Welcome Card */}
        {user && (
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <p className="text-gray-700">
              Welcome back, <span className="font-bold text-blue-600">{user.username}</span>! 
              <br />
              <span className="text-sm text-gray-500 mt-2 block">
                You're on the Dream to Startup platform. Your complete profile is displayed above.
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}