import React, { useState } from 'react';

const Login = ({ onLogin, onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onLogin(email, password);
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="view section-active">
            <div className="form-container glass-panel" style={{ maxWidth: '400px', margin: '4rem auto' }}>
                <div className="form-header">
                    <h2>Welcome Back</h2>
                    <p>Log in to access your tailored internship feed.</p>
                </div>

                {error && (
                    <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
                        <i className="fa-solid fa-circle-exclamation mr-2"></i>{error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="login-email">Email Address</label>
                        <input
                            id="login-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Log In'}
                        </button>
                    </div>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--c-text-muted)', fontSize: '0.875rem' }}>
                    Don't have an account?{' '}
                    <button className="btn-icon" style={{ color: 'var(--c-primary)', fontWeight: 600, padding: 0 }} onClick={onSwitchToRegister}>
                        Sign up
                    </button>
                </p>
            </div>
        </section>
    );
};

export default Login;
