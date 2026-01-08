import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, User, RefreshCw, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import api from '../../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    captcha: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [captchaData, setCaptchaData] = useState({
    image: '',
    id: null,
    saltKey: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = async () => {
    try {
      const response = await api.get('/login/captcha');
      
      if (response.data && response.data.status === 200 && response.data.data) {
        setCaptchaData({
          image: response.data.data.data,
          id: response.data.data.cptch_id,
          saltKey: response.data.data.salt_ky
        });
        setFormData(prev => ({ ...prev, captcha: '' }));
      } else {
        setErrorMessage('Failed to load captcha. Please refresh the page.');
      }
    } catch (error) {
      console.error('Captcha generation error:', error);
      setErrorMessage('Cannot connect to server. Please check if the server is running on port 4901.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setErrorMessage('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    if (!formData.captcha.trim()) {
      newErrors.captcha = 'Captcha is required';
    }
    
    if (!captchaData.id || !captchaData.saltKey) {
      setErrorMessage('Captcha not loaded. Please refresh the page.');
      return false;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await login({
        username: formData.username,
        password: formData.password,
        captcha: formData.captcha,
        captchaID: captchaData.id
      });
      
      console.log('=== LOGIN RESULT IN LOGIN.JSX ===', result);
      
      if (result.success) {
        // Navigate to the home page URL from the response
        const homeUrl = result.homePageUrl || '/dashboard';
        console.log('Home URL:', homeUrl);
        const finalUrl = '/' + homeUrl.replace(/^\/+/, '');
        console.log('Final navigation URL:', finalUrl);
        navigate(finalUrl, { replace: true });
      } else {
        console.error('Login failed:', result.error);
        setErrorMessage(result.error);
        generateCaptcha();
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      generateCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-2/3 bg-gradient-to-br from-saf-red-600 via-saf-red-700 to-saf-maroon-800 relative overflow-hidden">
        {/* Animated Background Shapes */}
        <ul className="floating-shapes absolute inset-0 z-0">
          {[...Array(10)].map((_, i) => (
            <li key={i}></li>
          ))}
        </ul>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full text-white px-12">
          <div className="text-center max-w-2xl">
            {/* Logo */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl">
                <ShieldCheck className="w-20 h-20 text-saf-red-700" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">
              Welcome to
            </h1>
            <h2 className="text-6xl font-bold mb-6 gradient-text-white">
              SAF Admin Portal
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Settibalija Action Force Management System
            </p>
            <div className="inline-block px-8 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <p className="text-sm font-semibold">Secure • Reliable • Professional</p>
            </div>
          </div>
        </div>
        
        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="rgba(255,255,255,0.1)" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,106.7C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-8 bg-gray-50 relative">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-saf-red-600 to-saf-red-700 rounded-full flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-saf-dark-900 mt-4">SAF Admin</h2>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-saf-dark-900 mb-2">Login</h3>
              <p className="text-saf-dark-600">Enter your credentials to access the portal</p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
              </div>
            )}

            {/* Server Status Info */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800 font-semibold mb-2">Server Connection:</p>
              <p className="text-xs text-blue-700">
                {captchaData.id ? (
                  <span className="text-green-700 font-semibold">✓ Connected to backend</span>
                ) : (
                  <span className="text-red-700 font-semibold">⨯ Server not responding</span>
                )}
              </p>
              <p className="text-xs text-gray-600 mt-1">API: http://localhost:4901</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-semibold text-saf-dark-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-saf-dark-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.username ? 'input-error' : ''}`}
                    placeholder="Enter your username"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-xs text-red-600">{errors.username}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-saf-dark-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-saf-dark-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`input-field pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-saf-dark-400 hover:text-saf-dark-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-saf-dark-400 hover:text-saf-dark-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Captcha */}
              <div>
                <label className="block text-sm font-semibold text-saf-dark-700 mb-2">
                  Captcha Verification
                </label>
                <div className="flex gap-2 mb-3">
                  <div className="flex-1 h-14 bg-white rounded-lg flex items-center justify-center border-2 border-saf-dark-300 overflow-hidden">
                    {captchaData.image ? (
                      <img 
                        src={captchaData.image} 
                        alt="Captcha" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-sm text-gray-500">Loading captcha...</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    disabled={loading}
                    className="px-4 bg-saf-red-600 text-white rounded-lg hover:bg-saf-red-700 transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
                    title="Refresh Captcha"
                  >
                    <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <input
                  type="text"
                  name="captcha"
                  value={formData.captcha}
                  onChange={handleChange}
                  className={`input-field ${errors.captcha ? 'input-error' : ''}`}
                  placeholder="Enter the captcha code"
                />
                {errors.captcha && (
                  <p className="mt-1 text-xs text-red-600">{errors.captcha}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary h-12 text-base font-bold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging in...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    Login to Portal
                  </>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-saf-red-600 hover:text-saf-red-700 font-semibold hover:underline">
                Forgot Password?
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 text-center">
            <p className="text-xs text-saf-dark-500">
              © 2026 Settibalija Action Force. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

