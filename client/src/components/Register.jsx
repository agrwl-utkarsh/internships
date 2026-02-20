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

const Register = ({ onRegister, onSwitchToLogin }) => {
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [domain, setDomain] = useState('');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [preference, setPreference] = useState('Any');

    const toggleSkill = (skill) => {
        setSelectedSkills(prev =>
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onRegister({ name, email, password, domain, skills: selectedSkills, preference });
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
            setLoading(false);
        }
    };

    return (
        <section className="view section-active">
            <div className="form-container glass-panel" style={{ maxWidth: '600px', margin: '2rem auto' }}>
                <div className="form-header">
                    <h2>Create an Account</h2>
                    <p>{step === 1 ? 'Step 1: Account Details' : 'Step 2: Professional Profile'}</p>
                </div>

                {error && (
                    <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
                        <i className="fa-solid fa-circle-exclamation mr-2"></i>{error}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleNextStep}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" placeholder="Alex Doe" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Password (min 6 characters)</label>
                            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength="6" />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary btn-block">
                                Continue to Profile <i className="fa-solid fa-arrow-right ml-2"></i>
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Preferred Domain</label>
                            <select value={domain} onChange={e => setDomain(e.target.value)} required>
                                <option value="" disabled>Select a domain</option>
                                {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Your Skills</label>
                            <div className="skills-grid">
                                {SKILLS_LIST.map(skill => {
                                    const id = `reg-skill-${skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                                    return (
                                        <div key={skill}>
                                            <input type="checkbox" id={id} className="skill-checkbox" checked={selectedSkills.includes(skill)} onChange={() => toggleSkill(skill)} />
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
                                        <input type="radio" name="work_pref" value={pref} checked={preference === pref} onChange={() => setPreference(pref)} />
                                        <span className="radio-content">
                                            <i className={`fa-solid ${pref === 'Remote' ? 'fa-house-laptop' : pref === 'On-site' ? 'fa-building' : pref === 'Hybrid' ? 'fa-building-user' : 'fa-globe'
                                                }`}></i>
                                            {pref}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="form-actions" style={{ display: 'flex', gap: '1rem' }}>
                            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setStep(1)}>
                                Back
                            </button>
                            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
                                {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Create Account'}
                            </button>
                        </div>
                    </form>
                )}

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--c-text-muted)', fontSize: '0.875rem' }}>
                    Already have an account?{' '}
                    <button className="btn-icon" style={{ color: 'var(--c-primary)', fontWeight: 600, padding: 0 }} onClick={onSwitchToLogin}>
                        Log in
                    </button>
                </p>
            </div>
        </section>
    );
};

export default Register;
