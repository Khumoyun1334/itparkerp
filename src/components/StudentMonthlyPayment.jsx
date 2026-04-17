import { useState } from "react";
import { DollarSign, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const StudentMonthlyPayment = ({ student, onUpdatePayment }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const months = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
  ];
  
  const getPaymentKey = (monthIndex) => {
    return `${selectedYear}-${monthIndex + 1}`;
  };
  
  const getPaymentStatus = (monthIndex) => {
    const key = getPaymentKey(monthIndex);
    return student.payments?.[key] || false;
  };
  
  const getPaymentDate = (monthIndex) => {
    const key = getPaymentKey(monthIndex);
    return student.paymentDates?.[key] || null;
  };
  
  const togglePayment = (monthIndex, e) => {
    e.stopPropagation(); // EVENT BUBBLING NI TO'XTATADI!
    const key = getPaymentKey(monthIndex);
    const newStatus = !getPaymentStatus(monthIndex);
    const paymentDate = newStatus ? new Date().toISOString() : null;
    onUpdatePayment(student.id, key, newStatus, paymentDate);
  };
  
  const isLate = (monthIndex) => {
    const paymentStatus = getPaymentStatus(monthIndex);
    if (paymentStatus) return false;
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    if (selectedYear < currentYear) return true;
    if (selectedYear === currentYear && monthIndex < currentMonth) return true;
    return false;
  };
  
  const monthlyAmount = student.monthlyFee - (student.monthlyFee * student.discount / 100);
  const totalPaid = months.filter((_, idx) => getPaymentStatus(idx)).length;
  const totalAmount = totalPaid * monthlyAmount;
  
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-4" onClick={(e) => e.stopPropagation()}>
      <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-bold flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Oylik to'lovlar
          </h3>
          <select
            value={selectedYear}
            onChange={(e) => {
              e.stopPropagation();
              setSelectedYear(parseInt(e.target.value));
            }}
            className="bg-white rounded-lg px-3 py-1 text-gray-800 text-sm cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
            <option value={new Date().getFullYear() + 1}>{new Date().getFullYear() + 1}</option>
          </select>
        </div>
      </div>
      
      <div className="p-4">
        {/* To'lov statistikasi */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalPaid}</div>
            <div className="text-xs text-gray-600">To'langan oy</div>
          </div>
          <div className="bg-orange-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-orange-600">{12 - totalPaid}</div>
            <div className="text-xs text-gray-600">Qolgan oy</div>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-green-600">{totalAmount.toLocaleString()}</div>
            <div className="text-xs text-gray-600">To'langan summa</div>
          </div>
        </div>
        
        {/* Oylar jadvali */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {months.map((month, idx) => {
            const isPaid = getPaymentStatus(idx);
            const late = isLate(idx);
            
            return (
              <button
                key={idx}
                onClick={(e) => togglePayment(idx, e)}
                className={`
                  p-3 rounded-xl text-center transition-all cursor-pointer
                  ${isPaid 
                    ? "bg-green-500 text-white hover:bg-green-600" 
                    : late 
                      ? "bg-red-200 text-red-800 hover:bg-red-300" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                <div className="font-semibold text-sm">{month}</div>
                <div className="text-xs mt-1">
                  {isPaid ? (
                    <CheckCircle className="w-4 h-4 inline" />
                  ) : late ? (
                    <AlertCircle className="w-4 h-4 inline" />
                  ) : (
                    <XCircle className="w-4 h-4 inline" />
                  )}
                </div>
                <div className="text-xs mt-1">
                  {monthlyAmount.toLocaleString().slice(0, 6)}...
                </div>
                {getPaymentDate(idx) && (
                  <div className="text-xs mt-1 opacity-75">
                    {new Date(getPaymentDate(idx)).toLocaleDateString()}
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>💰 Oylik to'lov: {monthlyAmount.toLocaleString()} so'm</p>
          <p className="text-green-600">✅ Yashil - to'langan | ❌ Qizil - muddati o'tgan | ⚪ Kulrang - to'lanmagan</p>
        </div>
      </div>
    </div>
  );
};

export default StudentMonthlyPayment;