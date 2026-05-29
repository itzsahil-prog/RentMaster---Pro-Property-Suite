
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { UserRole, Property, User, PropertyType } from './types';
import { Icons } from './constants';
import { supabase } from './lib/supabase';

// Pages
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';
import Dashboard from './pages/Dashboard';
import PropertyDetails from './pages/PropertyDetails';
import LoginPage from './pages/LoginPage';

// Context for global state
const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  signIn: (role: UserRole) => void;
  signOut: () => void;
} | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const Navbar: React.FC<{ user: User | null; onLogout: () => void }> = ({ user, onLogout }) => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Icons.Home />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">RentMaster</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/search" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Find Rentals</Link>
            {user && <Link to="/dashboard" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Dashboard</Link>}
            <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Maintenance</a>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</p>
                </div>
                <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} className="w-8 h-8 rounded-full border border-slate-200" alt="avatar" />
                <button 
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  aria-label="Logout"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition-all shadow-sm">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);

  // Real-time property fetching from Supabase
  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*');
      
      if (data) setProperties(data as any);
      setLoading(false);
    };

    fetchProperties();

    // Set up real-time listener
    const subscription = supabase
      .channel('public:properties')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, fetchProperties)
      .subscribe();

    return () => { subscription.unsubscribe(); };
  }, []);

  const handleLogin = (role: UserRole) => {
    // Simulated Auth Logic - In production, use supabase.auth.signInWithPassword()
    const mockUser: User = {
      id: role === UserRole.OWNER ? 'o1' : 'u1',
      name: role === UserRole.OWNER ? 'Sarah Landlord' : 'Alex Johnson',
      email: role === UserRole.OWNER ? 'owner@example.com' : 'tenant@example.com',
      role: role,
      avatar: `https://picsum.photos/seed/${role}/100/100`
    };
    setCurrentUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user: currentUser, loading, signIn: handleLogin, signOut: handleLogout }}>
      <Router>
        <div className="min-h-screen flex flex-col font-inter">
          <Navbar user={currentUser} onLogout={handleLogout} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage properties={properties} />} />
              <Route path="/search" element={<SearchPage properties={properties} />} />
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="/property/:id" element={<PropertyDetails user={currentUser} properties={properties} />} />
              <Route path="/dashboard/*" element={<Dashboard user={currentUser} properties={properties} />} />
            </Routes>
          </main>
          
          <footer className="bg-slate-900 text-slate-400 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="flex justify-center items-center gap-2 mb-4">
                <div className="bg-blue-600 p-1.5 rounded text-white"><Icons.Home /></div>
                <span className="text-xl font-bold text-white">RentMaster</span>
              </div>
              <p className="max-w-md mx-auto mb-8">Providing end-to-end property operations for the modern world.</p>
              <div className="flex justify-center gap-6 text-sm mb-8">
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">API Docs</a>
              </div>
              <p className="text-xs">&copy; 2024 RentMaster. Powered by Supabase & Express.</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
