import { useState } from "react";
import { Calculator, CheckCircle, DollarSign, TrendingDown, Calendar } from "lucide-react";
import { COURSE_TYPES, COURSE_DURATIONS, getMonthlyDays } from "./CourseTypes";

const StudentPaymentCalculator = ({ student, onUpdatePayment }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const months = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
  ];
  
  const courseType = student.courseType || COURSE_TYPES.WEEKLY_3_DAYS.id;
  const monthlyFee = student.monthlyFee;
  const hasDiscount = student.hasDiscount === true;
  const discount = hasDiscount ? (student.discount || 0) : 0;
  
  const startDate = student.startDate ? new Date(student.startDate) : new Date();
  const startMonth = startDate.getMonth();
  const startYear = startDate.getFullYear();
  
  const currentMonthIndex = (selectedYear - startYear) * 12 + (selectedMonth - startMonth);
  const isFirstMonth = currentMonthIndex === 0;
  const isWithinCourse = currentMonthIndex >= 0 && currentMonthIndex < 6;
  
  // Oydagi umumiy dars kunlari
  const totalLessonDays = getMonthlyDays(courseType, selectedYear, selectedMonth);
  
  // Kelgan kunlar
  const getAttendedDays = () => {
    let count = 0;
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const attendanceKey = `${selectedYear}-${selectedMonth + 1}-${day}`;
      if (student.attendance?.[attendanceKey]) {
        count++;
      }
    }
    return count;
  };
  
  const attendedDays = getAttendedDays();
  const missedDays = totalLessonDays - attendedDays;
  
  // KUNLIK NARX
  const dailyRate = totalLessonDays > 0 ? monthlyFee / totalLessonDays : 0;
  
  // KELMAGAN KUNLAR UCHUN CHEGIRMA
  const missedDeduction = missedDays * dailyRate;
  
  // ASOSIY TO'LOV (chegirma bilan)
  let basePayment = monthlyFee;
  let discountAmount = 0;
  
  if (isFirstMonth && hasDiscount && discount > 0) {
    discountAmount = (monthlyFee * discount) / 100;
    basePayment = monthlyFee - discountAmount;
  }
  
  // HAQIQIY TO'LOV (kelmagan kunlar ayirilgan)
  const actualPayment = Math.max(0, basePayment - missedDeduction);
  
  const getPaymentKey = () => {
    return `${selectedYear}-${selectedMonth + 1}`;
  };
  
  const isPaid = student.payments?.[getPaymentKey()] || false;
  
  const togglePayment = () => {
    if (!isWithinCourse) {
      alert("Bu oy kurs doirasiga kirmaydi! Kurs 6 oylik.");
      return;
    }
    const key = getPaymentKey();
    const newStatus = !isPaid;
    const paymentDate = newStatus ? new Date().toISOString() : null;
    onUpdatePayment(student.id, key, newStatus, paymentDate, actualPayment);
  };
  
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-6 mt-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Calculator className="w-6 h-6 text-indigo-600" />
        Oylik to'lov kalkulyatori
      </h3>
      
      {/* Kurs ma'lumotlari */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl p-3 text-center">
          <div className="text-xs text-gray-500">Kurs turi</div>
          <div className="font-semibold text-sm">
            {courseType === COURSE_TYPES.WEEKLY_3_DAYS.id ? "📅 Haftada 3 kun" : "📆 Haftada 5 kun"}
          </div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center">
          <div className="text-xs text-gray-500">Kurs davomiyligi</div>
          <div className="font-semibold text-sm">🎓 6 oy</div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center">
          <div className="text-xs text-gray-500">Boshlangan sana</div>
          <div className="font-semibold text-sm">{startDate.toLocaleDateString()}</div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center">
          <div className="text-xs text-gray-500">Oy holati</div>
          <div className="font-semibold text-sm">
            {isFirstMonth && hasDiscount && discount > 0 ? "🎉 Chegirmali oy" : "Oddiy oy"}
          </div>
        </div>
      </div>
      
      {!isWithinCourse && (
        <div className="bg-red-100 border border-red-400 text-red-700 rounded-xl p-3 mb-4 text-sm">
          ⚠️ Bu oy kurs doirasiga kirmaydi! Kurs 6 oylik bo'lib, {startDate.toLocaleDateString()} da boshlangan.
        </div>
      )}
      
      {/* Oy tanlash */}
      <div className="flex gap-4 mb-6">
        <select 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="border rounded-lg p-2 flex-1"
          disabled={!isWithinCourse}
        >
          {months.map((month, idx) => (
            <option key={idx} value={idx}>{month}</option>
          ))}
        </select>
        <select 
          value={selectedYear} 
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="border rounded-lg p-2 flex-1"
          disabled={!isWithinCourse}
        >
          <option value={startYear}>{startYear}</option>
          <option value={startYear + 1}>{startYear + 1}</option>
        </select>
      </div>
      
      {/* Statistika */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{totalLessonDays}</div>
          <div className="text-xs text-gray-500">Umumiy dars kuni</div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{attendedDays}</div>
          <div className="text-xs text-gray-500">Kelgan kun</div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-red-600">{missedDays}</div>
          <div className="text-xs text-gray-500">Kelmagan kun</div>
        </div>
      </div>
      
      {/* To'lov hisobi */}
      <div className="bg-white rounded-xl p-4 mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">To'lov hisobi</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Oylik to'lov:</span>
            <span>{monthlyFee.toLocaleString()} so'm</span>
          </div>
          
          {isFirstMonth && hasDiscount && discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span className="flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                Chegirma ({discount}%) - FAQAT 1-oy:
              </span>
              <span>- {discountAmount.toLocaleString()} so'm</span>
            </div>
          )}
          
          <div className="flex justify-between text-blue-600">
            <span>Kutilayotgan to'lov:</span>
            <span>{basePayment.toLocaleString()} so'm</span>
          </div>
          
          {missedDays > 0 && (
            <div className="flex justify-between text-orange-600">
              <span>Kelmagan kunlar ({missedDays} kun):</span>
              <span>- {missedDeduction.toLocaleString()} so'm</span>
            </div>
          )}
          
          <div className="border-t-2 border-dashed pt-2 mt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Haqiqiy to'lov:</span>
              <span className="text-green-600">{actualPayment.toLocaleString()} so'm</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* To'lov tugmasi */}
      <button
        onClick={togglePayment}
        disabled={!isWithinCourse}
        className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
          isPaid 
            ? "bg-green-500 text-white hover:bg-green-600" 
            : !isWithinCourse
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        {isPaid ? (
          <>
            <CheckCircle className="w-5 h-5" />
            To'langan ({actualPayment.toLocaleString()} so'm)
          </>
        ) : (
          <>
            <DollarSign className="w-5 h-5" />
            To'lov qilish ({actualPayment.toLocaleString()} so'm)
          </>
        )}
      </button>
      
      <div className="mt-3 text-xs text-center text-gray-500">
        💡 Bir kunlik dars narxi: {dailyRate.toLocaleString()} so'm
      </div>
      
      <div className="mt-2 text-center text-xs text-indigo-600">
        📅 Jami kurs: 6 oy | Haftada 3 kun (Du-Ch-Ju) | Taxminan 72 dars kuni
      </div>
      
      <div className="mt-1 text-center text-xs text-orange-600">
        ⚠️ Kelmagan kunlar uchun to'lov hisobdan chiqariladi
      </div>
      
      {isFirstMonth && hasDiscount && discount > 0 && (
        <div className="mt-1 text-center text-xs text-green-600">
          🎉 Chegirma faqat birinchi oy uchun amal qiladi!
        </div>
      )}
    </div>
  );
};

export default StudentPaymentCalculator;