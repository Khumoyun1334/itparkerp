import { UserPlus, PlusCircle } from "lucide-react";
import { useState } from "react";

const AddStudentForm = ({ onAddStudent }) => {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    course: "",
    monthlyFee: "",
    discount: "0",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.surname || !form.course || !form.monthlyFee) {
      alert("Barcha maydonlarni to'ldiring!");
      return;
    }
    onAddStudent({
      ...form,
      monthlyFee: parseFloat(form.monthlyFee),
      discount: parseFloat(form.discount),
    });
    setForm({ name: "", surname: "", course: "", monthlyFee: "", discount: "0" });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <UserPlus className="w-6 h-6 mr-2 text-indigo-600" />
        Yangi o'quvchi ro'yxatdan o'tkazish
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          name="name"
          placeholder="Ism"
          value={form.name}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          name="surname"
          placeholder="Familiya"
          value={form.surname}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          name="course"
          placeholder="Kurs nomi"
          value={form.course}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="number"
          name="monthlyFee"
          placeholder="Oylik to'lov (so'm)"
          value={form.monthlyFee}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="number"
          name="discount"
          placeholder="Chegirma %"
          value={form.discount}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
      >
        <PlusCircle className="w-5 h-5" />
        Ro'yxatga olish
      </button>
    </div>
  );
};

export default AddStudentForm;