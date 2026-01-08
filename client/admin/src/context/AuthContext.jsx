import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { encryptPassword } from '../utils/crypto';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('saf_admin_user');
        const storedToken = localStorage.getItem('saf_admin_token');
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('saf_admin_user');
        localStorage.removeItem('saf_admin_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const { username, password, captcha, captchaID } = credentials;
      
      // Encrypt password using SHA1
      const encryptedPassword = encryptPassword(password);
      
      // Call login API
      const response = await api.post('/login', {
        username,
        password: encryptedPassword,
        captcha,
        captchaID,
        app: 'web'
      });

      // Check response
      console.log('=== LOGIN RESPONSE ===');
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      console.log('Response status:', response.data?.status);
      
      if (response.data && response.data.status === 200 && response.data.data) {
        const responseData = response.data.data;
        console.log('Response data.data:', responseData);
        console.log('Assigned Profiles:', responseData.assignedProfiles);
        console.log('Home Page URL:', responseData.assignedProfiles?.mnu_home_pg);
        
        // Extract user data with complete structure
        const userData = {
          usr_id: responseData.user.usr_id,
          username: responseData.user.usr_nm,
          email: responseData.user.eml_tx,
          fullName: `${responseData.user.fst_nm || ''} ${responseData.user.lst_nm || ''}`.trim(),
          firstName: responseData.user.fst_nm,
          lastName: responseData.user.lst_nm,
          role: responseData.user.roles?.rle_nm || 'User',
          roleId: responseData.user.roles?.rle_id,
          isAdmin: responseData.user.roles?.admn_rle_in === 1,
          designation: responseData.user.dsgns?.dsgns_nm || null,
          designationId: responseData.user.dsgns?.dsgns_id || null,
          clnt_id: responseData.user.clnt_id,
          tnt_id: responseData.user.tnt_id,
          a_in: responseData.user.a_in,
          clients: responseData.clnts || [],
          assignedProfiles: responseData.assignedProfiles || {},
          qrcode: responseData.qrcode,
          loginTime: new Date().toISOString()
        };

        // Get JWT token from response header
        const token = response.headers['x-access-token'];
        console.log('JWT Token:', token);
        
        // Save to localStorage
        console.log('=== SAVING TO LOCALSTORAGE ===');
        console.log('User data:', userData);
        setUser(userData);
        localStorage.setItem('saf_admin_user', JSON.stringify(userData));
        localStorage.setItem('saf_admin_clients', JSON.stringify(responseData.clnts || []));
        localStorage.setItem('saf_admin_profiles', JSON.stringify(responseData.assignedProfiles || {}));
        if (token) {
          localStorage.setItem('saf_admin_token', token);
        }
        
        // Verify localStorage
        console.log('LocalStorage saf_admin_user:', localStorage.getItem('saf_admin_user'));
        console.log('LocalStorage saf_admin_profiles:', localStorage.getItem('saf_admin_profiles'));
        
        // Get home page URL from assigned profiles
        const homePageUrl = responseData.assignedProfiles?.mnu_home_pg || '/dashboard';
        console.log('Home Page URL to return:', homePageUrl);
        
        const result = { 
          success: true, 
          data: userData,
          homePageUrl: homePageUrl
        };
        console.log('=== RETURNING RESULT ===', result);
        
        return result;
      } else {
        return {
          success: false,
          error: response.data?.message || 'Login failed. Please try again.'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different error types
      if (error.response) {
        const errorMsg = error.response.data?.message || error.response.data?.err_message;
        return {
          success: false,
          error: errorMsg || 'Invalid credentials. Please try again.'
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Cannot connect to server. Please check if the server is running.'
        };
      } else {
        return {
          success: false,
          error: 'An error occurred during login. Please try again.'
        };
      }
    }
  };

  const logout = async () => {
    try {
      // Call logout API
      await api.get('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call result
      setUser(null);
      localStorage.removeItem('saf_admin_user');
      localStorage.removeItem('saf_admin_token');
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

