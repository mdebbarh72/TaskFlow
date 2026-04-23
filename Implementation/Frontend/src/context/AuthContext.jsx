import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Only check auth if we have a stored token
  const checkAuthStatus = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/profile');
      setUser(response.data);
    } catch (error) {
      // Token is invalid or expired
      localStorage.removeItem('auth_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const data = response.data;

    // Handle OTP requirement
    if (data.requires_otp) {
      return data;
    }

    // Store the token
    localStorage.setItem('auth_token', data.token);

    // Fetch user profile with the new token
    const profileRes = await api.get('/profile');
    setUser(profileRes.data);
    return profileRes.data;
  };

  const signup = async (formData) => {
    // 1. Register
    await api.post('/auth/register', formData);

    // 2. Auto-login to obtain a token
    const loginRes = await api.post('/auth/login', {
      email: formData.email,
      password: formData.password,
    });

    if (loginRes.data.requires_otp) {
      return loginRes.data;
    }

    // 3. Store the token
    localStorage.setItem('auth_token', loginRes.data.token);

    // 4. Fetch user profile
    const profileRes = await api.get('/profile');
    setUser(profileRes.data);
    return profileRes.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore — token may already be invalid
    }
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const verifyOTP = async (userId, code, purpose) => {
    const response = await api.post('/auth/verify-otp', {
      user_id: userId,
      code,
      purpose
    });
    
    const data = response.data;
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      
      // Fetch user profile now that we are fully authenticated
      const profileRes = await api.get('/profile');
      setUser(profileRes.data);
      return profileRes.data;
    }
    
    return data;
  };

  const updateProfile = async (data) => {
    const response = await api.put('/profile', data);
    setUser(response.data);
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      authenticated: !!user, 
      isAdmin: user?.role === 'admin',
      login, 
      logout,
      signup,
      verifyOTP,
      updateProfile,
      checkAuthStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
