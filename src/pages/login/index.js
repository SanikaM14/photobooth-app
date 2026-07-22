import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { authAPI, sessionAPI } from '../../services/api';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Field validation state
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const userStr = localStorage.getItem('user') || localStorage.getItem('userProfile');
    let isGuest = false;
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        isGuest = u.email === 'guest@rosephotobooth.dev';
      } catch (e) {}
    }
    
    if (authStatus === 'true' && !isGuest) {
      const destination = location.state?.redirectTo || '/strip-selection';
      navigate(destination, { state: location.state });
    }
  }, [navigate, location.state]);

  const validateForm = () => {
    const newErrors = {};
    const trimmedEmail = email.trim();

    // 1. Empty required fields
    if (!trimmedEmail) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (isRegistering && !name.trim()) newErrors.name = 'Name is required';

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (trimmedEmail && !emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // 4. Password minimum length and complexity
    if (password && password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (password && !/\d/.test(password)) {
      newErrors.password = 'Password must contain at least one number';
    }

    // 5. Password confirmation mismatch
    if (isRegistering) {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form locally before submission
    if (!validateForm()) {
      return;
    }
    
    // 9. Trim whitespace from email automatically
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    try {
      setIsLoading(true);
      setServerError('');
      
      let authResponse;
      if (isRegistering) {
        authResponse = await authAPI.register({ 
          email: cleanEmail, 
          password, 
          name: cleanName 
        });
      } else {
        authResponse = await authAPI.login({ 
          email: cleanEmail, 
          password 
        });
      }

      localStorage.setItem('token', authResponse.token);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(authResponse.user));
      localStorage.setItem('userProfile', JSON.stringify(authResponse.user));

      if (location.state?.sessionId) {
        try {
          await sessionAPI.claimSession(location.state.sessionId);
        } catch (err) {
          console.error('Failed to claim session:', err);
        }
      }

      const destination = location.state?.redirectTo || '/strip-selection';
      navigate(destination, {
        state: {
          photos: location.state?.photos,
          template: location.state?.template,
          sessionId: location.state?.sessionId
        }
      });
    } catch (err) {
      console.error('Authentication failed', err);
      // Explicit error handling for server being offline vs validation errors
      if (!err.response) {
        setServerError('Cannot connect to server. Please make sure the backend is running.');
      } else {
        // Backend raises 400 for already registered, 401 for bad login, 429 for rate limit
        setServerError(err.response?.data?.detail || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsRegistering(!isRegistering);
    setServerError('');
    setErrors({});
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/1458603/pexels-photo-1458603.jpeg?auto=compress&cs=tinysrgb&w=1920')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-secondary/30 to-accent/40 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-md">
          <div className="bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 lg:p-10 border border-primary/20">
            <div className="text-center mb-6 md:mb-8">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                <Icon name="Flower2" size={48} color="var(--color-primary)" className="md:w-14 md:h-14" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary mb-2 md:mb-3">
                Rose Photobooth
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Capture beautiful moments with aesthetic filters
              </p>
            </div>

            <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
              <div className="bg-muted/50 rounded-lg p-4 md:p-5 text-center">
                <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
                  {isRegistering ? 'Create an Account' : 'Welcome Back'}
                </h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  {isRegistering ? 'Sign up to start your photobooth experience.' : 'Sign in to access your photobooth experience.'}
                </p>
              </div>

              {serverError && (
                <div className="bg-error/10 border border-error/30 rounded-lg p-3 md:p-4 flex items-start space-x-3">
                  <Icon name="AlertCircle" size={20} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-error">{serverError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                {isRegistering && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => { setName(e.target.value); if(errors.name) setErrors({...errors, name: null}) }}
                      maxLength={255}
                      autoComplete="name"
                      tabIndex="1"
                      className={`w-full px-4 py-3 rounded-xl border bg-background/50 focus:bg-background focus:ring-2 outline-none transition-all ${errors.name ? 'border-error focus:ring-error/50' : 'border-border focus:ring-primary/50'}`}
                      placeholder="Jane Doe"
                    />
                    {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => { setEmail(e.target.value); if(errors.email) setErrors({...errors, email: null}) }}
                    maxLength={255}
                    autoComplete="email"
                    tabIndex="2"
                    className={`w-full px-4 py-3 rounded-xl border bg-background/50 focus:bg-background focus:ring-2 outline-none transition-all ${errors.email ? 'border-error focus:ring-error/50' : 'border-border focus:ring-primary/50'}`}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-foreground">Password</label>
                    {!isRegistering && (
                      <button type="button" tabIndex="5" className="text-xs text-primary/80 hover:text-primary transition-colors font-medium">
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password} 
                      onChange={(e) => { setPassword(e.target.value); if(errors.password) setErrors({...errors, password: null}) }}
                      maxLength={255}
                      autoComplete={isRegistering ? "new-password" : "current-password"}
                      tabIndex="3"
                      className={`w-full px-4 py-3 pr-12 rounded-xl border bg-background/50 focus:bg-background focus:ring-2 outline-none transition-all ${errors.password ? 'border-error focus:ring-error/50' : 'border-border focus:ring-primary/50'}`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      tabIndex="-1"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Icon name="EyeOff" size={20} /> : <Icon name="Eye" size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-error text-xs mt-1">{errors.password}</p>}
                </div>

                {isRegistering && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Confirm Password</label>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={confirmPassword} 
                      onChange={(e) => { setConfirmPassword(e.target.value); if(errors.confirmPassword) setErrors({...errors, confirmPassword: null}) }}
                      maxLength={255}
                      autoComplete="new-password"
                      tabIndex="4"
                      className={`w-full px-4 py-3 rounded-xl border bg-background/50 focus:bg-background focus:ring-2 outline-none transition-all ${errors.confirmPassword ? 'border-error focus:ring-error/50' : 'border-border focus:ring-primary/50'}`}
                      placeholder="••••••••"
                    />
                    {errors.confirmPassword && <p className="text-error text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  tabIndex="6"
                  className="w-full mt-2 py-3.5 rounded-xl font-bold bg-primary text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  {isLoading ? 'Processing...' : (isRegistering ? 'Sign Up' : 'Sign In')}
                </Button>
              </form>
              
              <div className="flex flex-col items-center mt-4 pt-2 space-y-3 border-t border-border/50">
                <button 
                  onClick={toggleAuthMode} 
                  tabIndex="7"
                  className="text-sm text-foreground hover:text-primary transition-colors font-medium"
                >
                  {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
                
                <button
                  type="button"
                  tabIndex="8"
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      setServerError('');
                      const authResponse = await authAPI.devBypass();
                      localStorage.setItem('token', authResponse.token);
                      localStorage.setItem('isAuthenticated', 'true');
                      localStorage.setItem('user', JSON.stringify(authResponse.user));
                      localStorage.setItem('userProfile', JSON.stringify(authResponse.user));
                      navigate('/strip-selection');
                    } catch (e) {
                      setServerError('Guest bypass failed. Make sure the backend server is running on port 8080.');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="text-xs text-primary/80 hover:text-primary transition-smooth underline font-medium cursor-pointer"
                >
                  Or enter as Guest (Developer Bypass)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;