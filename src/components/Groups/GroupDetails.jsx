import { UserPlus, Trash2, BookOpen, Users } from "lucide-react";
import StatusButton from "../Common/StatusButton";

const GroupDetails = ({ group, onAddStudent, onToggleStatus, onRemoveStudent }) => {
  const calculateFinalFee = (student) => {
    const discount = (student.monthlyFee * student.discount) / 100;
    return student.monthlyFee - discount;
  };

  if (!group) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
        <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
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
        </div>
        <button
          onClick={onAddStudent}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          O'quvchi qo'shish
        </button>
      </div>

      {group.students.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">#</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">O'quvchi</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">To'lov (chegirma)</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Keldi/Kelmadi</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">To'lov holati</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {group.students.map((student, idx) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-all">
                  <td className="p-3 text-gray-600">{idx + 1}</td>
                  <td className="p-3">
                    <div>
                      <div className="font-semibold text-gray-800">
                        {student.name} {student.surname}
                      </div>
                      <div className="text-xs text-gray-500">
                        {student.monthlyFee.toLocaleString()} so'm - {student.discount}%
                      </div>
                      <div className="text-xs text-green-600 font-semibold">
                        Chegirma bilan: {calculateFinalFee(student).toLocaleString()} so'm
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm font-semibold text-gray-800">
                      {calculateFinalFee(student).toLocaleString()} so'm
                    </div>
                  </td>
                  <td className="p-3">
                    <StatusButton
                      status={student.attended}
                      onToggle={() => onToggleStatus(group.id, student.id, "attended")}
                      labelTrue="Keldi"
                      labelFalse="Kelmadi"
                    />
                  </td>
                  <td className="p-3">
                    <StatusButton
                      status={student.paid}
                      onToggle={() => onToggleStatus(group.id, student.id, "paid")}
                      labelTrue="To'ladi"
                      labelFalse="To'lamadi"
                    />
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => onRemoveStudent(group.id, student.id)}
                      className="text-red-600 hover:text-red-800 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Bu guruhda hali o'quvchi yo'q</p>
          <button
            onClick={onAddStudent}
            className="mt-3 text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            + O'quvchi qo'shish
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupDetails;