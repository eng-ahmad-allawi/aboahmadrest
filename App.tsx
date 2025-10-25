
import React from 'react';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import { useAuth } from './hooks/useAuth';
import Header from './components/Header';
import { ADMIN_USERNAME } from './constants';

const App: React.FC = () => {
  const { user, login, logout, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="bg-white min-h-screen text-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-lg text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (!user) {
      return <LoginPage onLogin={login} error={error} />;
    }
    if (user.username === ADMIN_USERNAME) {
      return <AdminDashboard />;
    }
    return <EmployeeDashboard user={user} />;
  };

  return (
    <div className="bg-white min-h-screen text-black">
      <div className="container mx-auto p-4 max-w-4xl">
        <Header isLoggedIn={!!user} onLogout={logout} />
        <main className="mt-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
