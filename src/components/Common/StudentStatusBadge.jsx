const StudentStatusBadge = ({ isActive, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
        isActive 
          ? "bg-green-100 text-green-800 hover:bg-green-200" 
          : "bg-red-100 text-red-800 hover:bg-red-200"
      }`}
    >
      {isActive ? "✅ Faol" : "❌ No faol"}
    </button>
  );
};

export default StudentStatusBadge;