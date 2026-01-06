import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
    const { cartItems, subtotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        paymentMethod: 'card'
    });

    const shipping = subtotal > 50 ? 0 : 5;
    const total = subtotal + shipping;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const orderDetails = {
            items: cartItems.map(item => ({
                productId: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.currentPrice
            })),
            customer: {
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address
            },
            paymentMethod: formData.paymentMethod,
            subtotal,
            shipping,
            total
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderDetails)
            });

            if (response.ok) {
                setSuccess(true);
                clearCart();
                setTimeout(() => {
                    navigate('/');
                }, 5000);
            } else {
                alert('Failed to create order. Please try again.');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="page-container">
                <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <div style={{ color: '#4CAF50', fontSize: '4rem', marginBottom: '20px' }}>✓</div>
                    <h2>Order created, redirecting to payment portal...</h2>
                    <p style={{ marginTop: '20px', color: '#666' }}>Thank you for your order! You will be redirected shortly.</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="page-container">
                <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <h2>Your cart is empty</h2>
                    <button className="btn btn-primary" onClick={() => navigate('/products')}>Go to Shop</button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="container">
                <div className="section-title">
                    <h2>Checkout</h2>
                </div>

                <div className="checkout-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px', marginTop: '40px' }}>
                    <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '8px', border: '1px solid #eee' }}>
                        <h3 style={{ marginBottom: '25px' }}>Shipping Details</h3>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Full Name</label>
                                <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} placeholder="John Doe" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Email</label>
                                    <input type="email" name="email" required value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Phone</label>
                                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} placeholder="021 123 4567" />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Shipping Address</label>
                                <textarea name="address" required value={formData.address} onChange={handleChange} rows="3" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} placeholder="123 Queen St, Auckland Central, Auckland 1010"></textarea>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Payment Method</label>
                                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}>
                                    <option value="card">Card (Stripe)</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '20px', padding: '15px' }}>
                                {loading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                            </button>
                        </div>
                    </form>

                    <div className="order-summary" style={{ background: '#f9f9f9', padding: '30px', borderRadius: '8px', height: 'fit-content' }}>
                        <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Order Summary</h3>
                        <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
                            {cartItems.map(item => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '0.9rem' }}>
                                    <span>{item.quantity}x {item.name}</span>
                                    <span>${(item.currentPrice * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingTop: '15px', borderTop: '1px solid #ddd' }}>
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', paddingTop: '15px', borderTop: '2px solid #ddd' }}>
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
