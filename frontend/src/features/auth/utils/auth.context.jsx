import { createContext, useEffect, useState } from 'react';
import { getMe } from '../services/auth.api.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user,setUser , loading , setLoading }}>
            {children}
        </AuthContext.Provider>
    );
}