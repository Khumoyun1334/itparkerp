import { useState } from "react";
import { Calendar, DollarSign, CheckCircle, XCircle } from "lucide-react";

const StudentMonthlyTable = ({ student, onUpdateMonthly }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // 12 oy uchun ma'lumotlar
  const months = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
  ];

  const getMonthData = (monthIndex) => {
    const key = `${selectedYear}-${monthIndex + 1}`;
    return student.monthlyData?.[key] || {
      paid: false,
      attended: false,
      paidDate: null,
      amount: student.monthlyFee - (student.monthlyFee * student.discount / 100)
    };
  };

  const updateMonthStatus = (monthIndex, field, value) => {
    const key = `${selectedYear}-${monthIndex + 1}`;
    const currentData = getMonthData(monthIndex);
    
    onUpdateMonthly(student.id, key, {
      ...currentData,
      [field]: value,
      paidDate: field === 'paid' && value ? new Date().toISOString() : currentData.paidDate
    });
  };

  const isLate = (monthIndex) => {
    const monthData = getMonthData(monthIndex);
    if (monthData.paid) return false;
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    if (selectedYear < currentYear) return true;
    if (selectedYear === currentYear && monthIndex < currentMonth) return true;
    return false;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Oylik to'lov va davomat jadvali
          </h3>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-white rounded-lg px-3 py-1 text-gray-800"
          >
            <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
            <option value={new Date().getFullYear() + 1}>{new Date().getFullYear() + 1}</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto p-4">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Oy</th>
              <th className="p-3 text-left">To'lov summasi</th>
              <th className="p-3 text-left">To'lov holati</th>
              <th className="p-3 text-left">Davomat</th>
              <th className="p-3 text-left">Holat</th>
            </tr>
          </thead>
          <tbody>
            {months.map((month, idx) => {
              const monthData = getMonthData(idx);
              const late = isLate(idx);
              
              return (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-semibold">{month}</td>
                  <td className="p-3">
                    {monthData.amount.toLocaleString()} so'm
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => updateMonthStatus(idx, 'paid', !monthData.paid)}
                      className={`px-3 py-1 rounded-lg transition-all flex items-center gap-2 ${
                        monthData.paid
                          ? "bg-green-500 text-white"
                          : late ? "bg-red-200 text-red-800" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {monthData.paid ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {monthData.paid ? "To'langan" : late ? "Muddati o'tgan" : "To'lanmagan"}
                    </button>
                    {monthData.paidDate && (
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(monthData.paidDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => updateMonthStatus(idx, 'attended', !monthData.attended)}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        monthData.attended
                          ? "bg-green-500 text-white"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {monthData.attended ? "✅ Kelgan" : "❌ Kelmagan"}
                    </button>
                  </td>
                  <td className="p-3">
                    {late && !monthData.paid ? (
                      <span className="text-red-600 text-xs font-semibold">⚠️ To'lov muddati o'tgan</span>
                    ) : monthData.paid ? (
                      <span className="text-green-600 text-xs">✅ To'langan</span>
                    ) : (
                      <span className="text-gray-500 text-xs">⏳ Kutilmoqda</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentMonthlyTable;