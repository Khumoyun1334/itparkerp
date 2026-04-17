import { useState } from "react";

const AddGroupForm = ({ onAddGroup, onCancel }) => {
  const [newGroup, setNewGroup] = useState({
    name: "",
    teacher: "",
    schedule: ""
  });

  const handleSubmit = () => {
    if (!newGroup.name || !newGroup.teacher) {
      alert("Guruh nomi va o'qituvchini kiriting!");
      return;
    }
    onAddGroup(newGroup);
    setNewGroup({ name: "", teacher: "", schedule: "" });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Yangi guruh yaratish</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Guruh nomi"
          value={newGroup.name}
          onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          placeholder="O'qituvchi"
          value={newGroup.teacher}
          onChange={(e) => setNewGroup({...newGroup, teacher: e.target.value})}
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          placeholder="Dars jadvali (masalan: Du-Ju 18:00)"
          value={newGroup.schedule}
          onChange={(e) => setNewGroup({...newGroup, schedule: e.target.value})}
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="flex gap-2">
        <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          Saqlash
        </button>
        <button onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
          Bekor qilish
        </button>
      </div>
    </div>
  );
};

export default AddGroupForm;