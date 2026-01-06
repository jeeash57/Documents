import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-section">
                        <h3>Contact Us</h3>
                        <p>Phone: 006421678032</p>
                        <p>Email: support@haircare.co.nz</p>
                        <p>Hours: Mon-Fri 9am - 10wpm</p>
                    </div>
                    <div className="footer-section">
                        <h3>Customer Care</h3>
                        <ul>
                            <li><a href="#">Shipping & Delivery</a></li>
                            <li><a href="#">Returns & Exchanges</a></li>
                            <li><a href="#">FAQ</a></li>
                            <li><a href="#">Track My Order</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Get To Know Us</h3>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Our Blog</a></li>
                            <li><a href="#">Terms & Conditions</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Newsletter</h3>
                        <p>Subscribe to get the latest news and offers.</p>
                        <form className="newsletter-form">
                            <input type="email" placeholder="Your email address" />
                            <button type="submit">Subscribe</button>
                        </form>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 HAIRCARE.CO.NZ. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
