import { useState } from "react";
import { UserPlus, Trash2, Users, Phone, ChevronDown, ChevronUp } from "lucide-react";
import StudentStatusBadge from "../Common/StudentStatusBadge";
import StudentDailyAttendance from "../StudentDailyAttendance";
import StudentPaymentCalculator from "../StudentPaymentCalculator";

const GroupDetails = ({ 
  group, 
  onAddStudent, 
  onRemoveStudent, 
  onToggleActive, 
  onUpdateAttendance,
  onUpdatePayment
}) => {
  const [expandedStudent, setExpandedStudent] = useState(null);
  
  const calculateFinalFee = (monthlyFee, discount) => {
    return monthlyFee - (monthlyFee * discount / 100);
  };

  const formatPhone = (phone) => {
    if (!phone) return "Noma'lum";
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 12 && cleaned.startsWith('998')) {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`;
    }
    if (cleaned.length === 9) {
      return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)}`;
    }
    return phone;
  };

  const getStudentStats = (student) => {
    const attendance = student.attendance || {};
    const payments = student.payments || {};
    const totalDays = Object.keys(attendance).length;
    const presentDays = Object.values(attendance).filter(v => v === true).length;
    const paidMonths = Object.values(payments).filter(v => v === true).length;
    
    return { presentDays, totalDays, paidMonths };
  };

  const toggleExpand = (studentId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  // Davomatni yangilash
  const handleUpdateAttendance = (studentId, dateKey, status) => {
    if (onUpdateAttendance) {
      onUpdateAttendance(group.id, studentId, dateKey, status);
    }
  };

  // To'lovni yangilash
  const handleUpdatePayment = (studentId, monthKey, status, paymentDate, amount) => {
    if (onUpdatePayment) {
      onUpdatePayment(group.id, studentId, monthKey, status, paymentDate, amount);
    }
  };

  // O'quvchini o'chirish
  const handleRemoveStudent = (studentId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onRemoveStudent) {
      onRemoveStudent(group.id, studentId);
    }
  };

  // Faollikni o'zgartirish
  const handleToggleActive = (studentId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onToggleActive) {
      onToggleActive(group.id, studentId);
    }
  };

  if (!group) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
        <div className="text-6xl mb-4">📌</div>
        <p className="text-gray-500 text-lg">Chapdan guruh tanlang</p>
        <p className="text-gray-400 text-sm">Guruh ichida o'quvchilarni boshqarishingiz mumkin</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{group.name}</h2>
          <p className="text-gray-600 mt-1">👨‍🏫 {group.teacher} | 📅 {group.schedule}</p>
          <p className="text-sm text-indigo-600 mt-1">
            👥 {group.students?.filter(s => s.isActive !== false).length || 0} faol o'quvchi
          </p>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            onAddStudent();
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
          type="button"
        >
          <UserPlus className="w-5 h-5" />
          O'quvchi qo'shish
        </button>
      </div>

      {group.students && group.students.length > 0 ? (
        <div className="space-y-4">
          {group.students.map((student, idx) => {
            const stats = getStudentStats(student);
            const isExpanded = expandedStudent === student.id;
            const isActive = student.isActive !== false;
            
            return (
              <div key={student.id} className={`border rounded-xl overflow-hidden ${!isActive ? 'opacity-60' : ''}`}>
                <div className={`p-4 ${!isActive ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-50 transition-all`}>
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-semibold text-gray-800">
                          {idx + 1}. {student.name} {student.surname}
                        </span>
                        <StudentStatusBadge 
                          isActive={isActive}
                          onToggle={() => handleToggleActive(student.id)}
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {formatPhone(student.phone)}
                        </span>
                        <span>💰 {student.monthlyFee?.toLocaleString() || 0} so'm</span>
                        <span>🎁 {student.discount || 0}% chegirma</span>
                        <span className="text-green-600 font-semibold">
                          {calculateFinalFee(student.monthlyFee || 0, student.discount || 0).toLocaleString()} so'm/oy
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="text-blue-600">
                          📊 Davomat: {stats.presentDays}/{stats.totalDays || 0} kun ({stats.totalDays > 0 ? ((stats.presentDays/stats.totalDays)*100).toFixed(1) : 0}%)
                        </span>
                        <span className="text-green-600">
                          💰 To'lov: {stats.paidMonths}/6 oy
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => toggleExpand(student.id, e)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-all"
                        type="button"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={(e) => handleRemoveStudent(student.id, e)}
                        className="text-red-600 hover:text-red-800 transition-all p-2"
                        type="button"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {isExpanded && isActive && (
                  <div className="border-t p-4 bg-gray-50">
                    <StudentDailyAttendance 
                      student={student}
                      onUpdateAttendance={handleUpdateAttendance}
                    />
                    <StudentPaymentCalculator 
                      student={student}
                      onUpdatePayment={handleUpdatePayment}
                    />
                  </div>
                )}
                
                {isExpanded && !isActive && (
                  <div className="border-t p-4 bg-gray-100 text-center text-gray-500">
                    ⚠️ O'quvchi no faol holatda. Davomat va to'lov qilib bo'lmaydi.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Bu guruhda hali o'quvchi yo'q</p>
          <button
            onClick={(e) => {
              e.preventDefault();
              onAddStudent();
            }}
            className="mt-3 text-indigo-600 hover:text-indigo-700 font-semibold"
            type="button"
          >
            + O'quvchi qo'shish
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupDetails;