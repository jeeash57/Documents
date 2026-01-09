import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        address: '',
        city: '',
        zip: '',
        country: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
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
                // Login immediately after successful registration
                login(data.user);
                navigate('/products');
            } else {
                setError(data.error || 'Registration failed');
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

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Full Name</label>
                        <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Email Address</label>
                        <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
                    </div>
                    <div style={{ marginBottom: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Phone</label>
                            <input type="text" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Country</label>
                            <input type="text" required value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
                        </div>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Address</label>
                        <input type="text" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
                    </div>
                    <div style={{ marginBottom: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>City</label>
                            <input type="text" required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Postcode</label>
                            <input type="text" required value={formData.zip} onChange={(e) => setFormData({ ...formData, zip: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
                        </div>
                    </div>
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Password</label>
                        <input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
                    </div>
                    <button type="submit" className="btn btn-primary-rw" disabled={loading} style={{ width: '100%', padding: '15px' }}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                    <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px', fontWeight: '500', textTransform: 'uppercase' }}>
                        Already have an account? <Link to="/login" style={{ color: '#000', fontWeight: '800', textDecoration: 'underline' }}>Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
