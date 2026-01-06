import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart();

    const shipping = subtotal > 50 || cartItems.length === 0 ? 0 : 5;
    const total = subtotal + shipping;

    if (cartItems.length === 0) {
        return (
            <div className="page-container">
                <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <h2>Your cart is empty</h2>
                    <p style={{ margin: '20px 0' }}>Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/products" className="btn btn-primary">Start Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="container">
                <div className="section-title">
                    <h2>Your Shopping Cart</h2>
                </div>

                <div className="cart-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px', marginTop: '40px' }}>
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item" style={{
                                display: 'grid',
                                gridTemplateColumns: '100px 1fr auto auto',
                                gap: '20px',
                                alignItems: 'center',
                                padding: '20px 0',
                                borderBottom: '1px solid #eee'
                            }}>
                                <img src={item.imageUrl} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '5px' }}>{item.name}</h3>
                                    <p style={{ color: '#666', fontSize: '0.9rem' }}>{item.category} | {item.hairType}</p>
                                    <p style={{ fontWeight: '600', marginTop: '5px' }}>${item.currentPrice.toFixed(2)}</p>
                                </div>
                                <div className="quantity-controls" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <button
                                        onClick={() => updateQuantity(item.id, -1)}
                                        style={{ width: '30px', height: '30px', border: '1px solid #ddd', background: 'white', borderRadius: '4px', cursor: 'pointer' }}
                                    >-</button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, 1)}
                                        style={{ width: '30px', height: '30px', border: '1px solid #ddd', background: 'white', borderRadius: '4px', cursor: 'pointer' }}
                                    >+</button>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: 'bold' }}>${(item.currentPrice * item.quantity).toFixed(2)}</p>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        style={{ color: '#ff4d4d', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', marginTop: '10px' }}
                                    >Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary" style={{ background: '#f9f9f9', padding: '30px', borderRadius: '8px', height: 'fit-content' }}>
                        <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Order Summary</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                        </div>
                        {shipping > 0 && <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '15px' }}>Free shipping over $50!</p>}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', paddingTop: '15px', borderTop: '2px solid #ddd', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>Proceed to Checkout</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
