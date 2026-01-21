import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    fetchAdminStats,
    fetchAllUsers,
    fetchAllEntrepreneurs,
    fetchAllInvestors,
    fetchAllPitches,
    fetchPendingVerifications
} from "../Slice/Admin-Slice";
import { Users, Briefcase, TrendingUp, CheckCircle, Loader2, Search, Filter, AlertCircle } from 'lucide-react';

export default function Admin() {
    const dispatch = useDispatch();
    const {
        stats,
        users,
        entrepreneurs,
        investors,
        pitches,
        pendingVerifications,
        statsLoading,
        usersLoading,
        entrepreneursLoading,
        investorsLoading,
        pitchesLoading,
        pendingVerificationsLoading
    } = useSelector(state => state.admin);
    const AllUsers=useSelector(state=>state.Users?.data);
    console.log("AllUsers",AllUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [activeTab, setActiveTab] = useState('dashboard');
console.log("all use",AllUsers)
    useEffect(() => {
        dispatch(fetchAdminStats());
        dispatch(fetchAllUsers());
        dispatch(fetchAllEntrepreneurs());
        dispatch(fetchAllInvestors());
        dispatch(fetchAllPitches());
        dispatch(fetchPendingVerifications());
    }, [dispatch]);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
        <div className={`${bgColor} rounded-2xl p-6 shadow-lg border-l-4 ${color}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">{title}</p>
                    <p className="text-4xl font-black text-gray-800 mt-2">{value}</p>
                </div>
                <Icon className={`${color.replace('border', 'text')} opacity-20`} size={64} />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 shadow-lg">
                <h1 className="text-4xl font-black mb-2">Admin Dashboard</h1>
                <p className="text-slate-300 text-sm">Welcome back! Here's what's happening with your platform.</p>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-8 flex gap-8 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`py-4 px-2 font-semibold transition-all border-b-2 whitespace-nowrap ${
                            activeTab === 'dashboard'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        📊 Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`py-4 px-2 font-semibold transition-all border-b-2 whitespace-nowrap ${
                            activeTab === 'users'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        👥 Users ({AllUsers.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('entrepreneurs')}
                        className={`py-4 px-2 font-semibold transition-all border-b-2 whitespace-nowrap ${
                            activeTab === 'entrepreneurs'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        🚀 Entrepreneurs ({entrepreneurs.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('investors')}
                        className={`py-4 px-2 font-semibold transition-all border-b-2 whitespace-nowrap ${
                            activeTab === 'investors'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        💰 Investors ({investors.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('pitches')}
                        className={`py-4 px-2 font-semibold transition-all border-b-2 whitespace-nowrap ${
                            activeTab === 'pitches'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        📈 Pitches ({pitches.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('verifications')}
                        className={`py-4 px-2 font-semibold transition-all border-b-2 whitespace-nowrap relative ${
                            activeTab === 'verifications'
                                ? 'border-red-600 text-red-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        ⚠️ Pending Verifications
                        {pendingVerifications.length > 0 && (
                            <span className="absolute top-2 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                {pendingVerifications.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-8">
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                icon={Users}
                                title="Total Users"
                                value={statsLoading ? <Loader2 className="animate-spin" size={32} /> : stats.totalUsers || 0}
                                color="border-blue-500 text-blue-500"
                                bgColor="bg-blue-50"
                            />
                            <StatCard
                                icon={TrendingUp}
                                title="Entrepreneurs"
                                value={statsLoading ? <Loader2 className="animate-spin" size={32} /> : stats.totalEntrepreneurs || 0}
                                color="border-green-500 text-green-500"
                                bgColor="bg-green-50"
                            />
                            <StatCard
                                icon={Briefcase}
                                title="Investors"
                                value={statsLoading ? <Loader2 className="animate-spin" size={32} /> : stats.totalInvestors || 0}
                                color="border-purple-500 text-purple-500"
                                bgColor="bg-purple-50"
                            />
                            <StatCard
                                icon={CheckCircle}
                                title="Total Pitches"
                                value={statsLoading ? <Loader2 className="animate-spin" size={32} /> : stats.totalPitches || 0}
                                color="border-orange-500 text-orange-500"
                                bgColor="bg-orange-50"
                            />
                        </div>

                        {/* Charts and Analysis */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Breakdown Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h3 className="text-lg font-bold text-gray-800 mb-6">User Distribution</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-semibold text-gray-700">Entrepreneurs</span>
                                            <span className="text-sm font-bold text-green-600">
                                                {stats.totalEntrepreneurs || 0} ({stats.totalUsers > 0 ? Math.round((stats.totalEntrepreneurs / stats.totalUsers) * 100) : 0}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-green-500 h-3 rounded-full"
                                                style={{ width: stats.totalUsers > 0 ? `${(stats.totalEntrepreneurs / stats.totalUsers) * 100}%` : '0%' }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-semibold text-gray-700">Investors</span>
                                            <span className="text-sm font-bold text-purple-600">
                                                {stats.totalInvestors || 0} ({stats.totalUsers > 0 ? Math.round((stats.totalInvestors / stats.totalUsers) * 100) : 0}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-purple-500 h-3 rounded-full"
                                                style={{ width: stats.totalUsers > 0 ? `${(stats.totalInvestors / stats.totalUsers) * 100}%` : '0%' }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-semibold text-gray-700">Others</span>
                                            <span className="text-sm font-bold text-blue-600">
                                                {(stats.totalUsers || 0) - (stats.totalEntrepreneurs || 0) - (stats.totalInvestors || 0)} ({stats.totalUsers > 0 ? Math.round(((stats.totalUsers - stats.totalEntrepreneurs - stats.totalInvestors) / stats.totalUsers) * 100) : 0}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-blue-500 h-3 rounded-full"
                                                style={{ width: stats.totalUsers > 0 ? `${(((stats.totalUsers || 0) - (stats.totalEntrepreneurs || 0) - (stats.totalInvestors || 0)) / stats.totalUsers) * 100}%` : '0%' }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h3 className="text-lg font-bold text-gray-800 mb-6">Platform Metrics</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                                        <span className="font-semibold text-gray-700">Avg Pitches per Entrepreneur</span>
                                        <span className="text-2xl font-bold text-blue-600">
                                            {stats.totalEntrepreneurs > 0 ? (stats.totalPitches / stats.totalEntrepreneurs).toFixed(2) : '0'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                                        <span className="font-semibold text-gray-700">Platform Health</span>
                                        <span className="text-2xl font-bold text-green-600">Excellent</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                                        <span className="font-semibold text-gray-700">Pending Verifications</span>
                                        <span className="text-2xl font-bold text-orange-600">{stats.pendingVerifications || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                                        <span className="font-semibold text-gray-700">Active Connections</span>
                                        <span className="text-2xl font-bold text-purple-600">{(stats.totalEntrepreneurs * stats.totalInvestors).toString().slice(0, 4) || '0'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="space-y-6">
                        {/* Filters */}
                        <div className="flex gap-4 flex-wrap">
                            <div className="flex-1 min-w-64 relative">
                                <Search size={18} className="absolute left-4 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Filter size={18} className="text-gray-400" />
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="admin">Admins</option>
                                    <option value="entrepreneur">Entrepreneurs</option>
                                    <option value="investor">Investors</option>
                                </select>
                            </div>
                        </div>

                        {/* Users Table */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            {usersLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <Loader2 className="animate-spin text-indigo-600" size={40} />
                                </div>
                            ) : filteredUsers.length === 0 ? (
                                <div className="flex items-center justify-center h-64 text-gray-400">
                                    <p className="text-lg">No users found</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                                            <tr>
                                                <th className="px-6 py-4 text-left font-semibold">#</th>
                                                <th className="px-6 py-4 text-left font-semibold">Username</th>
                                                <th className="px-6 py-4 text-left font-semibold">Email</th>
                                                <th className="px-6 py-4 text-left font-semibold">Role</th>
                                                <th className="px-6 py-4 text-left font-semibold">Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {filteredUsers.map((user, index) => (
                                                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-semibold text-gray-800">{index + 1}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                                                {user.username?.[0]?.toUpperCase() || 'U'}
                                                            </div>
                                                            <span className="font-semibold text-gray-800">{user.username}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600 text-sm">{user.email}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase ${
                                                            user.role === 'admin' ? 'bg-red-100 text-red-700' :
                                                            user.role === 'entrepreneur' ? 'bg-green-100 text-green-700' :
                                                            user.role === 'investor' ? 'bg-purple-100 text-purple-700' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                                        {new Date(user.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Stats Footer */}
                        <div className="text-center text-gray-600 text-sm">
                            Showing {filteredUsers.length} of {users.length} users
                        </div>
                    </div>
                )}

                {/* Entrepreneurs Tab */}
                {activeTab === 'entrepreneurs' && (
                    <div className="space-y-6">
                        <div className="text-center text-gray-600 text-sm font-semibold">
                            Total Entrepreneurs: {entrepreneurs.length}
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            {entrepreneursLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <Loader2 className="animate-spin text-indigo-600" size={40} />
                                </div>
                            ) : entrepreneurs.length === 0 ? (
                                <div className="flex items-center justify-center h-64 text-gray-400">
                                    <p className="text-lg">No entrepreneurs found</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                                            <tr>
                                                <th className="px-6 py-4 text-left font-semibold">#</th>
                                                <th className="px-6 py-4 text-left font-semibold">Full Name</th>
                                                <th className="px-6 py-4 text-left font-semibold">Email</th>
                                                <th className="px-6 py-4 text-left font-semibold">Phone</th>
                                                <th className="px-6 py-4 text-left font-semibold">Skills</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {entrepreneurs.map((ent, index) => (
                                                <tr key={ent._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-semibold text-gray-800">{index + 1}</td>
                                                    <td className="px-6 py-4 font-semibold text-gray-800">{ent.fullname}</td>
                                                    <td className="px-6 py-4 text-gray-600 text-sm">{ent.email}</td>
                                                    <td className="px-6 py-4 text-gray-600 text-sm">{ent.phone}</td>
                                                    <td className="px-6 py-4 text-gray-600 text-sm">{ent.skills?.join(', ') || 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Investors Tab */}
                {activeTab === 'investors' && (
                    <div className="space-y-6">
                        <div className="text-center text-gray-600 text-sm font-semibold">
                            Total Investors: {investors.length}
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            {investorsLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <Loader2 className="animate-spin text-indigo-600" size={40} />
                                </div>
                            ) : investors.length === 0 ? (
                                <div className="flex items-center justify-center h-64 text-gray-400">
                                    <p className="text-lg">No investors found</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                                            <tr>
                                                <th className="px-6 py-4 text-left font-semibold">#</th>
                                                <th className="px-6 py-4 text-left font-semibold">Full Name</th>
                                                <th className="px-6 py-4 text-left font-semibold">Email</th>
                                                <th className="px-6 py-4 text-left font-semibold">Investor Type</th>
                                                <th className="px-6 py-4 text-left font-semibold">Verification</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {investors.map((inv, index) => (
                                                <tr key={inv._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-semibold text-gray-800">{index + 1}</td>
                                                    <td className="px-6 py-4 font-semibold text-gray-800">{inv.fullName}</td>
                                                    <td className="px-6 py-4 text-gray-600 text-sm">{inv.email}</td>
                                                    <td className="px-6 py-4 text-gray-600 text-sm">{inv.investorType}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${inv.isVerified ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                            {inv.isVerified ? 'Verified' : 'Pending'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Pitches Tab */}
                {activeTab === 'pitches' && (
                    <div className="space-y-6">
                        <div className="text-center text-gray-600 text-sm font-semibold">
                            Total Pitches: {pitches.length}
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            {pitchesLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <Loader2 className="animate-spin text-indigo-600" size={40} />
                                </div>
                            ) : pitches.length === 0 ? (
                                <div className="flex items-center justify-center h-64 text-gray-400">
                                    <p className="text-lg">No pitches found</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                                            <tr>
                                                <th className="px-6 py-4 text-left font-semibold">#</th>
                                                <th className="px-6 py-4 text-left font-semibold">Pitch Title</th>
                                                <th className="px-6 py-4 text-left font-semibold">Category</th>
                                                <th className="px-6 py-4 text-left font-semibold">Status</th>
                                                <th className="px-6 py-4 text-left font-semibold">Created</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {pitches.map((pitch, index) => (
                                                <tr key={pitch._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-semibold text-gray-800">{index + 1}</td>
                                                    <td className="px-6 py-4 font-semibold text-gray-800">{pitch.pitchTitle}</td>
                                                    <td className="px-6 py-4 text-gray-600 text-sm">{pitch.category}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${pitch.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                            {pitch.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                                        {new Date(pitch.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Pending Verifications Tab */}
                {activeTab === 'verifications' && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                            <AlertCircle size={20} className="text-red-600" />
                            <div>
                                <p className="font-semibold text-red-900">Pending Investor Verifications</p>
                                <p className="text-sm text-red-700">{pendingVerifications.length} investors awaiting verification</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            {pendingVerificationsLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <Loader2 className="animate-spin text-indigo-600" size={40} />
                                </div>
                            ) : pendingVerifications.length === 0 ? (
                                <div className="flex items-center justify-center h-64 text-gray-400">
                                    <p className="text-lg">No pending verifications! All investors verified.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gradient-to-r from-red-900 to-red-800 text-white">
                                            <tr>
                                                <th className="px-6 py-4 text-left font-semibold">#</th>
                                                <th className="px-6 py-4 text-left font-semibold">Full Name</th>
                                                <th className="px-6 py-4 text-left font-semibold">Email</th>
                                                <th className="px-6 py-4 text-left font-semibold">Investor Type</th>
                                                <th className="px-6 py-4 text-left font-semibold">Applied Date</th>
                                                <th className="px-6 py-4 text-left font-semibold">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {pendingVerifications.map((investor, index) => (
                                                <tr key={investor._id} className="hover:bg-red-50 transition-colors">
                                                    <td className="px-6 py-4 font-semibold text-gray-800">{index + 1}</td>
                                                    <td className="px-6 py-4 font-semibold text-gray-800">{investor.fullName}</td>
                                                    <td className="px-6 py-4 text-gray-600 text-sm">{investor.email}</td>
                                                    <td className="px-6 py-4 text-gray-600 text-sm">{investor.investorType}</td>
                                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                                        {new Date(investor.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-2">
                                                            <button className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition">
                                                                Approve
                                                            </button>
                                                            <button className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition">
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
