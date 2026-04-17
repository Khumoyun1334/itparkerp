import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react";

const StudentDailyAttendance = ({ student, onUpdateAttendance }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const months = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
  ];
  
  const getAttendanceKey = (day) => {
    return `${year}-${month + 1}-${day}`;
  };
  
  const getAttendanceStatus = (day) => {
    const key = getAttendanceKey(day);
    return student.attendance?.[key] || false;
  };
  
  const toggleAttendance = (day, e) => {
    e.stopPropagation(); // EVENT BUBBLING NI TO'XTATADI!
    const key = getAttendanceKey(day);
    onUpdateAttendance(student.id, key, !getAttendanceStatus(day));
  };
  
  const prevMonth = (e) => {
    e.stopPropagation();
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const nextMonth = (e) => {
    e.stopPropagation();
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const getMonthlyStats = () => {
    let present = 0;
    let absent = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const key = getAttendanceKey(day);
      if (student.attendance?.[key]) {
        present++;
      } else {
        absent++;
      }
    }
    return { present, absent, total: daysInMonth };
  };
  
  const stats = getMonthlyStats();
  const attendanceRate = stats.total > 0 ? (stats.present / stats.total * 100).toFixed(1) : 0;
  
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-4" onClick={(e) => e.stopPropagation()}>
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Kunlik davomat kalendar
          </h3>
          <div className="flex items-center gap-4">
            <button 
              onClick={prevMonth} 
              className="text-white hover:bg-white/20 p-1 rounded transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white font-semibold">
              {months[month]} {year}
            </span>
            <button 
              onClick={nextMonth} 
              className="text-white hover:bg-white/20 p-1 rounded transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {/* Statistika paneli */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            <div className="text-xs text-gray-600">Kelgan kun</div>
          </div>
          <div className="bg-red-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            <div className="text-xs text-gray-600">Kelmagan kun</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{attendanceRate}%</div>
            <div className="text-xs text-gray-600">Davomat foizi</div>
          </div>
        </div>
        
        {/* Hafta kunlari */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"].map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Kalendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Bo'sh kunlar */}
          {Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-gray-50 rounded-lg p-2 text-center text-gray-300">
              -
            </div>
          ))}
          
          {/* Kunlar */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isPresent = getAttendanceStatus(day);
            const isToday = new Date().getDate() === day && 
                           new Date().getMonth() === month && 
                           new Date().getFullYear() === year;
            
            return (
              <button
                key={day}
                onClick={(e) => toggleAttendance(day, e)}
                className={`
                  relative p-2 rounded-lg text-center transition-all cursor-pointer
                  ${isPresent 
                    ? "bg-green-500 text-white hover:bg-green-600" 
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                  }
                  ${isToday ? "ring-2 ring-indigo-500 ring-offset-2" : ""}
                `}
              >
                <div className="text-sm font-semibold">{day}</div>
                <div className="text-xs mt-1">
                  {isPresent ? "✅" : "❌"}
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="mt-4 flex justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Kelgan</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-200 rounded"></div>
            <span>Kelmagan</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDailyAttendance;