import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {useNavigate} from "react-router-dom";
import "../style/admin.css";
import {
    fetchAdminStats,
    fetchAllUsers,
    fetchAllEntrepreneurs,
    fetchAllInvestors,
    fetchAllPitches,
    fetchPendingVerifications
} from "../Slice/Admin-Slice";
import { Users, Briefcase, TrendingUp, CheckCircle, Loader2, Search, Filter, AlertCircle } from 'lucide-react';
import {ApproveInvestor,deleteUser} from "../Slice/Admin-Slice"
import { deletePitch } from "../Slice/Pitch-Slice"; 

import {fetchUsersList} from "../Slice/Users-Slice"
export default function Admin() {
    const navigate=useNavigate();
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
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [activeTab, setActiveTab] = useState('dashboard');
    useEffect(() => {
        dispatch(fetchAdminStats());
        dispatch(fetchAllUsers());
        dispatch(fetchAllEntrepreneurs());
        dispatch(fetchAllInvestors());
        dispatch(fetchAllPitches());
        dispatch(fetchPendingVerifications());
        
    }, [dispatch]);
const handleApprove = async (investorId) => {
    const confirm = window.confirm("Are you sure you want to approve this investor?");
    if (confirm) {
       
        await dispatch(ApproveInvestor(investorId));
        
        dispatch(fetchPendingVerifications());
     
        dispatch(fetchAdminStats());
    }
};

 const handleDelete=(id)=>{
    const confirm = window.confirm("Are you sure you want to delete this user?")
    if (confirm){
    dispatch(deleteUser(id)).then(() => {
        dispatch(fetchUsersList());
    });
}
}


const handleDeletePitch = (pitchId) => { 
    const confirm = window.confirm("Are you sure you want to delete this pitch?")
    if (confirm){
    dispatch(deletePitch(pitchId)).then(() => {
        dispatch(fetchAllPitches());
    });
}
}
const handleRedirect=(id,role)=>{
    if(role==="entrepreneur"){
             navigate("/dashboard/account/EntrepreneurAccount", { state: { Eid :id} });     
}
if(role==="investor"){
       navigate('/dashboard/account/InvestorAccount', { state: { Iid :id} });
}
}
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const StatCard = ({ icon: Icon, title, value, color, bgColor }) => {
        const colorMap = {
            'blue-500': 'var(--blue-600)',
            'green-500': 'var(--green-500)',
            'purple-500': 'var(--purple-500)',
            'orange-500': 'var(--orange-500)'
        };
        const bgMap = {
            'bg-blue-50': 'var(--blue-50)',
            'bg-green-50': 'var(--green-50)',
            'bg-purple-50': 'var(--purple-50)',
            'bg-orange-50': 'var(--orange-50)'
        };
        const borderColor = colorMap[color] || 'var(--gray-200)';
        const bgColorStyle = bgMap[bgColor] || 'var(--white)';

        return (
            <div className="stat-card" style={{ backgroundColor: bgColorStyle, borderLeftColor: borderColor }}>
                <div className="stat-card-content">
                    <div className="stat-card-info">
                        <p className="stat-card-label">{title}</p>
                        <p className="stat-card-value">{value}</p>
                    </div>
                    <Icon className="stat-card-icon" size={64} style={{ color: borderColor }} />
                </div>
            </div>
        );
    };

    return (
        <div className="admin-container">
       
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Welcome back! Here's what's happening with your platform.</p>
            </div>

          
            <div className="admin-tabs">
                <div className="admin-tabs-container">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`admin-tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
                    >
                        📊 Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`admin-tab-button ${activeTab === 'users' ? 'active' : ''}`}
                    >
                        👥 Users ({users?.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('entrepreneurs')}
                        className={`admin-tab-button ${activeTab === 'entrepreneurs' ? 'active' : ''}`}
                    >
                        🚀 Entrepreneurs ({entrepreneurs.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('investors')}
                        className={`admin-tab-button ${activeTab === 'investors' ? 'active' : ''}`}
                    >
                        💰 Investors ({investors.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('pitches')}
                        className={`admin-tab-button ${activeTab === 'pitches' ? 'active' : ''}`}
                    >
                        📈 Pitches ({pitches.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('verifications')}
                        className={`admin-tab-button notification ${activeTab === 'verifications' ? 'active' : ''}`}
                    >
                        ⚠️ Pending Verifications
                        {pendingVerifications.length > 0 && (
                            <span className="admin-tab-badge">{pendingVerifications.length}</span>
                        )}
                    </button>
                </div>
            </div>

            <div className="admin-content">
            
                {activeTab === 'dashboard' && (
                    <div className="admin-section-space">
                     
                        <div className="admin-stats-grid">
                            <StatCard
                                icon={Users}
                                title="Total Users"
                                value={statsLoading ? <Loader2 className="loader-icon" size={32} style={{ color: 'var(--blue-600)' }} /> : stats.totalUsers || 0}
                                color="blue-500"
                                bgColor="bg-blue-50"
                            />
                            <StatCard
                                icon={TrendingUp}
                                title="Entrepreneurs"
                                value={statsLoading ? <Loader2 className="loader-icon" size={32} style={{ color: 'var(--blue-600)' }} /> : stats.totalEntrepreneurs || 0}
                                color="green-500"
                                bgColor="bg-green-50"
                            />
                            <StatCard
                                icon={Briefcase}
                                title="Investors"
                                value={statsLoading ? <Loader2 className="loader-icon" size={32} style={{ color: 'var(--blue-600)' }} /> : stats.totalInvestors || 0}
                                color="purple-500"
                                bgColor="bg-purple-50"
                            />
                            <StatCard
                                icon={CheckCircle}
                                title="Total Pitches"
                                value={statsLoading ? <Loader2 className="loader-icon" size={32} style={{ color: 'var(--blue-600)' }} /> : stats.totalPitches || 0}
                                color="orange-500"
                                bgColor="bg-orange-50"
                            />
                        </div>

                    
                        <div className="admin-cards-grid">
                          
                            <div className="admin-card">
                                <h3>User Distribution</h3>
                                <div className="progress-bars">
                                    <div className="progress-item">
                                        <div className="progress-header">
                                            <span className="progress-label">Entrepreneurs</span>
                                            <span className="progress-percentage">{stats.totalEntrepreneurs || 0} ({stats.totalUsers > 0 ? Math.round((stats.totalEntrepreneurs / stats.totalUsers) * 100) : 0}%)</span>
                                        </div>
                                        <div className="progress-bar-container">
                                            <div className="progress-bar" style={{ width: stats.totalUsers > 0 ? `${(stats.totalEntrepreneurs / stats.totalUsers) * 100}%` : '0%', backgroundColor: 'var(--green-500)' }}></div>
                                        </div>
                                    </div>
                                    <div className="progress-item">
                                        <div className="progress-header">
                                            <span className="progress-label">Investors</span>
                                            <span className="progress-percentage">{stats.totalInvestors || 0} ({stats.totalUsers > 0 ? Math.round((stats.totalInvestors / stats.totalUsers) * 100) : 0}%)</span>
                                        </div>
                                        <div className="progress-bar-container">
                                            <div className="progress-bar" style={{ width: stats.totalUsers > 0 ? `${(stats.totalInvestors / stats.totalUsers) * 100}%` : '0%', backgroundColor: 'var(--purple-500)' }}></div>
                                        </div>
                                    </div>
                                    <div className="progress-item">
                                        <div className="progress-header">
                                            <span className="progress-label">Others</span>
                                            <span className="progress-percentage">{(stats.totalUsers || 0) - (stats.totalEntrepreneurs || 0) - (stats.totalInvestors || 0)} ({stats.totalUsers > 0 ? Math.round(((stats.totalUsers - stats.totalEntrepreneurs - stats.totalInvestors) / stats.totalUsers) * 100) : 0}%)</span>
                                        </div>
                                        <div className="progress-bar-container">
                                            <div className="progress-bar" style={{ width: stats.totalUsers > 0 ? `${(((stats.totalUsers || 0) - (stats.totalEntrepreneurs || 0) - (stats.totalInvestors || 0)) / stats.totalUsers) * 100}%` : '0%', backgroundColor: 'var(--blue-600)' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        
                            <div className="admin-card">
                                <h3>Platform Metrics</h3>
                                <div className="space-y-4">
                                    <div className="metric-item">
                                        <div className="metric-label">Avg Pitches per Entrepreneur</div>
                                        <div className="metric-value blue">{stats.totalEntrepreneurs > 0 ? (stats.totalPitches / stats.totalEntrepreneurs).toFixed(2) : '0'}</div>
                                    </div>
                                    <div className="metric-item green">
                                        <div className="metric-label">Platform Health</div>
                                        <div className="metric-value green">Excellent</div>
                                    </div>
                                    <div className="metric-item orange">
                                        <div className="metric-label">Pending Verifications</div>
                                        <div className="metric-value orange">{stats.pendingVerifications || 0}</div>
                                    </div>
                                    <div className="metric-item purple">
                                        <div className="metric-label">Active Connections</div>
                                        <div className="metric-value purple">{(stats.totalEntrepreneurs * stats.totalInvestors).toString().slice(0, 4) || '0'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

         
                {activeTab === 'users' && (
                    <div className="space-y-6">
                    
                        <div className="table-header">
                            <div className="search-box">
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                            <div className="filter-group">
                                <Filter size={18} className="" />
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="admin">Admins</option>
                                    <option value="entrepreneur">Entrepreneurs</option>
                                    <option value="investor">Investors</option>
                                </select>
                            </div>
                        </div>

                     
                        <div className="table-wrapper">
                            {usersLoading ? (
                                <div className="table-loading">
                                    <Loader2 className="loader-icon" size={40} style={{ color: 'var(--blue-600)' }} />
                                </div>
                            ) : filteredUsers.length === 0 ? (
                                <div className="table-empty">
                                    <p>No users found</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="table-head">
                                            <tr>
                                                <th>#</th>
                                                <th>Username</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Joined</th>
                                                <th>actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="table-body">
                                            {filteredUsers.map((user, index) => {
                                                const roleClass = user.role === 'admin' ? 'badge-admin' : user.role === 'entrepreneur' ? 'badge-entrepreneur' : user.role === 'investor' ? 'badge-investor' : 'badge-default';
                                                return (
                                                <tr key={user._id}>
                                                    <td className="table-row-number">{index + 1}</td>
                                                    <td>
                                                        <div className="table-row-avatar">
                                                            <div className="avatar-circle">{user.username?.[0]?.toUpperCase() || 'U'}</div>
                                                            <div className="table-row-text" onClick={()=>{handleRedirect(user._id,user.role)}}>{user.username}</div>
                                                        </div>
                                                    </td>
                                                    <td className="table-row-text">{user.email}</td>
                                                    <td>
                                                        <span className={`badge ${roleClass}`}>{user.role}</span>
                                                    </td>
                                                    <td className="table-row-text">{new Date(user.createdAt).toLocaleDateString()}</td>
                                                <td>{user.role !=="admin" && (<button onClick={()=>handleDelete(user._id)}>delete</button>)}</td>
                                                </tr>
                                            )})}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

               
                        <div className="stats-footer">Showing {filteredUsers.length} of {users.length} users</div>
                    </div>
                )}

          
                {activeTab === 'entrepreneurs' && (
                    <div className="space-y-6">
                        <div className="stats-footer">Total Entrepreneurs: {entrepreneurs.length}</div>
                        <div className="table-wrapper">
                            {entrepreneursLoading ? (
                                <div className="table-loading">
                                    <Loader2 className="loader-icon" size={40} style={{ color: 'var(--blue-600)' }} />
                                </div>
                            ) : entrepreneurs.length === 0 ? (
                                <div className="table-empty">
                                    <p>No entrepreneurs found</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="table-head">
                                            <tr>
                                                <th>#</th>
                                                <th>Full Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>verification</th>
                                            
                                            </tr>
                                        </thead>
                                        <tbody className="table-body">
                                            {entrepreneurs.map((ent, index) => (
                                                <tr key={ent._id}>
                                                    <td className="table-row-number">{index + 1}</td>
                                                    <td className="table-row-text">{ent.fullname}</td>
                                                    <td className="table-row-text">{ent.email}</td>
                                                    <td className="table-row-text">{ent.phone}</td>
                                                    <td><span className={`badge ${ent.isVerified ? 'badge-verified' : 'badge-unverified'}`}>{ent.isVerified ? 'Verified' : 'Pending'}</span>       </td>                                           
                                                  
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

             
                {activeTab === 'investors' && (
                    <div className="space-y-6">
                        <div className="stats-footer">Total Investors: {investors.length}</div>
                        <div className="table-wrapper">
                            {investorsLoading ? (
                                <div className="table-loading">
                                    <Loader2 className="loader-icon" size={40} style={{ color: 'var(--blue-600)' }} />
                                </div>
                            ) : investors.length === 0 ? (
                                <div className="table-empty">
                                    <p>No investors found</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="table-head">
                                            <tr>
                                                <th>#</th>
                                                <th>Full Name</th>
                                                <th>Email</th>
                                                <th>Investor Type</th>
                                                <th>Verification</th>
                                            </tr>
                                        </thead>
                                        <tbody className="table-body">
                                            {investors.map((inv, index) => (
                                                <tr key={inv._id}>
                                                    <td className="table-row-number">{index + 1}</td>
                                                    <td className="table-row-text">{inv.fullName}</td>
                                                    <td className="table-row-text">{inv.email}</td>
                                                    <td className="table-row-text">{inv.investorType}</td>
                                                    <td>
                                                        <span className={`badge ${inv.isVerified ? 'badge-verified' : 'badge-unverified'}`}>{inv.isVerified ? 'Verified' : 'Pending'}</span>
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

            
                {activeTab === 'pitches' && (
                    <div className="space-y-6">
                        <div className="stats-footer">Total Pitches: {pitches.length}</div>
                        <div className="table-wrapper">
                            {pitchesLoading ? (
                                <div className="table-loading">
                                    <Loader2 className="loader-icon" size={40} style={{ color: 'var(--blue-600)' }} />
                                </div>
                            ) : pitches.length === 0 ? (
                                <div className="table-empty">
                                    <p>No pitches found</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="table-head">
                                            <tr>
                                                <th>#</th>
                                                <th>Pitch Title</th>
                                                <th>Entrepreneur Name</th>
                                                  
                                                <th>Created</th>
                                                <th>actions</th>
                                                
                                            </tr>
                                        </thead>
                                        <tbody className="table-body">
                                            {pitches.map((pitch, index) => (
                                                <tr key={pitch._id}>
                                                    <td className="table-row-number">{index + 1}</td>
                                                    <td className="table-row-text">{pitch.startup}</td>
                                                    <td className="table-row-text">{pitch.EnterprenuerId?.username}</td>
                                                    <td className="table-row-text">{new Date(pitch.createdAt).toLocaleDateString()}</td>
                                                    <td><button onClick={()=>handleDeletePitch(pitch._id)}>delete</button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

               
                {activeTab === 'verifications' && (
                    <div className="space-y-6">
                        <div className="alert-box">
                            <AlertCircle size={20} className="alert-icon" />
                            <div className="alert-content">
                                <h4>Pending Investor Verifications</h4>
                                <p>{pendingVerifications.length} investors awaiting verification</p>
                            </div>
                        </div>
                        <div className="table-wrapper">
                            {pendingVerificationsLoading ? (
                                <div className="table-loading">
                                    <Loader2 className="loader-icon" size={40} style={{ color: 'var(--blue-600)' }} />
                                </div>
                            ) : pendingVerifications.length === 0 ? (
                                <div className="table-empty">
                                    <p>No pending verifications! All investors verified.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="table-head">
                                            <tr>
                                                <th>#</th>
                                                <th>Full Name</th>
                                                <th>Email</th>
                                                <th>Investor Type</th>
                                                <th>Applied Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="table-body">
                                            {pendingVerifications.map((investor, index) => (
                                                <tr key={investor._id}>
                                                    <td className="table-row-number">{index + 1}</td>
                                                    <td className="table-row-text" onClick={()=>{handleRedirect(investor.userId._id,investor.userId.role||"investor")}}>{investor.fullName}</td>
                                                    <td className="table-row-text">{investor.email}</td>
                                                    <td className="table-row-text">{investor.investorType}</td>
                                                    <td className="table-row-text">{new Date(investor.createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button className="action-btn action-btn-approve" onClick={()=>handleApprove(investor._id)}>Approve</button>
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
