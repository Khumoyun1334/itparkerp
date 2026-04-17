import { Trash2, Users } from "lucide-react";

const RegisteredStudentsList = ({ students, onDeleteStudent }) => {
  const calculateFinalFee = (monthlyFee, discount) => {
    return monthlyFee - (monthlyFee * discount / 100);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <tr>
              <th className="p-4 text-left">#</th>
              <th className="p-4 text-left">FIO</th>
              <th className="p-4 text-left">Kurs</th>
              <th className="p-4 text-left">Oylik to'lov</th>
              <th className="p-4 text-left">Chegirma</th>
              <th className="p-4 text-left">Chegirma bilan</th>
              <th className="p-4 text-left">Ro'yxatdan o'tgan sana</th>
              <th className="p-4 text-left">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-all">
                <td className="p-4 text-gray-600">{idx + 1}</td>
                <td className="p-4">
                  <div className="font-semibold text-gray-800">
                    {student.name} {student.surname}
                  </div>
                 </td>
                <td className="p-4 text-gray-700">{student.course}</td>
                <td className="p-4 text-gray-700">{student.monthlyFee.toLocaleString()} so'm</td>
                <td className="p-4 text-gray-700">{student.discount}%</td>
                <td className="p-4 font-semibold text-green-600">
                  {calculateFinalFee(student.monthlyFee, student.discount).toLocaleString()} so'm
                </td>
                <td className="p-4 text-gray-500 text-sm">{student.registeredAt}</td>
                <td className="p-4">
                  <button
                    onClick={() => onDeleteStudent(student.id)}
                    className="text-red-600 hover:text-red-800 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
               </tr>
            ))}
          </tbody>
        </table>
        {students.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Hali ro'yxatdan o'tgan o'quvchi yo'q</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisteredStudentsList;