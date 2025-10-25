import React, { useState, useEffect, useCallback } from 'react';
import type { User, WorkWeek } from '../types';
import { useWorkData } from '../hooks/useWorkData';
import { calculateTotalDays, calculateTotalHours } from '../services/timeService';
import { EMPLOYEES } from '../constants';
import TimesheetView from './TimesheetView';
import ConfirmModal from './ConfirmModal';

const AdminDashboard: React.FC = () => {
  const { loadAllWorkData, clearAllWorkData } = useWorkData();
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allData = loadAllWorkData();

  const handleClearData = async () => {
    await clearAllWorkData();
    setSelectedEmployee(null);
    setIsModalOpen(false);
  };

  const selectedEmployeeData = selectedEmployee ? allData[selectedEmployee.username] : null;

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gray-50 rounded-xl shadow-md flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">لوحة تحكم المسؤول</h2>
            <p className="text-gray-600 mt-1">عرض وتتبع دوام جميع الموظفين.</p>
        </div>
        <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg"
        >
            مسح دوام الأسبوع الحالي
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-gray-50 p-4 rounded-xl shadow-md">
          <h3 className="text-xl font-bold mb-4 border-b pb-2">قائمة الموظفين</h3>
          <ul className="space-y-2">
            {EMPLOYEES.map(emp => (
              <li key={emp.username}>
                <button
                  onClick={() => setSelectedEmployee({ ...emp, role: 'employee' })}
                  className={`w-full text-right p-3 rounded-lg transition-colors text-2xl ${selectedEmployee?.username === emp.username ? 'bg-orange-500 text-white font-bold' : 'hover:bg-gray-200'}`}
                >
                  {emp.nameAr}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          {selectedEmployee && selectedEmployeeData ? (
            <div className="bg-white p-4 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-center">دوام الموظف: {selectedEmployee.nameAr}</h3>
              <TimesheetView workWeek={selectedEmployeeData} isReadOnly={true} />
              <div className="mt-6 p-4 bg-orange-100 border-r-4 border-orange-500 rounded-lg space-y-2">
                <h4 className="text-lg font-bold text-orange-800">
                  إجمالي الساعات المحسوبة: <span className="text-2xl">{calculateTotalHours(selectedEmployeeData).toFixed(1)}</span> ساعة
                </h4>
                <h4 className="text-lg font-bold text-orange-800">
                  إجمالي الأيام المحسوبة: <span className="text-2xl">{calculateTotalDays(selectedEmployeeData)}</span> يوم
                </h4>
              </div>
            </div>
          ) : selectedEmployee ? (
             <div className="flex items-center justify-center h-full bg-gray-50 p-6 rounded-xl shadow-md">
                <p className="text-xl text-gray-500">لم يتم تسجيل دوام لـ "{selectedEmployee.nameAr}" هذا الأسبوع.</p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50 p-6 rounded-xl shadow-md">
              <p className="text-xl text-gray-500">الرجاء اختيار موظف لعرض تفاصيل دوامه.</p>
            </div>
          )}
        </div>
      </div>
       <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleClearData}
        title="تأكيد حذف البيانات"
        message="هل أنت متأكد من رغبتك في حذف جميع بيانات دوام الموظفين لهذا الأسبوع؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="تأكيد الحذف"
      />
    </div>
  );
};

export default AdminDashboard;