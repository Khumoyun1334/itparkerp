const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">📚</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              IT PARK ERP
            </h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("groups")}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === "groups"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              📊 Guruhlar
            </button>
            <button
              onClick={() => setActiveTab("registered")}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === "registered"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              👥 Ro'yxatdan o'tganlar
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;