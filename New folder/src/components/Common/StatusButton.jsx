const StatusButton = ({ status, onToggle, labelTrue, labelFalse }) => {
  return (
    <button
      onClick={onToggle}
      className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
        status
          ? "bg-green-500 text-white hover:bg-green-600"
          : "bg-red-200 text-red-800 hover:bg-red-300"
      }`}
    >
      {status ? "✅" : "❌"}
      {status ? labelTrue : labelFalse}
    </button>
  );
};

export default StatusButton;