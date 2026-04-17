const AddStudentModal = ({ group, registeredStudents, onAddStudent, onClose }) => {
  const handleAddStudent = (studentData) => {
    if (!studentData) {
      alert("O'quvchi tanlang!");
      return;
    }
    onAddStudent(group.id, studentData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4">O'quvchi qo'shish</h3>
        <p className="text-gray-600 mb-4">
          Guruh: <span className="font-semibold">{group?.name}</span>
        </p>

        <select
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => handleAddStudent(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>O'quvchi tanlang</option>
          {registeredStudents.map((student) => (
            <option key={student.id} value={JSON.stringify(student)}>
              {student.name} {student.surname} - {student.course}
            </option>
          ))}
        </select>

        <button
          onClick={onClose}
          className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-all"
        >
          Bekor qilish
        </button>

        {registeredStudents.length === 0 && (
          <p className="text-center text-gray-500 mt-4 text-sm">
            Ro'yxatdan o'tgan o'quvchi yo'q
          </p>
        )}
      </div>
    </div>
  );
};

export default AddStudentModal;