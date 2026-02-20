import React, { useState } from 'react';

const SKILLS_LIST = [
    "HTML", "CSS", "JavaScript", "React", "Node.js", "Python",
    "Java", "C++", "C", "Swift", "Kotlin", "SQL", "MongoDB",
    "Machine Learning", "TensorFlow", "PyTorch", "Pandas",
    "UI/UX", "Figma", "AWS", "Linux", "SEO", "Content Creation",
    "TypeScript", "GraphQL", "Docker", "Kubernetes", "Solidity"
].sort();

const DOMAINS = [
    "Web Development", "App Development", "Data Science",
    "Machine Learning", "Core Engineering", "Finance", "Marketing", "UI/UX Design"
];

const ProfileSetup = ({ initialData, onSubmit }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [domain, setDomain] = useState(initialData?.domain || '');
    const [selectedSkills, setSelectedSkills] = useState(initialData?.skills || []);
    const [preference, setPreference] = useState(initialData?.preference || 'Any');

    const toggleSkill = (skill) => {
        setSelectedSkills(prev =>
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, domain, skills: selectedSkills, preference });
    };

    return (
        <section id="view-profile" className="view section-active">
            <div className="form-container glass-panel">
                <div className="form-header">
                    <h2>Tell us about yourself</h2>
                    <p>We'll personalize your internship feed based on this info.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="user-name">Your Name</label>
                        <input
                            id="user-name"
                            type="text"
                            placeholder="e.g. Alex Doe"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="user-domain">Preferred Domain</label>
                        <select
                            id="user-domain"
                            value={domain}
                            onChange={e => setDomain(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select a domain</option>
                            {DOMAINS.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Your Skills</label>
                        <div className="skills-grid">
                            {SKILLS_LIST.map(skill => {
                                const id = `skill-${skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                                return (
                                    <div key={skill}>
                                        <input
                                            type="checkbox"
                                            id={id}
                                            className="skill-checkbox"
                                            checked={selectedSkills.includes(skill)}
                                            onChange={() => toggleSkill(skill)}
                                        />
                                        <label htmlFor={id} className="skill-label">{skill}</label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Work Preference</label>
                        <div className="radio-group">
                            {['Remote', 'On-site', 'Hybrid', 'Any'].map(pref => (
                                <label className="radio-card" key={pref}>
                                    <input
                                        type="radio"
                                        name="work_pref"
                                        value={pref}
                                        checked={preference === pref}
                                        onChange={() => setPreference(pref)}
                                    />
                                    <span className="radio-content">
                                        <i className={`fa-solid ${pref === 'Remote' ? 'fa-house-laptop' :
                                                pref === 'On-site' ? 'fa-building' :
                                                    pref === 'Hybrid' ? 'fa-building-user' : 'fa-globe'
                                            }`}></i>
                                        {pref}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary btn-block">
                            Find Matches <i className="fa-solid fa-wand-magic-sparkles ml-2"></i>
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default ProfileSetup;
