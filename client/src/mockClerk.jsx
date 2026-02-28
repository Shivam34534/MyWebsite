import React, { createContext, useContext, useState, useEffect } from 'react';

const MockClerkContext = createContext();

export const MockClerkProvider = ({ children }) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Check local storage for auth state on mount
        const storedAuth = sessionStorage.getItem('mock_auth_token');
        const storedUser = sessionStorage.getItem('mock_user_data');

        if (storedAuth && storedUser) {
            setIsSignedIn(true);
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                sessionStorage.setItem('dev_user', parsedUser.id);
            } catch (e) {
                console.error("Failed to parse mock user data", e);
                sessionStorage.removeItem('mock_auth_token');
                sessionStorage.removeItem('mock_user_data');
            }
        }
        setIsLoaded(true);
    }, []);

    const signIn = async ({ email, password }) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASEURL}/api/dev/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            const data = await response.json()

            if (data.success) {
                const foundUser = data.user
                sessionStorage.setItem('mock_auth_token', 'mock-token')
                sessionStorage.setItem('mock_user_data', JSON.stringify(foundUser))
                sessionStorage.setItem('dev_user', foundUser.id)
                sessionStorage.setItem('dev_user_password', password || '')

                setIsSignedIn(true)
                setUser(foundUser)
                return { success: true }
            } else {
                return { success: false, message: data.message }
            }
        } catch (error) {
            console.error("Login error:", error)
            return { success: false, message: "Server connection failed" }
        }
    };

    const signUp = async (userData) => {
        try {
            const formData = new FormData()
            formData.append('email', userData.email)
            formData.append('password', userData.password)
            formData.append('fullName', userData.fullName)
            if (userData.username) formData.append('username', userData.username)
            if (userData.location) formData.append('location', userData.location)
            if (userData.profileFile) {
                formData.append('profile', userData.profileFile)
            }
            if (userData.coverFile) {
                formData.append('cover', userData.coverFile)
            }

            const response = await fetch(`${import.meta.env.VITE_BASEURL}/api/dev/signup`, {
                method: 'POST',
                body: formData
            })
            const data = await response.json()

            if (data.success) {
                const newUser = {
                    id: data.user.id,
                    fullName: data.user.fullName,
                    primaryEmailAddress: { emailAddress: data.user.primaryEmailAddress.emailAddress },
                    password: data.user.password,
                    imageUrl: data.user.profile_picture || null,
                    profile_picture: data.user.profile_picture || null,
                    cover_picture: data.user.cover_picture || null,
                    username: data.user.username,
                    location: data.user.location,
                    followers: [],
                    following: [],
                };

                sessionStorage.setItem('mock_auth_token', 'mock-token');
                sessionStorage.setItem('mock_user_data', JSON.stringify(newUser));
                sessionStorage.setItem('dev_user', newUser.id);
                sessionStorage.setItem('dev_user_password', newUser.password)

                setIsSignedIn(true);
                setUser(newUser);
                return { success: true }
            } else {
                return { success: false, message: data.message }
            }
        } catch (error) {
            console.error("Signup error:", error)
            // Fallback to local-only signup if server is down (though it won't persist cross-browser)
            const newUser = {
                id: "mock-user-" + Date.now(),
                fullName: userData?.fullName || "User",
                username: userData?.username || `user_${Date.now()}`,
                primaryEmailAddress: { emailAddress: userData?.email || "user@example.com" },
                password: userData?.password || "",
                imageUrl: userData?.profile_picture || null,
                profile_picture: userData?.profile_picture || null,
                cover_picture: userData?.cover_picture || null,
                location: userData?.location || '',
                followers: [],
                following: [],
                ...userData
            };

            sessionStorage.setItem('mock_auth_token', 'mock-token');
            sessionStorage.setItem('mock_user_data', JSON.stringify(newUser));
            sessionStorage.setItem('dev_user', newUser.id);
            sessionStorage.setItem('dev_user_password', newUser.password)

            setIsSignedIn(true);
            setUser(newUser);
            return { success: true }
        }
    };

    const signOut = async () => {
        sessionStorage.removeItem('mock_auth_token');
        sessionStorage.removeItem('dev_user');
        sessionStorage.removeItem('dev_user_password');
        sessionStorage.removeItem('mock_user_data');
        setIsSignedIn(false);
        setUser(null);
    };

    const resetPassword = ({ email, newPassword }) => {
        const usersListStr = localStorage.getItem('mock_users_list');
        let usersList = usersListStr ? JSON.parse(usersListStr) : [];

        const userIndex = usersList.findIndex(u => u.primaryEmailAddress.emailAddress === email);

        if (userIndex !== -1) {
            usersList[userIndex].password = newPassword;
            localStorage.setItem('mock_users_list', JSON.stringify(usersList));

            // Also update current active user data if they happen to be "half logged in" or similar
            const storedUser = sessionStorage.getItem('mock_user_data');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                if (parsed.primaryEmailAddress.emailAddress === email) {
                    parsed.password = newPassword;
                    sessionStorage.setItem('mock_user_data', JSON.stringify(parsed));
                }
            }
            return true;
        }
        return false;
    };

    const value = {
        isSignedIn,
        isLoaded,
        user,
        signIn,
        signUp,
        signOut,
        resetPassword,
        getToken: async () => {
            const userId = sessionStorage.getItem('dev_user')
            const password = sessionStorage.getItem('dev_user_password')
            return `mock-token:${userId}:${password}`
        },
    };

    return (
        <MockClerkContext.Provider value={value}>
            {children}
        </MockClerkContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(MockClerkContext);
    if (!context) {
        throw new Error("useUser must be used within a MockClerkProvider");
    }
    return {
        user: context.user,
        isLoaded: context.isLoaded,
        isSignedIn: context.isSignedIn,
    };
};

export const useAuth = () => {
    const context = useContext(MockClerkContext);
    if (!context) {
        throw new Error("useAuth must be used within a MockClerkProvider");
    }
    return {
        isLoaded: context.isLoaded,
        userId: context.user?.id,
        sessionId: "mock-session-id",
        getToken: context.getToken,
        signOut: context.signOut,
    };
};

export const useClerk = () => {
    const context = useContext(MockClerkContext);
    if (!context) throw new Error("useClerk must be used within a MockClerkProvider");
    return {
        openSignIn: context.signIn,
        openSignUp: context.signUp,
        signOut: context.signOut,
        resetPassword: context.resetPassword,
        checkUser: async (email) => {
            const response = await fetch(`${import.meta.env.VITE_BASEURL}/api/dev/check-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })
            return await response.json()
        }
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
    const { signIn } = useContext(MockClerkContext);
    return <button onClick={signIn}>{children || 'Sign In'}</button>;
};

export const UserButton = () => {
    const { user } = useUser();
    return <div style={{ padding: '8px', backgroundColor: '#ddd', borderRadius: '4px' }}>{user?.fullName || 'User'}</div>;
};
