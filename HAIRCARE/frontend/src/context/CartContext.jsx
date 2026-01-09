import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [priceTier, setPriceTier] = useState('retail'); // 'retail', 'wholesale', 'premium'

    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + (typeof quantity === 'number' ? quantity : 1) }
                        : item
                );
            }
            // Determine price based on current tier
            let price = product.retailPrice;
            if (priceTier === 'wholesale') price = product.nonPremiumWholesalePrice;
            if (priceTier === 'premium') price = product.premiumWholesalePrice;

            return [...prevItems, { ...product, quantity: (typeof quantity === 'number' ? quantity : 1), currentPrice: price }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, delta) => {
        setCartItems(prevItems =>
            prevItems.map(item => {
                if (item.id === productId) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            })
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            subtotal,
            priceTier,
            setPriceTier
        }}>
            {children}
        </CartContext.Provider>
    );
};
