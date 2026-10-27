import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Bell, 
  LogOut, 
  ShieldCheck, 
  AlertTriangle,
  Check
} from 'lucide-react';
import { AnimatedLogo } from '../brand/AnimatedLogo';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { db } from '../../services/dbService';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(() => db.getNotifications(user?.id));

  // Listen for storage changes to refresh notifications
  React.useEffect(() => {
    const handleStateChange = () => {
      setNotifications(db.getNotifications(user?.id));
    };
    window.addEventListener('printvault:state_change', handleStateChange);
    return () => window.removeEventListener('printvault:state_change', handleStateChange);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = (id: string) => {
    db.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-vault-lightSurface/85 dark:bg-vault-darkSurface/85 border-b border-white/50 dark:border-slate-800/80 px-4 sm:px-6 py-3 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center">
          <AnimatedLogo size="sm" showText={true} />
        </Link>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-vault-lightMuted hover:text-vault-lightText dark:hover:text-vault-darkText shadow-neu-flat-sm dark:shadow-neu-dark-flat-sm active:shadow-neu-pressed-sm transition-all"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-vault-blue" />}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-vault-lightMuted hover:text-vault-lightText dark:hover:text-vault-darkText shadow-neu-flat-sm dark:shadow-neu-dark-flat-sm active:shadow-neu-pressed-sm transition-all relative"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-vault-red text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-vault-lightSurface dark:bg-vault-darkSurface p-4 shadow-neu-flat-lg dark:shadow-neu-dark-flat-lg border border-white/60 dark:border-slate-700 z-50"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700/60">
                    <h4 className="text-sm font-heading font-bold text-vault-lightText dark:text-vault-darkText">
                      Security Notifications
                    </h4>
                    <span className="text-[11px] font-mono text-vault-blue dark:text-vault-blueDark font-semibold">
                      {unreadCount} unread
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto py-2 space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-center py-4 text-vault-lightMuted dark:text-vault-darkMuted">
                        No security notifications yet
                      </p>
                    ) : (
                      notifications.slice(0, 6).map(notif => (
                        <div
                          key={notif.id}
                          className={`p-2.5 rounded-xl text-xs transition-all ${
                            notif.is_read
                              ? 'bg-slate-100/50 dark:bg-slate-800/40 text-vault-lightMuted dark:text-vault-darkMuted'
                              : 'bg-vault-blue/10 dark:bg-vault-blue/20 text-vault-lightText dark:text-vault-darkText font-medium border-l-2 border-vault-blue'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-vault-lightText dark:text-vault-darkText">
                              {notif.title}
                            </span>
                            {!notif.is_read && (
                              <button
                                onClick={() => handleMarkAsRead(notif.id)}
                                className="text-vault-blue hover:text-vault-cyan"
                                title="Mark read"
                              >
                                <Check size={14} />
                              </button>
                            )}
                          </div>
                          <p className="text-[11px] mt-0.5 opacity-90">{notif.message}</p>
                          <span className="text-[9px] font-mono text-vault-lightMuted dark:text-vault-darkMuted mt-1 block">
                            {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile / Logout */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-300 dark:border-slate-700">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-vault-lightText dark:text-vault-darkText truncate max-w-[140px]">
                  {user.full_name}
                </p>
                <span className="text-[10px] font-mono uppercase text-vault-blue dark:text-vault-blueDark font-bold">
                  {user.role}
                </span>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/auth');
                }}
                title="Logout"
                className="p-2 rounded-xl text-vault-red hover:bg-red-500/10 shadow-neu-flat-sm dark:shadow-neu-dark-flat-sm active:shadow-neu-pressed-sm transition-all"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-vault-blue shadow-neu-flat-sm hover:brightness-105 transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
