import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
  error?: string | null;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onLogin(username.trim(), password.trim());
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center pt-16">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white">تسجيل الدخول</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-lg font-medium text-gray-300 mb-2">
              اسم المستخدم
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 text-lg bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition-shadow shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="password"  className="block text-lg font-medium text-gray-300 mb-2">
              كلمة المرور
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-lg bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition-shadow shadow-sm"
            />
          </div>
          {error && <p className="text-red-400 text-center font-semibold">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-orange-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
