import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import OrderForm from './components/OrderForm';
import OrderQueue from './components/OrderQueue';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.03] opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 animate-pulse-slow"></div>
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8 rounded-3xl shadow-2xl border border-white/20">
            <div className="text-center mb-12">
              <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 drop-shadow-2xl animate-float">
                🍳 Kitchen Queue
              </h1>
              <nav className="flex flex-wrap gap-4 justify-center bg-white/60 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-white/40">
                <NavLink
                  to="/create-order"
                  className={({ isActive }) => `
                    px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl
                    ${isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-2xl hover:shadow-3xl scale-105'
                      : 'bg-white/70 hover:bg-white hover:shadow-2xl hover:scale-[1.02] text-gray-800 border border-gray-200/50'
                    }
                  `}
                >
                  📝 Create Order
                </NavLink>
                <NavLink
                  to="/kitchen-queue"
                  className={({ isActive }) => `
                    px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl
                    ${isActive
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-2xl hover:shadow-3xl scale-105'
                      : 'bg-white/70 hover:bg-white hover:shadow-2xl hover:scale-[1.02] text-gray-800 border border-gray-200/50'
                    }
                  `}
                >
                  🔥 Kitchen Queue
                </NavLink>
              </nav>
            </div>
            <Routes>
              <Route path="/create-order" element={<OrderForm />} />
              <Route path="/kitchen-queue" element={<OrderQueue />} />
              <Route path="/" element={
                <div className="text-center py-24">
                  <div className="text-8xl mb-8">🚀</div>
                  <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Kitchen Queue</h2>
                  <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Use the navigation above to create orders or view the live kitchen queue.</p>
                  <div className="flex gap-4 justify-center">
                    <NavLink to="/create-order" className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all">
                      📝 Start Creating
                    </NavLink>
                    <NavLink to="/kitchen-queue" className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all">
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

