import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const [step, setStep] = useState(1); // 1: Info, 2: 2FA Setup
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });
    const [qrCode, setQrCode] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                setQrCode(data.qr_code);
                setStep(2);
            } else {
                setError(data.error || 'Registration failed');
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
            const response = await fetch('/api/verify-registration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, code: otpCode })
            });
            const data = await response.json();
            if (response.ok) {
                login(data.user);
                navigate('/products');
            } else {
                setError(data.error || 'Verification failed');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    const handleSkip2FA = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/skip-2fa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });
            const data = await response.json();
            if (response.ok) {
                login(data.user);
                navigate('/products');
            } else {
                setError(data.error || 'Failed to skip 2FA');
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
                <h2 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: '800', textTransform: 'uppercase' }}>Join HAIRCARE</h2>

                {error && <div style={{ background: '#ffeeee', color: '#ff4d4d', padding: '10px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

                {step === 1 && (
                    <form onSubmit={handleInfoSubmit}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Full Name</label>
                            <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Email Address</label>
                            <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
                        </div>
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Password</label>
                            <input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
                        </div>
                        <button type="submit" className="btn btn-primary-rw" disabled={loading} style={{ width: '100%', padding: '15px' }}>
                            {loading ? 'Processing..' : 'Continue'}
                        </button>
                        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px', fontWeight: '500', textTransform: 'uppercase' }}>
                            Already have an account? <Link to="/login" style={{ color: '#000', fontWeight: '800', textDecoration: 'underline' }}>Login</Link>
                        </p>
                    </form>
                )}

                {step === 2 && (
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', fontWeight: '800', textTransform: 'uppercase' }}>Secure Your Account</h3>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '20px' }}>Scan this QR code with Google Authenticator. This is optional but recommended.</p>

                        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px', display: 'inline-block' }}>
                            <img src={qrCode} alt="QR Code" style={{ width: '200px', height: '200px' }} />
                        </div>

                        <form onSubmit={handleVerifySubmit}>
                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Enter 6-digit code</label>
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
                                {loading ? 'Verifying...' : 'Enable & Finish'}
                            </button>
                        </form>

                        <button
                            onClick={handleSkip2FA}
                            disabled={loading}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#999',
                                marginTop: '25px',
                                fontSize: '11px',
                                fontWeight: '800',
                                textTransform: 'uppercase',
                                letterSpacing: '1.5px',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            Skip for now (I don't wish to implement)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;
