import { Trash2 } from "lucide-react";

const GroupList = ({ groups, selectedGroup, onSelectGroup, onDeleteGroup }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800 mb-3">Barcha guruhlar</h3>
      {groups.map((group) => (
        <div
          key={group.id}
          onClick={() => onSelectGroup(group)}
          className={`bg-white rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg border-2 ${
            selectedGroup?.id === group.id
              ? "border-indigo-500 shadow-lg bg-indigo-50"
              : "border-gray-200 hover:border-indigo-300"
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 text-lg">{group.name}</h4>
              <p className="text-sm text-gray-600 mt-1">👨‍🏫 {group.teacher}</p>
              <p className="text-xs text-gray-500 mt-1">📅 {group.schedule}</p>
              <p className="text-xs text-indigo-600 mt-2">👥 {group.students.length} o'quvchi</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteGroup(group.id);
              }}
              className="text-red-500 hover:text-red-700 transition-all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
      {groups.length === 0 && (
        <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
          Hozircha guruh yo'q
        </div>
      )}
    </div>
  );
};

export default GroupList;