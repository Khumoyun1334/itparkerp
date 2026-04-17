import { useState } from "react";
import Navbar from "./components/Layout/Navbar";
import AddGroupForm from "./components/Groups/AddGroupForm";
import GroupList from "./components/Groups/GroupList";
import GroupDetails from "./components/Groups/GroupDetails";
import AddStudentModal from "./components/Groups/AddStudentModal";
import AddStudentForm from "./components/RegisteredStudents/AddStudentForm";
import RegisteredStudentsList from "./components/RegisteredStudents/RegisteredStudentsList";

function App() {
  const [activeTab, setActiveTab] = useState("groups");
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "React JS",
      teacher: "John Doe",
      schedule: "Du - Ju 18:00",
      students: [
        { id: 101, name: "Ali", surname: "Valiyev", monthlyFee: 500000, discount: 10, attended: true, paid: true },
        { id: 102, name: "Sardor", surname: "Aliyev", monthlyFee: 500000, discount: 0, attended: false, paid: false }
      ]
    },
    {
      id: 2,
      name: "Python Django",
      teacher: "Jane Smith",
      schedule: "Se - Pa 19:00",
      students: []
    }
  ]);
  
  const [registeredStudents, setRegisteredStudents] = useState([
    { id: 201, name: "Bobur", surname: "Karimov", course: "React JS", monthlyFee: 500000, discount: 5, registeredAt: "2026-01-15" },
    { id: 202, name: "Dilnoza", surname: "Rahmatova", course: "Python", monthlyFee: 450000, discount: 0, registeredAt: "2026-01-20" }
  ]);
  
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  // Guruh funksiyalari
  const addGroup = (groupData) => {
    const newGroup = {
      id: Date.now(),
      ...groupData,
      students: []
    };
    setGroups([...groups, newGroup]);
  };

  const deleteGroup = (groupId) => {
    if (window.confirm("Guruhni o'chirmoqchimisiz?")) {
      setGroups(groups.filter(g => g.id !== groupId));
      if (selectedGroup?.id === groupId) setSelectedGroup(null);
    }
  };

  // Ro'yxatdan o'tgan o'quvchi funksiyalari
  const addRegisteredStudent = (studentData) => {
    const newStudent = {
      id: Date.now(),
      ...studentData,
      registeredAt: new Date().toISOString().split('T')[0]
    };
    setRegisteredStudents([...registeredStudents, newStudent]);
  };

  const deleteRegisteredStudent = (studentId) => {
    if (window.confirm("O'quvchini o'chirmoqchimisiz?")) {
      setRegisteredStudents(registeredStudents.filter(s => s.id !== studentId));
    }
  };

  // Guruhga o'quvchi qo'shish
  const addStudentToGroup = (groupId, student) => {
    const group = groups.find(g => g.id === groupId);
    const isAlreadyInGroup = group.students.some(s => s.id === student.id);
    
    if (isAlreadyInGroup) {
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
    
    if (selectedGroup?.id === groupId) {
      setSelectedGroup(updatedGroups.find(g => g.id === groupId));
    }
  };

  // Guruh ichida holatni o'zgartirish
  const toggleStudentStatus = (groupId, studentId, field) => {
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
    if (selectedGroup?.id === groupId) {
      setSelectedGroup(updatedGroups.find(g => g.id === groupId));
    }
  };

  // Guruhdan o'quvchini o'chirish
  const removeStudentFromGroup = (groupId, studentId) => {
    if (window.confirm("O'quvchini guruhdan chiqarmoqchimisiz?")) {
      const group = groups.find(g => g.id === groupId);
      const studentToRemove = group.students.find(s => s.id === studentId);
      
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
      
      if (studentToRemove) {
        setRegisteredStudents([...registeredStudents, {
          id: studentToRemove.id,
          name: studentToRemove.name,
          surname: studentToRemove.surname,
          course: group.name,
          monthlyFee: studentToRemove.monthlyFee,
          discount: studentToRemove.discount,
          registeredAt: new Date().toISOString().split('T')[0]
        }]);
      }
      
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(updatedGroups.find(g => g.id === groupId));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "groups" && (
          <div>
            <AddGroupForm onAddGroup={addGroup} />
            
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
                  onToggleStatus={toggleStudentStatus}
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
        
        {activeTab === "registered" && (
          <div>
            <AddStudentForm onAddStudent={addRegisteredStudent} />
            <RegisteredStudentsList
              students={registeredStudents}
              onDeleteStudent={deleteRegisteredStudent}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;