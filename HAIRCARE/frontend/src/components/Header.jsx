import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ onMenuClick, isSidebarOpen }) => {
    const { totalItems } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="app-header">
            <div className="header-container">
                <div className="header-left">
                    <button className="menu-toggle" onClick={onMenuClick} aria-label="Toggle Menu">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>

                    <div className={`header-logo ${isSidebarOpen ? 'fade-out' : ''}`}>
                        <Link to="/">
                            <span className="brand-main">Jasons</span>
                            <span className="brand-sub">haircare</span>
                        </Link>
                    </div>

                    <div className="header-search">
                        <input
                            type="text"
                            placeholder="Search products..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    navigate(`/products?search=${encodeURIComponent(e.target.value)}`);
                                }
                            }}
                        />
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                </div>

                <div className="header-actions">
                    <div className="header-auth">
                        {user ? (
                            <div className="user-profile-mini">
                                <span className="user-name">Hi, {user.name.split(' ')[0]}</span>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="header-auth-btn admin-link">Admin</Link>
                                )}
                                <button onClick={() => { logout(); navigate('/'); }} className="header-auth-btn">Logout</button>
                            </div>
                        ) : (
                            <div className="auth-links-header">
                                <Link to="/login" className="header-auth-btn">Login</Link>
                                <span className="auth-divider">/</span>
                                <Link to="/register" className="header-auth-btn">Join Now</Link>
                            </div>
                        )}
                    </div>

                    <Link to="/cart" className="header-cart">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                        {totalItems > 0 && (
                            <span className="cart-badge">{totalItems}</span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
