import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './Home.css';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('products'); // Default to products for CRUD
    const [editingProduct, setEditingProduct] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);

    // Initial Product State
    const initialProductState = {
        name: '', category: '', description: '', hairType: '', imageUrl: '',
        retailPrice: 0, nonPremiumWholesalePrice: 0, premiumWholesalePrice: 0,
        discountRate: 0
    };
    const [productForm, setProductForm] = useState(initialProductState);

    // Initial User State
    const initialUserState = { name: '', email: '', role: 'user', verified: false, address: '', phone: '', password: '' };
    const [userForm, setUserForm] = useState(initialUserState);

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchUsers();
            fetchProducts();
        }
    }, [user]);

    const fetchUsers = async () => {
        const res = await fetch('/api/admin/users');
        if (res.ok) setUsers(await res.json());
    };

    const fetchProducts = async () => {
        const res = await fetch('/api/products');
        if (res.ok) setProducts(await res.json());
    };

    // --- Product Logic ---
    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
        const method = editingProduct ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productForm)
        });

        if (res.ok) {
            setShowProductModal(false);
            setEditingProduct(null);
            setProductForm(initialProductState);
            fetchProducts();
        }
    };

    const handleEditProduct = (p) => {
        setEditingProduct(p);
        setProductForm(p);
        setShowProductModal(true);
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
            if (res.ok) fetchProducts();
        }
    };

    const openNewProductModal = () => {
        setEditingProduct(null);
        setProductForm(initialProductState);
        setShowProductModal(true);
    };

    // --- User Logic ---
    const handleUserSubmit = async (e) => {
        e.preventDefault();
        const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';
        const method = editingUser ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userForm)
        });
        if (res.ok) {
            setShowUserModal(false);
            setEditingUser(null);
            setUserForm(initialUserState);
            fetchUsers();
        }
    };

    const handleEditUser = (u) => {
        setEditingUser(u);
        setUserForm({ ...u, password: '' });
        setShowUserModal(true);
    };

    const openNewUserModal = () => {
        setEditingUser(null);
        setUserForm(initialUserState);
        setShowUserModal(true);
    };

    // Calc Logic
    const calculatedRate = productForm.retailPrice * (1 - (productForm.discountRate || 0) / 100);

    if (!user || user.role !== 'admin') return <Navigate to="/" />;

    return (
        <div className="admin-dashboard container py-5">
            <h1 className="mb-4">Admin Dashboard</h1>

            <div className="admin-tabs mb-4">
                <button className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-outline-primary'} me-2`} onClick={() => setActiveTab('products')}>Products</button>
                <button className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('users')}>Users</button>
            </div>

            {/* PRODUCT TAB */}
            {activeTab === 'products' && (
                <div className="card p-4 border-0 shadow-sm rounded-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3>Product Management</h3>
                        <button className="btn btn-primary" onClick={openNewProductModal}>+ Add Product</button>
                    </div>
                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th>Image</th><th>Name</th><th>Category</th><th>Retail</th><th>Disc%</th><th>New Rate</th><th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id}>
                                        <td><img src={p.imageUrl} style={{ width: 40, height: 40, objectFit: 'cover' }} alt="" /></td>
                                        <td>{p.name}</td>
                                        <td>{p.category}</td>
                                        <td>${p.retailPrice}</td>
                                        <td>{p.discountRate}%</td>
                                        <td>${(p.appliedNewRetailRate || p.retailPrice).toFixed(2)}</td>
                                        <td>${p.nonPremiumWholesalePrice || 0} / ${p.premiumWholesalePrice || 0}</td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEditProduct(p)}>Edit</button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteProduct(p.id)}>Del</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* USER TAB */}
            {activeTab === 'users' && (
                <div className="card p-4 border-0 shadow-sm rounded-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3>User Management</h3>
                        <button className="btn btn-primary" onClick={openNewUserModal}>+ Add User</button>
                    </div>
                    <div className="table-responsive mt-3">
                        <table className="table align-middle">
                            <thead>
                                <tr><th>Email</th><th>Name</th><th>Role</th><th>Verified</th><th>Location</th><th>Contact</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td>{u.email}</td>
                                        <td>{u.name}</td>
                                        <td><span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>{u.role}</span></td>
                                        <td>{u.verified ? '✅' : '❌'}</td>
                                        <td><small>{u.address || `${u.city || ''}, ${u.country || ''}`}</small></td>
                                        <td>{u.phone || 'N/A'}</td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-secondary" onClick={() => handleEditUser(u)}>Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* PRODUCT MODAL */}
            {showProductModal && (
                <div className="modal-overlay">
                    <div className="modal-content p-4">
                        <h4>{editingProduct ? 'Edit Product' : 'Add New Product'}</h4>
                        <form onSubmit={handleProductSubmit}>
                            <div className="row g-2">
                                <div className="col-12"><label>Name</label><input className="form-control" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required /></div>
                                <div className="col-6"><label>Category</label><input className="form-control" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} /></div>
                                <div className="col-6"><label>Hair Type</label><input className="form-control" value={productForm.hairType} onChange={e => setProductForm({ ...productForm, hairType: e.target.value })} /></div>
                                <div className="col-12"><label>Description</label><textarea className="form-control" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} /></div>
                                <div className="col-12"><label>Image URL</label><input className="form-control" value={productForm.imageUrl} onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })} /></div>
                                <div className="col-4"><label>Retail Price</label><input type="number" step="0.01" className="form-control" value={productForm.retailPrice} onChange={e => setProductForm({ ...productForm, retailPrice: e.target.value })} required /></div>
                                <div className="col-4"><label>Wholesale Price</label><input type="number" step="0.01" className="form-control" value={productForm.nonPremiumWholesalePrice} onChange={e => setProductForm({ ...productForm, nonPremiumWholesalePrice: e.target.value })} /></div>
                                <div className="col-4"><label>Premium Price</label><input type="number" step="0.01" className="form-control" value={productForm.premiumWholesalePrice} onChange={e => setProductForm({ ...productForm, premiumWholesalePrice: e.target.value })} /></div>
                                <div className="col-4"><label>Discount (%)</label><input type="number" step="0.01" className="form-control" value={productForm.discountRate} onChange={e => setProductForm({ ...productForm, discountRate: e.target.value })} /></div>
                            </div>
                            <div className="mt-3 text-end">
                                <button type="button" className="btn btn-light me-2" onClick={() => setShowProductModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* USER MODAL */}
            {showUserModal && (
                <div className="modal-overlay">
                    <div className="modal-content p-4">
                        <h4>{editingUser ? 'Edit User' : 'Add New User'}</h4>
                        <form onSubmit={handleUserSubmit}>
                            <div className="mb-2"><label>Name</label><input className="form-control" value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} required /></div>
                            <div className="mb-2"><label>Email</label><input className="form-control" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} required /></div>
                            <div className="mb-2">
                                <label>{editingUser ? 'New Password (leave blank to keep current)' : 'Password'}</label>
                                <input type="password" className="form-control" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} required={!editingUser} />
                            </div>
                            <div className="mb-2"><label>Address</label><input className="form-control" value={userForm.address} onChange={e => setUserForm({ ...userForm, address: e.target.value })} /></div>
                            <div className="mb-2"><label>Contact Number (Phone)</label><input className="form-control" value={userForm.phone} onChange={e => setUserForm({ ...userForm, phone: e.target.value })} /></div>
                            <div className="mb-2"><label>Role</label>
                                <select className="form-select" value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="mt-3 text-end">
                                <button type="button" className="btn btn-light me-2" onClick={() => setShowUserModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .modal-overlay { position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; z-index: 1000; }
                .modal-content { background: white; width: 90%; max-width: 600px; border-radius: 8px; }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
