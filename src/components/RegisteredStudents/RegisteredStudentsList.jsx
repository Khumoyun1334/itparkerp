import { Trash2, Users, Phone } from "lucide-react";

const RegisteredStudentsList = ({ students = [], onDeleteStudent }) => {
  const calculateFinalFee = (monthlyFee, discount) => {
    if (!monthlyFee) return 0;
    return monthlyFee - (monthlyFee * (discount || 0) / 100);
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

  // Agar students undefined yoki null bo'lsa, empty array ishlatamiz
  const studentList = students || [];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <tr>
              <th className="p-4 text-left">#</th>
              <th className="p-4 text-left">FIO</th>
              <th className="p-4 text-left">Telefon</th>
              <th className="p-4 text-left">Kurs</th>
              <th className="p-4 text-left">Oylik to'lov</th>
              <th className="p-4 text-left">Chegirma</th>
              <th className="p-4 text-left">Chegirma bilan</th>
              <th className="p-4 text-left">Ro'yxatdan o'tgan sana</th>
              <th className="p-4 text-left">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {studentList.length > 0 ? (
              studentList.map((student, idx) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-all">
                  <td className="p-4 text-gray-600">{idx + 1}</td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-800">
                      {student.name || ""} {student.surname || ""}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a href={`tel:${student.phone || ""}`} className="hover:text-indigo-600 text-sm">
                        {formatPhone(student.phone)}
                      </a>
                    </div>
                  </td>
                  <td className="p-4 text-gray-700">{student.course || ""}</td>
                  <td className="p-4 text-gray-700">
                    {(student.monthly_fee || student.monthlyFee || 0).toLocaleString()} so'm
                  </td>
                  <td className="p-4 text-gray-700">{(student.discount || 0)}%</td>
                  <td className="p-4 font-semibold text-green-600">
                    {calculateFinalFee(student.monthly_fee || student.monthlyFee || 0, student.discount).toLocaleString()} so'm
                  </td>
                  <td className="p-4 text-gray-500 text-sm">{student.registered_at || student.registeredAt || "-"}</td>
                  <td className="p-4">
                    <button
                      onClick={() => onDeleteStudent(student.id)}
                      className="text-red-600 hover:text-red-800 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                   </td>
                 </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Hali ro'yxatdan o'tgan o'quvchi yo'q</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegisteredStudentsList;