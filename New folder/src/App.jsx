import { useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import Navbar from "./components/Layout/Navbar";
import AddGroupForm from "./components/Groups/AddGroupForm";
import GroupList from "./components/Groups/GroupList";
import GroupDetails from "./components/Groups/GroupDetails";
import AddStudentModal from "./components/Groups/AddStudentModal";
import AddStudentForm from "./components/RegisteredStudents/AddStudentForm";
import RegisteredStudentsList from "./components/RegisteredStudents/RegisteredStudentsList";

function App() {
  const [activeTab, setActiveTab] = useState("groups");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddGroupForm, setShowAddGroupForm] = useState(false);
  
  // LocalStorage bilan ma'lumotlarni saqlash
  const [groups, setGroups] = useLocalStorage("erp_groups", []);
  const [registeredStudents, setRegisteredStudents] = useLocalStorage("erp_registered_students", []);

  // Guruh funksiyalari
  const addGroup = (groupData) => {
    const newGroup = {
      id: Date.now(),
      name: groupData.name,
      teacher: groupData.teacher,
      schedule: groupData.schedule || "Kunlar belgilanmagan",
      students: []
    };
    setGroups([...groups, newGroup]);
    setShowAddGroupForm(false);
  };

  const deleteGroup = (groupId) => {
    if (window.confirm("Guruhni o'chirmoqchimisiz?")) {
      setGroups(groups.filter(g => g.id !== groupId));
      if (selectedGroup?.id === groupId) setSelectedGroup(null);
    }
  };

  // O'quvchi funksiyalari
  const addRegisteredStudent = (studentData) => {
    const newStudent = {
      id: Date.now(),
      name: studentData.name,
      surname: studentData.surname,
      course: studentData.course,
      monthlyFee: parseFloat(studentData.monthlyFee),
      discount: parseFloat(studentData.discount) || 0,
      registeredAt: new Date().toISOString().split('T')[0]
    };
    setRegisteredStudents([...registeredStudents, newStudent]);
  };

  const deleteRegisteredStudent = (studentId) => {
    if (window.confirm("O'quvchini ro'yxatdan o'chirmoqchimisiz?")) {
      setRegisteredStudents(registeredStudents.filter(s => s.id !== studentId));
    }
  };

  // Guruhga o'quvchi qo'shish
  const addStudentToGroup = (groupId, studentJSON) => {
    const student = JSON.parse(studentJSON);
    const group = groups.find(g => g.id === groupId);
    
    if (group.students.some(s => s.id === student.id)) {
      alert("Bu o'quvchi allaqachon guruhda!");
      return;
    }
    
    const updatedGroups = groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          students: [...g.students, {
            id: student.id,
            name: student.name,
            surname: student.surname,
            monthlyFee: student.monthlyFee,
            discount: student.discount,
            attended: false,
            paid: false
          }]
        };
      }
      return g;
    });
    
    setGroups(updatedGroups);
    setRegisteredStudents(registeredStudents.filter(s => s.id !== student.id));
    setShowAddStudentModal(false);
    setSelectedGroup(updatedGroups.find(g => g.id === groupId));
  };

  // Guruhdan o'quvchini o'chirish
  const removeStudentFromGroup = (groupId, studentId) => {
    if (window.confirm("O'quvchini guruhdan chiqarmoqchimisiz?")) {
      const group = groups.find(g => g.id === groupId);
      const student = group.students.find(s => s.id === studentId);
      
      const updatedGroups = groups.map(g => {
        if (g.id === groupId) {
          return {
            ...g,
            students: g.students.filter(s => s.id !== studentId)
          };
        }
        return g;
      });
      
      setGroups(updatedGroups);
      setRegisteredStudents([...registeredStudents, {
        id: student.id,
        name: student.name,
        surname: student.surname,
        course: group.name,
        monthlyFee: student.monthlyFee,
        discount: student.discount,
        registeredAt: new Date().toISOString().split('T')[0]
      }]);
      setSelectedGroup(updatedGroups.find(g => g.id === groupId));
    }
  };

  // Holatni o'zgartirish
  const toggleStatus = (groupId, studentId, field) => {
    const updatedGroups = groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          students: g.students.map(s => {
            if (s.id === studentId) {
              return { ...s, [field]: !s[field] };
            }
            return s;
          })
        };
      }
      return g;
    });
    
    setGroups(updatedGroups);
    setSelectedGroup(updatedGroups.find(g => g.id === groupId));
  };

  // Eksport/Import funksiyalari
  const exportData = () => {
    const data = { groups, registeredStudents };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `erp_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.groups) setGroups(data.groups);
        if (data.registeredStudents) setRegisteredStudents(data.registeredStudents);
        alert("Ma'lumotlar tiklandi!");
        window.location.reload();
      } catch (error) {
        alert("Xato fayl formati!");
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (window.confirm("⚠️ BARCHA MA'LUMOTLAR O'CHIRILADI! Davom etasizmi?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Eksport/Import tugmalari */}
        <div className="flex justify-end gap-2 mb-4">
          <button onClick={exportData} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
            💾 Eksport
          </button>
          <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm cursor-pointer">
            📥 Import
            <input type="file" accept=".json" onChange={importData} className="hidden" />
          </label>
          <button onClick={clearAllData} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm">
            🗑️ Tozalash
          </button>
        </div>

        {/* Guruhlar bo'limi */}
        {activeTab === "groups" && (
          <div>
            {!showAddGroupForm ? (
              <button
                onClick={() => setShowAddGroupForm(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 mb-6 flex items-center gap-2"
              >
                ➕ Yangi guruh yaratish
              </button>
            ) : (
              <AddGroupForm onAddGroup={addGroup} onCancel={() => setShowAddGroupForm(false)} />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <GroupList
                  groups={groups}
                  selectedGroup={selectedGroup}
                  onSelectGroup={setSelectedGroup}
                  onDeleteGroup={deleteGroup}
                />
              </div>
              
              <div className="lg:col-span-2">
                <GroupDetails
                  group={selectedGroup}
                  onAddStudent={() => setShowAddStudentModal(true)}
                  onToggleStatus={toggleStatus}
                  onRemoveStudent={removeStudentFromGroup}
                />
              </div>
            </div>

            {showAddStudentModal && selectedGroup && (
              <AddStudentModal
                group={selectedGroup}
                registeredStudents={registeredStudents}
                onAddStudent={addStudentToGroup}
                onClose={() => setShowAddStudentModal(false)}
              />
            )}
          </div>
        )}

        {/* Ro'yxatdan o'tgan o'quvchilar bo'limi */}
        {activeTab === "registered" && (
          <div>
            <AddStudentForm onAddStudent={addRegisteredStudent} />
            <RegisteredStudentsList
              students={registeredStudents}
              onDeleteStudent={deleteRegisteredStudent}
            />
          </div>
        )}

        {/* Info qismi */}
        <div className="mt-6 text-center text-sm text-gray-600 bg-white rounded-lg p-3">
          <p>💾 Barcha ma'lumotlar brauzeringizda saqlanadi. Sahifa yangilansa ham yo'qolmaydi!</p>
          <p className="text-xs mt-1">📌 Ma'lumotlarni zaxiralash uchun "Eksport" tugmasidan foydalaning</p>
        </div>
      </div>
    </div>
  );
}

export default App;