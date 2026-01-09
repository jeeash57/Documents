import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Products = () => {
    const [categories, setCategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart, priceTier, setPriceTier } = useCart();
    const { user } = useAuth();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                if (!response.ok) throw new Error('Failed to fetch products');
                const data = await response.json();
                const params = new URLSearchParams(location.search);
                const searchQuery = params.get('search')?.toLowerCase() || '';

                const filtered = searchQuery
                    ? data.filter(p =>
                        p.name.toLowerCase().includes(searchQuery) ||
                        p.category?.toLowerCase().includes(searchQuery) ||
                        p.description?.toLowerCase().includes(searchQuery) ||
                        p.hairType?.toLowerCase().includes(searchQuery)
                    )
                    : data;

                const grouped = filtered.reduce((acc, product) => {
                    const cat = product.category || 'Other';
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(product);
                    return acc;
                }, {});

                setCategories(grouped);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

        // Handle direct wholesale link
        const params = new URLSearchParams(location.search);
        if (params.get('tier') === 'wholesale') {
            setPriceTier('wholesale');
        }
    }, [location.search, setPriceTier]);

    const getPrice = (product) => {
        if (priceTier === 'wholesale') return product.nonPremiumWholesalePrice;
        if (priceTier === 'premium') return product.premiumWholesalePrice;
        return product.retailPrice;
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setQuantity(1);
    };

    const closeModal = () => {
        setSelectedProduct(null);
    };

    const isLocked = (priceTier === 'wholesale' || priceTier === 'premium') && !user;

    if (loading) return (
        <div className="page-container">
            <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                <div className="loading-spinner"></div>
                <p>Loading our collection...</p>
            </div>
        </div>
    );

    return (
        <div className="products-view">
            {/* Title Section - Slides behind header */}
            <div className="collection-header" style={{
                padding: '120px 40px 60px',
                textAlign: 'left',
                background: '#fff',
                position: 'relative',
                zIndex: 1
            }}>
                <h1 style={{ fontSize: '72px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '-4px', margin: '0', lineHeight: '0.9', color: '#000' }}>
                    {new URLSearchParams(location.search).get('search') ? 'Search Results' : 'Our Collection'}
                </h1>
                {new URLSearchParams(location.search).get('search') && (
                    <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <p style={{ fontSize: '18px', color: '#666', margin: 0, fontWeight: '500' }}>
                            Showing results for "{new URLSearchParams(location.search).get('search')}"
                        </p>
                        <button
                            onClick={() => navigate('/products')}
                            style={{ background: '#f0f0f0', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
                        >Clear Search</button>
                    </div>
                )}
                {!new URLSearchParams(location.search).get('search') && (
                    <p style={{ fontSize: '18px', color: '#666', marginTop: '20px', maxWidth: '500px', fontWeight: '500' }}>
                        Professional haircare tailored for every need
                    </p>
                )}
            </div>

            {/* Sticky Tier Switcher - Sticks flush with Header (80px) */}
            <div className="tier-sticky-wrapper" style={{
                position: 'sticky',
                top: '80px',
                zIndex: 900,
                background: 'rgba(255, 255, 255, 1)', // Fully opaque
                backdropFilter: 'blur(10px)',
                padding: '25px 40px',
                borderBottom: '2px solid #000', // Bolder border
                display: 'flex',
                gap: '60px', // Wider gap
                justifyContent: 'center', // Center justified
                alignItems: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)' // Subtle shadow for scroll visibility
            }}>
                <button
                    onClick={() => setPriceTier('retail')}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '10px 0',
                        fontSize: '16px', // Bigger font
                        fontWeight: '900', // Extreme bold
                        textTransform: 'uppercase',
                        letterSpacing: '3px', // Increased spacing
                        color: priceTier === 'retail' ? '#000' : '#bbb',
                        borderBottom: priceTier === 'retail' ? '4px solid #000' : '4px solid transparent',
                        transition: 'all 0.3s'
                    }}
                >Retail</button>
                <button
                    onClick={() => setPriceTier('wholesale')}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '10px 0',
                        fontSize: '16px', // Bigger font
                        fontWeight: '900', // Extreme bold
                        textTransform: 'uppercase',
                        letterSpacing: '3px', // Increased spacing
                        color: priceTier === 'wholesale' ? '#000' : '#bbb',
                        borderBottom: priceTier === 'wholesale' ? '4px solid #000' : '4px solid transparent',
                        transition: 'all 0.3s'
                    }}
                >Wholesale</button>
                <button
                    onClick={() => setPriceTier('premium')}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '10px 0',
                        fontSize: '16px', // Bigger font
                        fontWeight: '900', // Extreme bold
                        textTransform: 'uppercase',
                        letterSpacing: '3px', // Increased spacing
                        color: priceTier === 'premium' ? '#000' : '#bbb',
                        borderBottom: priceTier === 'premium' ? '4px solid #000' : '4px solid transparent',
                        transition: 'all 0.3s'
                    }}
                >Premium Wholesale</button>
            </div>

            <div className="collection-grid-container" style={{ padding: '60px 40px', position: 'relative' }}>
                {isLocked && (
                    <div className="registration-gate-overlay" style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1000,
                        background: 'white',
                        padding: '60px',
                        textAlign: 'center',
                        maxWidth: '500px',
                        width: '90%',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.1)',
                        position: 'fixed'
                    }}>
                        {/* Close Button */}
                        <button
                            onClick={() => setPriceTier('retail')}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: '#000',
                                fontWeight: '300',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                                transition: 'background 0.3s'
                            }}
                            onMouseOver={(e) => e.target.style.background = '#f0f0f0'}
                            onMouseOut={(e) => e.target.style.background = 'none'}
                        >
                            &times;
                        </button>

                        <h2 style={{ fontSize: '32px', marginBottom: '20px', fontWeight: '800', textTransform: 'uppercase' }}>Member Exclusive</h2>
                        <p style={{ color: '#666', marginBottom: '30px', fontSize: '16px', lineHeight: '1.6' }}>
                            Wholesale rates are reserved for our partners. Join or login to access.
                        </p>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                            <button className="btn-primary-rw" onClick={() => navigate('/register')} style={{ padding: '15px 40px', fontSize: '12px' }}>Join Now</button>
                            <button className="btn-outline-rw" onClick={() => navigate('/login')} style={{ padding: '15px 40px', fontSize: '12px', color: '#000', borderColor: '#000' }}>Login</button>
                        </div>
                    </div>
                )}

                <div style={{ filter: isLocked ? 'blur(25px)' : 'none', pointerEvents: isLocked ? 'none' : 'auto', transition: 'filter 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    {Object.keys(categories).length > 0 ? Object.keys(categories).map(category => (
                        <section key={category} style={{ marginBottom: '100px' }}>
                            <div style={{ marginBottom: '40px' }}>
                                <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#000' }}>{category}</h3>
                            </div>
                            <div className="product-grid" style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)', // Forced 4 columns for "at least 4" on large screens
                                gap: '40px'
                            }}>
                                {categories[category].map(product => (
                                    <div key={product.id} className="product-card" style={{ padding: '0', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer' }} onClick={() => handleProductClick(product)}>
                                        <div style={{ background: '#f6f6f6', padding: '50px', borderRadius: '0', marginBottom: '25px', display: 'flex', justifyContent: 'center', transition: 'background 0.3s' }}>
                                            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '350px', objectFit: 'contain' }} />
                                        </div>
                                        <div style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: '#999', letterSpacing: '2px' }}>{product.hairType}</div>
                                        <h4 style={{ fontSize: '18px', fontWeight: '800', margin: '12px 0 8px', color: '#000', lineHeight: '1.2' }}>{product.name}</h4>
                                        <div style={{ fontSize: '18px', fontWeight: '400', color: '#000', marginBottom: '15px' }}>${getPrice(product).toFixed(2)}</div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); addToCart(product, 1); }}
                                            style={{ padding: '12px 30px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '2px', transition: 'all 0.3s' }}
                                        >Add to Cart</button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )) : (
                        <div style={{ textAlign: 'center', padding: '100px 0' }}>
                            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#000' }}>No products found</h2>
                            <p style={{ color: '#666', marginTop: '20px' }}>Try searching with different keywords or browse our categories.</p>
                            <button
                                onClick={() => navigate('/products')}
                                className="btn-primary-rw"
                                style={{ marginTop: '30px', padding: '15px 40px' }}
                            >View All Products</button>
                        </div>
                    )}
                </div>
            </div>

            {/* PRODUCT DETAILS MODAL */}
            {selectedProduct && (
                <div className="product-modal-overlay" onClick={closeModal} style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(15px)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    animation: 'fadeIn 0.3s'
                }}>
                    <div className="product-modal-content" onClick={e => e.stopPropagation()} style={{
                        background: '#fff',
                        width: '100%', maxWidth: '1000px',
                        borderRadius: '0',
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1fr',
                        overflow: 'hidden',
                        boxShadow: '0 50px 100px -20px rgba(0,0,0,0.3)',
                        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <div style={{
                            background: '#f6f6f6',
                            padding: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <img src={selectedProduct.imageUrl} alt={selectedProduct.name} style={{
                                width: '100%', maxHeight: '500px', objectFit: 'contain',
                                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))'
                            }} />
                        </div>

                        <div style={{ padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <span style={{
                                    fontSize: '11px', fontWeight: '900', textTransform: 'uppercase',
                                    color: 'var(--pop-primary, #8b5cf6)', letterSpacing: '2px'
                                }}>{selectedProduct.hairType}</span>
                                <button onClick={closeModal} style={{
                                    background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', padding: '0', lineHeight: 1
                                }}>&times;</button>
                            </div>

                            <h2 style={{
                                fontSize: '42px', fontWeight: '900', margin: '0 0 20px',
                                textTransform: 'uppercase', letterSpacing: '-2px', lineHeight: '0.9'
                            }}>{selectedProduct.name}</h2>

                            <div style={{ fontSize: '24px', fontWeight: '500', marginBottom: '30px' }}>
                                ${getPrice(selectedProduct).toFixed(2)}
                            </div>

                            <p style={{
                                fontSize: '16px', lineHeight: '1.8', color: '#666', marginBottom: '40px',
                                fontWeight: '400'
                            }}>
                                {selectedProduct.description || "Experience professional care with this premium formulation."}
                            </p>

                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '1px' }}>Quantity</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #eee', width: 'fit-content', padding: '5px' }}>
                                    <button
                                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                        style={{ background: 'none', border: 'none', padding: '10px 15px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}
                                    >-</button>
                                    <span style={{ fontSize: '18px', fontWeight: '600', minWidth: '30px', textAlign: 'center' }}>{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(prev => prev + 1)}
                                        style={{ background: 'none', border: 'none', padding: '10px 15px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}
                                    >+</button>
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto' }}>
                                <button
                                    onClick={() => { addToCart(selectedProduct, quantity); closeModal(); }}
                                    style={{
                                        width: '100%',
                                        padding: '20px',
                                        background: '#000',
                                        color: '#fff',
                                        border: 'none',
                                        fontSize: '14px',
                                        fontWeight: '800',
                                        textTransform: 'uppercase',
                                        letterSpacing: '2px',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s',
                                        marginBottom: '15px'
                                    }}
                                    onMouseOver={(e) => e.target.style.opacity = '0.9'}
                                    onMouseOut={(e) => e.target.style.opacity = '1'}
                                >
                                    Add to Cart - ${(getPrice(selectedProduct) * quantity).toFixed(2)}
                                </button>
                                <div style={{ fontSize: '12px', color: '#999', textAlign: 'center' }}>
                                    Free shipping on orders over $50
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .product-card:hover img { transform: scale(1.05); transition: transform 0.5s ease; }
            `}</style>
        </div>
    );
};

export default Products;
