import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { totalItems } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div className="navbar-top">
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="navbar-logo">
                        <Link to="/" style={{ textDecoration: 'none', fontSize: '24px', fontWeight: '800', display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: '#333' }}>Jasons</span>
                            <span style={{ color: 'var(--primary-color)' }}>haircare</span>
                            <span style={{ fontSize: '12px', marginLeft: '2px', color: '#999' }}>.CO.NZ</span>
                        </Link>
                    </div>

                    <div className="navbar-search" style={{ flex: '0 1 400px', display: 'flex', position: 'relative' }}>
                        <input type="text" placeholder="Search for products..." style={{ width: '100%', padding: '10px 15px', borderRadius: '25px', border: '1px solid #eee' }} />
                        <button style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </button>
                    </div>

                    <div className="navbar-actions" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span style={{ fontSize: '13px', fontWeight: '600' }}>Hi, {user.name}</span>
                                <button onClick={() => { logout(); navigate('/'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#666' }}>Logout</button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="nav-icon-link" style={{ textDecoration: 'none', color: '#333', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                    <span style={{ fontSize: '11px' }}>Login</span>
                                </Link>
                                <Link to="/register" className="nav-icon-link" style={{ textDecoration: 'none', color: '#333', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="16" y1="11" x2="22" y2="11"></line></svg>
                                    <span style={{ fontSize: '11px' }}>Join</span>
                                </Link>
                            </>
                        )}
                        <Link to="/cart" className="nav-icon-link" style={{ textDecoration: 'none', color: '#333', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', position: 'relative' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                            <span style={{ fontSize: '11px' }}>Cart</span>
                            {totalItems > 0 && (
                                <span style={{ position: 'absolute', top: '-10px', right: '-8px', background: 'var(--primary-color)', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold' }}>{totalItems}</span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
            <div className="navbar-bottom" style={{ borderTop: '1px solid #f5f5f5', padding: '10px 0' }}>
                <div className="container">
                    <ul className="nav-links" style={{ listStyle: 'none', display: 'flex', justifyContent: 'center', gap: '30px', margin: 0, padding: 0 }}>
                        <li><Link to="/" style={{ textDecoration: 'none', color: '#333', fontSize: '13px', fontWeight: '600' }}>Home</Link></li>
                        <li><Link to="/products" style={{ textDecoration: 'none', color: '#333', fontSize: '13px', fontWeight: '600' }}>Shop All</Link></li>
                        <li><Link to="/products?tier=wholesale" style={{ textDecoration: 'none', color: 'var(--primary-color)', fontSize: '13px', fontWeight: '700' }}>Wholesale Access</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
