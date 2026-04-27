//IPT---GROUP-PIT-\frontend\src\App.tsx
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import OrderForm from './components/OrderForm';
import OrderQueue from './components/OrderQueue';
import MenuAdmin from './components/MenuAdmin';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Activation from './components/Activation';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated, logout } from './api';

const App = () => {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const location = useLocation();

  useEffect(() => {
    // Check auth status whenever location changes
    setAuthenticated(isAuthenticated());
  }, [location]);

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
  };

  // Show nav only for non-auth pages when authenticated
  const showNav = authenticated && !['login', 'register'].some(path => location.pathname.includes(path));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_80%_20%,rgba(34,197,94,0.2),rgba(255,255,255,0))]"></div>
      </div>

      <div className="relative z-10">
        {showNav && (
          <nav className="backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-20">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    🍳 Kitchen Queue
                  </h1>
                </div>
                <div className="flex gap-2 sm:gap-4">
                  <NavLink
                    to="/create-order"
                    className={({ isActive }) => `
                      px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all duration-300
                      ${isActive
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/50 scale-100'
                        : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                      }
                    `}
                  >
                    📝 Create
                  </NavLink>
                  <NavLink
                    to="/kitchen-queue"
                    className={({ isActive }) => `
                      px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all duration-300
                      ${isActive
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/50 scale-100'
                        : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                      }
                    `}
                  >
                    🔥 Queue
                  </NavLink>
                  <NavLink
                    to="/menu-admin"
                    className={({ isActive }) => `
                      px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all duration-300
                      ${isActive
                        ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/50 scale-100'
                        : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                      }
                    `}
                  >
                    🍽️ Menu
                  </NavLink>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) => `
                      px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all duration-300
                      ${isActive
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 scale-100'
                        : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                      }
                    `}
                  >
                    👤 Profile
                  </NavLink>
                </div>
              </div>
            </div>
          </nav>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={authenticated ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={authenticated ? <Navigate to="/" /> : <Register />} />
            <Route path="/activate/:uid/:token" element={<Activation />} />

            {/* Protected routes */}
            <Route
              path="/create-order"
              element={
                <ProtectedRoute>
                  <OrderForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kitchen-queue"
              element={
                <ProtectedRoute>
                  <OrderQueue />
                </ProtectedRoute>
              }
            />
            <Route
              path="/menu-admin"
              element={
                <ProtectedRoute>
                  <MenuAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Home route */}
            <Route path="/" element={
              authenticated ? (
                <Navigate to="/profile" />
              ) : (
                <div className="text-center py-24 animate-fade-in">
                  <h2 className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-6">Welcome</h2>
                  <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Streamline your kitchen operations with real-time order management and live queue tracking.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <NavLink to="/login" className="btn-primary">
                      🔐 Sign In
                    </NavLink>
                    <NavLink to="/register" className="btn-accent">
                      ➕ Create Account
                    </NavLink>
                  </div>
                </div>
              )
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
};

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;

