//IPT---GROUP-PIT-\frontend\src\App.tsx
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import OrderForm from './components/OrderForm';
import OrderQueue from './components/OrderQueue';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_80%_20%,rgba(34,197,94,0.2),rgba(255,255,255,0))]"></div>
        </div>

        <div className="relative z-10">
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
                </div>
              </div>
            </div>
          </nav>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <Routes>
              <Route path="/create-order" element={<OrderForm />} />
              <Route path="/kitchen-queue" element={<OrderQueue />} />
              <Route path="/" element={
                <div className="text-center py-24 animate-fade-in">
                  <h2 className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-6">Welcome</h2>
                  <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Streamline your kitchen operations with real-time order management and live queue tracking.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <NavLink to="/create-order" className="btn-primary">
                      📝 Create Order
                    </NavLink>
                    <NavLink to="/kitchen-queue" className="btn-accent">
                      🔥 View Queue
                    </NavLink>
                  </div>
                </div>
              } />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;

