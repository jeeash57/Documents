import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem('hc_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            setIsRegistered(true);
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        setIsRegistered(true);
        localStorage.setItem('hc_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('hc_user');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isRegistered,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};
