import React, { useState } from 'react';
import { login, register, loginWithGoogle, loginWithFacebook, loginWithApple } from '../api';

interface AuthModalProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  fullName?: string;
  agreeToTerms?: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ darkMode, isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Registration-specific validations
    if (!isLogin) {
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'Please agree to the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      let result;
      
      if (isLogin) {
        result = await login(formData.email, formData.password);
        console.log('Login successful:', result);
        alert('Login successful!');
      } else {
        result = await register(formData.email, formData.password, {
          firstName: formData.fullName?.split(' ')[0] || '',
          lastName: formData.fullName?.split(' ').slice(1).join(' ') || '',
          country: 'US' // You could add a country field later
        });
        console.log('Registration successful:', result);
        alert('Registration successful!');
      }
      
      // Reset form and close modal on success
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        agreeToTerms: false
      });
      onClose();
      
      // You could also trigger a page refresh or redirect here
      // window.location.reload();
      
    } catch (error: any) {
      console.error('Auth error:', error);
      setErrors({ submit: error.message || 'Authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      setIsLoading(true);
      let result;
      
      switch (provider) {
        case 'google':
          result = await loginWithGoogle();
          break;
        case 'facebook':
          result = await loginWithFacebook();
          break;
        case 'apple':
          result = await loginWithApple();
          break;
        default:
          throw new Error('Unsupported provider');
      }
      
      console.log(`${provider} authentication successful:`, result);
      alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication successful!`);
      
      // Close modal on success
      onClose();
      
      // You could also trigger a page refresh or redirect here
      // window.location.reload();
      
    } catch (error: any) {
      console.error(`${provider} auth error:`, error);
      setErrors({ submit: error.message || `${provider} authentication failed. Please try again.` });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      agreeToTerms: false
    });
    setErrors({});
  };

  return (
    <div className="modal fade show d-block auth-modal" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className={`modal-content ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">
              {isLogin ? 'Welcome Back!' : 'Join Our Community'}
            </h5>
            <button 
              type="button" 
              className={`btn-close ${darkMode ? 'btn-close-white' : ''}`}
              onClick={onClose}
              disabled={isLoading}
            ></button>
          </div>
          
          <div className="modal-body pt-2">
            <p className={`text-center mb-4 ${darkMode ? 'text-light' : 'text-muted'}`}>
              {isLogin 
                ? 'Sign in to access your travel plans and personalized recommendations'
                : 'Create an account to start planning your dream adventures'
              }
            </p>

            {/* Demo credentials hint for login */}
            {isLogin && (
              <div className={`alert ${darkMode ? 'alert-dark' : 'alert-info'} mb-4`}>
                <small>
                  <strong>Demo credentials:</strong><br />
                  Email: demo@example.com<br />
                  Password: password
                </small>
              </div>
            )}

            {/* Social Authentication Buttons */}
            <div className="mb-4">
              <div className="d-grid gap-2 mb-3">
                <button 
                  type="button"
                  className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'} d-flex align-items-center justify-content-center`}
                  onClick={() => handleSocialAuth('google')}
                  disabled={isLoading}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" className="me-2">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
                
                <button 
                  type="button"
                  className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'} d-flex align-items-center justify-content-center`}
                  onClick={() => handleSocialAuth('facebook')}
                  disabled={isLoading}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" className="me-2">
                    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Continue with Facebook
                </button>
                
                <button 
                  type="button"
                  className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'} d-flex align-items-center justify-content-center`}
                  onClick={() => handleSocialAuth('apple')}
                  disabled={isLoading}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" className="me-2">
                    <path fill={darkMode ? '#FFFFFF' : '#000000'} d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                  </svg>
                  Continue with Apple
                </button>
              </div>
              
              <div className="text-center">
                <span className={`${darkMode ? 'text-light' : 'text-muted'}`}>or</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className={`form-control ${darkMode ? 'bg-secondary text-light border-secondary' : ''} ${errors.fullName ? 'is-invalid' : ''}`}
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                  {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  className={`form-control ${darkMode ? 'bg-secondary text-light border-secondary' : ''} ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className={`form-control ${darkMode ? 'bg-secondary text-light border-secondary' : ''} ${errors.password ? 'is-invalid' : ''}`}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              {!isLogin && (
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className={`form-control ${darkMode ? 'bg-secondary text-light border-secondary' : ''} ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>
              )}

              {!isLogin && (
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className={`form-check-input ${errors.agreeToTerms ? 'is-invalid' : ''}`}
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <label className="form-check-label" htmlFor="agreeToTerms">
                    I agree to the <a href="#" className="text-primary">Terms of Service</a> and <a href="#" className="text-primary">Privacy Policy</a>
                  </label>
                  {errors.agreeToTerms && <div className="invalid-feedback d-block">{errors.agreeToTerms}</div>}
                </div>
              )}

              {errors.submit && (
                <div className="alert alert-danger" role="alert">
                  {errors.submit}
                </div>
              )}

              <div className="d-grid gap-2 mb-3">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      {isLogin ? 'Signing In...' : 'Creating Account...'}
                    </>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </div>
            </form>

            {isLogin && (
              <div className="text-center mb-3">
                <a href="#" className="text-decoration-none text-primary">Forgot your password?</a>
              </div>
            )}

            <div className="text-center">
              <span className={darkMode ? 'text-light' : 'text-muted'}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button 
                type="button"
                className="btn btn-link p-0 text-primary text-decoration-none"
                onClick={toggleMode}
                disabled={isLoading}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
