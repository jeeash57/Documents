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
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                if (!response.ok) throw new Error('Failed to fetch products');
                const data = await response.json();

                const grouped = data.reduce((acc, product) => {
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
                    Our Collection
                </h1>
                <p style={{ fontSize: '18px', color: '#666', marginTop: '20px', maxWidth: '500px', fontWeight: '500' }}>
                    Professional haircare tailored for every need
                </p>
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
                    {Object.keys(categories).map(category => (
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
                                    <div key={product.id} className="product-card" style={{ padding: '0', border: 'none', background: 'transparent', textAlign: 'left' }}>
                                        <div style={{ background: '#f6f6f6', padding: '50px', borderRadius: '0', marginBottom: '25px', display: 'flex', justifyContent: 'center' }}>
                                            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '350px', objectFit: 'contain' }} />
                                        </div>
                                        <div style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: '#999', letterSpacing: '2px' }}>{product.hairType}</div>
                                        <h4 style={{ fontSize: '18px', fontWeight: '800', margin: '12px 0 8px', color: '#000', lineHeight: '1.2' }}>{product.name}</h4>
                                        <div style={{ fontSize: '18px', fontWeight: '400', color: '#000', marginBottom: '15px' }}>${getPrice(product).toFixed(2)}</div>
                                        <button
                                            onClick={() => addToCart(product)}
                                            style={{ padding: '12px 30px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '2px', transition: 'all 0.3s' }}
                                        >Add to Cart</button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Products;
