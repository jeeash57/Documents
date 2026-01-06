import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
    return (
        <>
            {/* Overlay */}
            <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>

            <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className={`sidebar-brand ${isOpen ? 'fade-in' : ''}`}>
                        <NavLink to="/" onClick={onClose}>
                            <span className="brand-main">Jasons</span>
                            <span className="brand-sub">haircare</span>
                        </NavLink>
                    </div>
                    <button className="sidebar-close" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <ul className="nav-menu">
                        <li>
                            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={onClose}>
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/products" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={onClose}>
                                Shop All
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/products?tier=wholesale" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={onClose}>
                                Wholesale
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <p style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '2px' }}>Professional Haircare &copy; 2026</p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
