import React, { createContext, useContext, useState, useEffect } from 'react';
import api from './api/axios';

const AuthContext = createContext();

export const MockClerkProvider = ({ children }) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsSignedIn(true);
            } catch (e) {
                console.error("Failed to parse user data", e);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setIsLoaded(true);
    }, []);

    const signIn = React.useCallback(async ({ email, password }) => {
        try {
            const { data } = await api.post('/api/auth/login', { email, password });
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                setUser(data.user);
                setIsSignedIn(true);
                return { success: true };
            }
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: error.response?.data?.message || "Server connection failed" };
        }
    }, []);

    const signUp = React.useCallback(async (userData) => {
        try {
            const { data } = await api.post('/api/auth/register', {
                fullName: userData.fullName,
                email: userData.email,
                password: userData.password,
                username: userData.username,
                location: userData.location,
                profile_picture: userData.profile_picture || userData.profileFile, 
                cover_picture: userData.cover_picture || userData.coverFile
            });

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                setUser(data.user);
                setIsSignedIn(true);
                return { success: true };
            }
        } catch (error) {
            console.error("Signup error:", error);
            return { success: false, message: error.response?.data?.message || "Server connection failed" };
        }
    }, []);

    const signOut = React.useCallback(async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsSignedIn(false);
        setUser(null);
    }, []);

    const resetPassword = React.useCallback(async ({ email, newPassword }) => {
        return { success: false, message: "Password reset not fully implemented in real backend." };
    }, []);

    const getToken = React.useCallback(async () => {
        return localStorage.getItem('token');
    }, []);

    const value = React.useMemo(() => ({
        isSignedIn,
        isLoaded,
        user,
        signIn,
        signUp,
        signOut,
        resetPassword,
        getToken,
    }), [isSignedIn, isLoaded, user, signIn, signUp, signOut, resetPassword, getToken]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useUser must be used within a Provider");
    return { user: context.user, isLoaded: context.isLoaded, isSignedIn: context.isSignedIn };
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within a Provider");
    return { isLoaded: context.isLoaded, userId: context.user?.id, sessionId: "real-session", getToken: context.getToken, signOut: context.signOut };
};

export const useClerk = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useClerk must be used within a Provider");
    return {
        openSignIn: context.signIn,
        openSignUp: context.signUp,
        signOut: context.signOut,
        resetPassword: context.resetPassword,
        sendOtp: async (email, otp) => { return { success: true, message: "Mock OTP check" } },
        checkUser: async (email) => { return { success: true } }
    };
};

export const SignedIn = ({ children }) => {
    const { isSignedIn } = useUser();
    return isSignedIn ? <>{children}</> : null;
};

export const SignedOut = ({ children }) => {
    const { isSignedIn } = useUser();
    return !isSignedIn ? <>{children}</> : null;
};

export const SignInButton = ({ children }) => {
    const { signIn } = useContext(AuthContext);
    return <button onClick={() => signIn({})}>{children || 'Sign In'}</button>;
};

export const UserButton = () => {
    const { user } = useUser();
    return <div style={{ padding: '8px', backgroundColor: '#ddd', borderRadius: '4px' }}>{user?.fullName || 'User'}</div>;
};
