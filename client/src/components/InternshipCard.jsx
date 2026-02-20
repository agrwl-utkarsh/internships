import React from 'react';
import { formatDistanceToNow, differenceInCalendarDays } from 'date-fns';

const InternshipCard = ({ job, userSkills, onSave }) => {
    const {
        _id, company, role, location, preference, skills,
        deadline, logoColor, logoText, matchScore, missingSkills,
        isSaved, isNew
    } = job;

    const daysLeft = differenceInCalendarDays(new Date(deadline), new Date());
    const deadlineUrgent = daysLeft <= 7;

    const prefIcon =
        preference === 'Remote' ? 'fa-house-laptop' :
            preference === 'On-site' ? 'fa-building' :
                preference === 'Hybrid' ? 'fa-building-user' : 'fa-globe';

    // Color the score ring
    const scoreColor =
        matchScore >= 75 ? '#34d399' :
            matchScore >= 50 ? '#f59e0b' : '#f87171';

    return (
        <div className="internship-card">
            {/* Header */}
            <div className="card-header">
                <div
                    className="company-logo"
                    style={{
                        color: logoColor,
                        borderColor: `${logoColor}40`,
                        background: `${logoColor}15`
                    }}
                >
                    {logoText}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {isNew && (
                        <span style={{
                            fontSize: '0.7rem', fontWeight: 700,
                            padding: '0.2rem 0.6rem',
                            background: 'rgba(16,185,129,0.15)',
                            color: '#34d399',
                            border: '1px solid rgba(16,185,129,0.3)',
                            borderRadius: '9999px'
                        }}>🟢 NEW</span>
                    )}
                    {matchScore !== undefined && (
                        <span style={{
                            fontSize: '0.8rem', fontWeight: 700,
                            padding: '0.25rem 0.7rem',
                            background: `${scoreColor}18`,
                            color: scoreColor,
                            border: `1px solid ${scoreColor}40`,
                            borderRadius: '9999px'
                        }}>{matchScore}% Match</span>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="card-body">
                <h3 className="card-role">{role}</h3>
                <div className="card-company">{company}</div>

                <div className="card-meta">
                    <span><i className={`fa-solid fa-location-dot`}></i> {location}</span>
                    <span><i className={`fa-solid ${prefIcon}`}></i> {preference}</span>
                </div>

                {/* Skill Tags */}
                <div className="card-skills">
                    {skills.map(skill => (
                        <span
                            key={skill}
                            className={`skill-tag ${userSkills?.includes(skill) ? 'match' : ''}`}
                        >
                            {skill}
                        </span>
                    ))}
                </div>

                {/* Skill Gap */}
                {missingSkills && missingSkills.length > 0 && (
                    <div style={{
                        marginTop: '0.75rem',
                        fontSize: '0.8rem',
                        color: '#f59e0b',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.4rem'
                    }}>
                        <i className="fa-solid fa-triangle-exclamation mt-0.5"></i>
                        <span><strong>Missing:</strong> {missingSkills.join(', ')}</span>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="card-footer">
                <div className="deadline" style={{ color: deadlineUrgent ? '#ef4444' : 'var(--c-text-muted)' }}>
                    <i className="fa-regular fa-clock mr-1"></i>
                    {daysLeft > 0 ? `${daysLeft}d left` : 'Deadline passed'}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {/* Save/Bookmark Button */}
                    <button
                        className="btn-icon"
                        onClick={() => onSave(_id)}
                        title={isSaved ? 'Unsave' : 'Save Internship'}
                        style={{ color: isSaved ? '#6366f1' : undefined }}
                    >
                        <i className={`fa-${isSaved ? 'solid' : 'regular'} fa-bookmark`}></i>
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={() => alert(`Application sent to ${company} for ${role}!`)}
                    >
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InternshipCard;
