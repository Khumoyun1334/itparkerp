import { FolderPlus, PlusCircle } from "lucide-react";
import { useState } from "react";

const AddGroupForm = ({ onAddGroup }) => {
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupTeacher, setNewGroupTeacher] = useState("");
  const [newGroupSchedule, setNewGroupSchedule] = useState("");

  const handleSubmit = () => {
    if (!newGroupName || !newGroupTeacher) {
      alert("Guruh nomi va o'qituvchini kiriting!");
      return;
    }
    onAddGroup({
      name: newGroupName,
      teacher: newGroupTeacher,
      schedule: newGroupSchedule || "Kunlar belgilanmagan",
    });
    setNewGroupName("");
    setNewGroupTeacher("");
    setNewGroupSchedule("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <FolderPlus className="w-6 h-6 mr-2 text-indigo-600" />
        Yangi guruh yaratish
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Guruh nomi (masalan: React JS)"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="O'qituvchi ismi"
          value={newGroupTeacher}
          onChange={(e) => setNewGroupTeacher(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Dars jadvali (masalan: Du-Ju 18:00)"
          value={newGroupSchedule}
          onChange={(e) => setNewGroupSchedule(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
      >
        <PlusCircle className="w-5 h-5" />
        Guruh yaratish
      </button>
    </div>
  );
};

export default AddGroupForm;