const Wholesale = () => {
    return (
        <div className="page-container">
            <section>
                <div className="container">
                    <div className="section-title">
                        <h2>Wholesale Partnerships</h2>
                        <p>Partner with New Zealand's leading haircare distributor</p>
                    </div>

                    <div className="wholesale-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="wholesale-card" style={{ background: '#fdf8fd', padding: '40px', borderRadius: '8px', border: '1px solid #eee' }}>
                            <h3>Why Partner With Us?</h3>
                            <ul style={{ marginTop: '20px', paddingLeft: '20px' }}>
                                <li style={{ marginBottom: '15px' }}>Access to 50+ premium international brands</li>
                                <li style={{ marginBottom: '15px' }}>Exclusive salon-only pricing and promotions</li>
                                <li style={{ marginBottom: '15px' }}>Dedicated account management and support</li>
                                <li style={{ marginBottom: '15px' }}>Fast, reliable nationwide shipping</li>
                                <li style={{ marginBottom: '15px' }}>Marketing materials and staff training</li>
                            </ul>

                            <div style={{ marginTop: '40px' }}>
                                <h3>Apply for a Wholesale Account</h3>
                                <p style={{ margin: '15px 0' }}>Fill out the form below and our team will get back to you within 24 hours.</p>
                                <form style={{ display: 'grid', gap: '15px' }}>
                                    <input type="text" placeholder="Salon Name" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
                                    <input type="email" placeholder="Email Address" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
                                    <input type="text" placeholder="Phone Number" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
                                    <textarea placeholder="Tell us about your business" rows="4" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}></textarea>
                                    <button type="submit" className="btn btn-primary">Submit Application</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Wholesale;
