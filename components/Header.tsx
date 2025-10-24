
import React, { useState } from 'react';
import ConfirmModal from './ConfirmModal';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <header className="flex items-center justify-between pb-4 border-b-2 border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-orange-500">مطعم أبو أحمد</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleRefresh}
            title="تحديث الصفحة"
            className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-700"
            aria-label="تحديث الصفحة"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
          </button>
          {isLoggedIn && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-transform transform hover:scale-105"
            >
              تسجيل الخروج
            </button>
          )}
        </div>
      </header>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={onLogout}
        title="تأكيد تسجيل الخروج"
        message="هل أنت متأكد من رغبتك في تسجيل الخروج؟"
        confirmText="نعم، خروج"
      />
    </>
  );
};

export default Header;