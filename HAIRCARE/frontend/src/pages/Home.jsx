import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    // Curated products data (mock)
    const curatedProducts = [
        { id: 1, name: 'Luminous Mist', price: 45, category: 'Best Seller', img: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=400' },
        { id: 2, name: 'Velvet Serum', price: 58, category: 'New Arrival', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400' },
        { id: 3, name: 'Hydra Ritual', price: 62, category: 'Top Rated', img: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=400' },
        { id: 4, name: 'Sculpting Clay', price: 38, category: 'Pro Choice', img: 'https://images.unsplash.com/photo-1594465919760-441fe5908ab0?auto=format&fit=crop&q=80&w=400' }
    ];

    return (
        <div className="home-view">
            {/* Hero Section */}
            <section className="hero-fullscreen" style={{
                height: 'calc(100vh - 80px)',
                position: 'relative',
                overflow: 'hidden',
                background: '#000',
                display: 'flex',
                alignItems: 'center',
                padding: '0 80px'
            }}>
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.8,
                        zIndex: 0
                    }}
                >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-flowing-purple-and-blue-colors-background-23000-large.mp4" type="video/mp4" />
                </video>
                <div className="hero-overlay" style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 100%)',
                    zIndex: 1
                }}></div>

                <div className="hero-content" style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
                    <span style={{
                        color: 'var(--pop-primary)',
                        textTransform: 'uppercase',
                        letterSpacing: '5px',
                        fontSize: '12px',
                        fontWeight: '900',
                        display: 'block',
                        marginBottom: '20px',
                        textShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
                    }}>Professional Sculpting Hub</span>
                    <h1 style={{
                        fontSize: '110px',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        letterSpacing: '-6px',
                        lineHeight: '0.8',
                        color: '#fff',
                        margin: '0',
                        fontStyle: 'italic'
                    }}>
                        VIBRANT<br /><span style={{ color: 'var(--pop-secondary)' }}>ENERGY.</span>
                    </h1>
                    <p style={{ color: '#eee', fontSize: '22px', marginTop: '30px', maxWidth: '550px', lineHeight: '1.4', fontWeight: '400' }}>
                        Breaking the boundaries of monochrome. Experience professional grade formulas in a spectrum of excellence.
                    </p>
                    <div style={{ marginTop: '50px', display: 'flex', gap: '20px' }}>
                        <Link to="/products" className="btn-primary-rw" style={{ background: 'var(--pop-gradient)', border: 'none', color: '#fff' }}>Shop All</Link>
                        <Link to="/wholesale" className="btn-outline-rw" style={{ borderColor: 'var(--pop-primary)', color: 'var(--pop-primary)' }}>Partnerships</Link>
                    </div>
                </div>
            </section>

            {/* Curated For You Section */}
            <section className="curated-section" style={{ padding: '120px 80px', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '80px' }}>
                    <div>
                        <h2 style={{ fontSize: '56px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-3px', margin: 0, lineHeight: 1 }}>Curated<br />For You</h2>
                        <div style={{ width: '80px', height: '8px', background: 'var(--pop-gradient)', marginTop: '20px' }}></div>
                    </div>
                    <Link to="/products" className="vibrant-link" style={{
                        fontSize: '14px',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        color: 'var(--pop-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        View All <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </Link>
                </div>

                <div className="product-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '40px'
                }}>
                    {curatedProducts.map(product => (
                        <div key={product.id} className="vibrant-card" style={{ position: 'relative' }}>
                            <div style={{
                                background: 'var(--soft-glow)',
                                padding: '60px',
                                marginBottom: '25px',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'transform 0.5s ease'
                            }}>
                                <img src={product.img} alt={product.name} style={{ width: '100%', height: '320px', objectFit: 'contain' }} />
                                <div className="card-accent" style={{
                                    position: 'absolute',
                                    bottom: 0, left: 0, width: '100%', height: '4px',
                                    background: 'var(--pop-gradient)',
                                    transform: 'scaleX(0)',
                                    transition: 'transform 0.3s ease'
                                }}></div>
                            </div>
                            <span style={{
                                fontSize: '11px',
                                fontWeight: '900',
                                color: 'var(--pop-secondary)',
                                letterSpacing: '2px',
                                textTransform: 'uppercase'
                            }}>{product.category}</span>
                            <h3 style={{ fontSize: '20px', fontWeight: '900', margin: '12px 0', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>{product.name}</h3>
                            <div style={{ fontSize: '18px', fontWeight: '500', color: '#000' }}>${product.price}.00</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* View All Call to Action */}
            <section className="cta-full-width" style={{
                padding: '150px 80px',
                background: 'var(--pop-gradient)',
                color: '#fff',
                textAlign: 'center'
            }}>
                <h2 style={{ fontSize: '72px', color: '#fff', marginBottom: '30px', lineHeight: 1 }}>DISCOVER THE FULL<br />SPECTRUM.</h2>
                <p style={{ fontSize: '20px', marginBottom: '60px', maxWidth: '600px', margin: '0 auto 60px', opacity: 0.9 }}>
                    From vibrant pigments to restorative rituals, explore our complete professional collection online.
                </p>
                <Link to="/products" className="btn-primary-rw" style={{ background: '#fff', color: '#000', padding: '25px 80px', fontSize: '16px' }}>View All Products</Link>
            </section>
        </div>
    );
};

export default Home;
