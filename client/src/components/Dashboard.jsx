import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import InternshipCard from './InternshipCard';

const API = 'http://localhost:5000/api';

const Dashboard = ({ user, onEditProfile }) => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all' | 'saved'

    const fetchInternships = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${API}/internships`, {
                params: { uuid: user.uuid }
            });
            setInternships(res.data);
        } catch (err) {
            setError('Could not fetch internships. Make sure the backend server is running.');
        } finally {
            setLoading(false);
        }
    }, [user.uuid]);

    useEffect(() => {
        fetchInternships();
    }, [fetchInternships]);

    const handleSave = async (internshipId) => {
        try {
            const res = await axios.post(`${API}/users/${user.uuid}/save`, { internshipId });
            const savedIds = res.data.savedInternships.map(id => id.toString());
            setInternships(prev =>
                prev.map(job => ({
                    ...job,
                    isSaved: savedIds.includes(job._id.toString())
                }))
            );
        } catch (err) {
            console.error('Could not save internship:', err);
        }
    };

    const displayed = filter === 'saved'
        ? internships.filter(j => j.isSaved)
        : internships;

    return (
        <section id="view-dashboard" className="view section-active">
            <div className="dashboard-layout">
                {/* Sidebar */}
                <aside className="dashboard-sidebar glass-panel">
                    <div className="user-profile-summary">
                        <div className="avatar"><i className="fa-regular fa-user"></i></div>
                        <div className="user-info">
                            <h3>{user.name}</h3>
                            <p className="text-muted">{user.domain}</p>
                        </div>
                        <button
                            className="btn-icon subtle"
                            id="btn-edit-profile"
                            onClick={onEditProfile}
                            title="Edit Profile"
                        >
                            <i className="fa-solid fa-pen"></i>
                        </button>
                    </div>

                    <div className="filter-section">
                        <h4>Active Filters</h4>
                        <div className="active-filters">
                            <span className="chip chip-pref">
                                <i className="fa-solid fa-filter fa-sm"></i> {user.preference}
                            </span>
                        </div>
                        <div className="active-filters">
                            {user.skills.map(skill => (
                                <span key={skill} className="chip">{skill}</span>
                            ))}
                        </div>
                    </div>

                    {/* View Toggle */}
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button
                            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                            style={{ fontSize: '0.875rem', padding: '0.6rem 1rem' }}
                            onClick={() => setFilter('all')}
                        >
                            <i className="fa-solid fa-list-ul mr-2"></i>All Matches
                        </button>
                        <button
                            className={`btn ${filter === 'saved' ? 'btn-primary' : 'btn-outline'}`}
                            style={{ fontSize: '0.875rem', padding: '0.6rem 1rem' }}
                            onClick={() => setFilter('saved')}
                        >
                            <i className="fa-solid fa-bookmark mr-2"></i>Saved
                        </button>
                    </div>
                </aside>

                {/* Main */}
                <div className="dashboard-main">
                    <div className="dashboard-header">
                        <h2>Your Matches</h2>
                        <span className="match-count">
                            Found <strong>{displayed.length}</strong> internship{displayed.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {loading && (
                        <div className="empty-state">
                            <i className="fa-solid fa-spinner fa-spin empty-icon"></i>
                            <p>Fetching your matches...</p>
                        </div>
                    )}

                    {error && (
                        <div className="empty-state">
                            <i className="fa-solid fa-circle-exclamation empty-icon" style={{ color: '#ef4444' }}></i>
                            <h3>API Connection Error</h3>
                            <p>{error}</p>
                            <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={fetchInternships}>
                                Retry
                            </button>
                        </div>
                    )}

                    {!loading && !error && displayed.length === 0 && (
                        <div className="empty-state">
                            <i className="fa-solid fa-magnifying-glass-slash empty-icon"></i>
                            <h3>{filter === 'saved' ? 'No saved internships yet' : 'No matches found'}</h3>
                            <p>{filter === 'saved' ? 'Bookmark internships to see them here.' : 'Try adjusting your skills or domain.'}</p>
                            {filter !== 'saved' && (
                                <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={onEditProfile}>
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    )}

                    {!loading && !error && displayed.length > 0 && (
                        <div className="internships-grid">
                            {displayed.map(job => (
                                <InternshipCard
                                    key={job._id}
                                    job={job}
                                    userSkills={user.skills}
                                    onSave={handleSave}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Dashboard;
