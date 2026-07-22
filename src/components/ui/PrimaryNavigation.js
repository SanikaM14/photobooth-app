import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const PrimaryNavigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const userInfo = localStorage.getItem('userProfile');
    
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      if (userInfo) {
        setUserProfile(JSON.parse(userInfo));
      }
    }
  }, []);

  const navigationItems = [
    {
      label: 'Capture',
      path: '/camera-capture',
      icon: 'Camera',
      tooltip: 'Start taking photos'
    },
    {
      label: 'Gallery',
      path: '/photo-gallery',
      icon: 'Images',
      tooltip: 'View your photo collection'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userProfile');
    setIsAuthenticated(false);
    setUserProfile(null);
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-1000 bg-card shadow-md transition-smooth">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div 
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => handleNavigation('/camera-capture')}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center transition-smooth hover:bg-primary/20">
                  <Icon name="Flower2" size={28} color="var(--color-primary)" />
                </div>
                <h1 className="text-2xl font-heading font-semibold text-primary">
                  Rose Photobooth
                </h1>
              </div>

              <div className="hidden md:flex items-center space-x-2">
                {navigationItems?.map((item) => (
                  <button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path)}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg
                      transition-smooth font-medium
                      ${isActivePath(item?.path)
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-foreground hover:bg-muted hover:text-primary'
                      }
                    `}
                    title={item?.tooltip}
                  >
                    <Icon name={item?.icon} size={20} />
                    <span>{item?.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated && userProfile ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-muted rounded-lg">
                    {userProfile?.photoURL ? (
                      <img 
                        src={userProfile?.photoURL} 
                        alt={userProfile?.displayName}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <Icon name="User" size={18} color="var(--color-primary)" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-foreground">
                      {userProfile?.displayName || userProfile?.email}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="LogOut"
                    iconPosition="left"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  iconName="LogIn"
                  iconPosition="left"
                  onClick={() => handleNavigation('/login')}
                >
                  Login
                </Button>
              )}
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-smooth"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <Icon 
                name={isMobileMenuOpen ? 'X' : 'Menu'} 
                size={24} 
                color="var(--color-foreground)" 
              />
            </button>
          </div>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-1200 md:hidden">
          <div 
            className="absolute inset-0 bg-background"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          <div className="absolute top-16 left-0 right-0 bg-card shadow-xl rounded-b-xl overflow-hidden">
            <div className="p-6 space-y-4">
              {navigationItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                    transition-smooth font-medium text-left
                    ${isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-foreground hover:bg-muted hover:text-primary'
                    }
                  `}
                >
                  <Icon name={item?.icon} size={22} />
                  <span className="text-lg">{item?.label}</span>
                </button>
              ))}

              <div className="pt-4 border-t border-border">
                {isAuthenticated && userProfile ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 px-4 py-3 bg-muted rounded-lg">
                      {userProfile?.photoURL ? (
                        <img 
                          src={userProfile?.photoURL} 
                          alt={userProfile?.displayName}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <Icon name="User" size={20} color="var(--color-primary)" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {userProfile?.displayName || 'User'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {userProfile?.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      fullWidth
                      iconName="LogOut"
                      iconPosition="left"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="default"
                    fullWidth
                    iconName="LogIn"
                    iconPosition="left"
                    onClick={() => handleNavigation('/login')}
                  >
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrimaryNavigation;