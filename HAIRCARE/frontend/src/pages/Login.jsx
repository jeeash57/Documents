import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [step, setStep] = useState(1); // 1: Credentials, 2: 2FA
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [otpCode, setOtpCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                if (data.tfa_required) {
                    setStep(2);
                } else {
                    login(data.user);
                    navigate('/products');
                }
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/verify-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, code: otpCode })
            });
            const data = await response.json();
            if (response.ok) {
                login(data.user);
                navigate('/products');
            } else {
                setError(data.error || 'Invalid 2FA code');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="auth-card" style={{ maxWidth: '450px', width: '100%', background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: '800', textTransform: 'uppercase' }}>Login to HAIRCARE</h2>

                {error && <div style={{ background: '#ffeeee', color: '#ff4d4d', padding: '10px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

                {step === 1 && (
                    <form onSubmit={handleLoginSubmit}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Email Address</label>
                            <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
                        </div>
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Password</label>
                            <input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
                        </div>
                        <button type="submit" className="btn btn-primary-rw" disabled={loading} style={{ width: '100%', padding: '15px' }}>
                            {loading ? 'Checking...' : 'Login'}
                        </button>
                        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px', fontWeight: '500', textTransform: 'uppercase' }}>
                            Don't have an account? <Link to="/register" style={{ color: '#000', fontWeight: '800', textDecoration: 'underline' }}>Join Now</Link>
                        </p>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifySubmit} style={{ textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', fontWeight: '800', textTransform: 'uppercase' }}>Two-Step Verification</h3>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '20px' }}>Enter the 6-digit code from your authenticator app.</p>
                        <input
                            type="text"
                            required
                            maxLength="6"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            placeholder="000000"
                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', textAlign: 'center', fontSize: '1.5rem', letterSpacing: '5px' }}
                        />
                        <button type="submit" className="btn btn-primary-rw" disabled={loading} style={{ width: '100%', padding: '15px', marginTop: '20px' }}>
                            {loading ? 'Verifying...' : 'Verify & Login'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
