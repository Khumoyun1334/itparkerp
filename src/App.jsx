import { useState } from "react";
import useSupabase from "./hooks/useSupabase";
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
  
  const { 
    data: groups, 
    loading: groupsLoading, 
    addData: addGroupToDB, 
    updateData: updateGroupInDB,
    deleteData: deleteGroupFromDB,
    refresh: refreshGroups
  } = useSupabase("groups");
  
  const { 
    data: registeredStudents, 
    loading: studentsLoading, 
    addData: addStudentToDB, 
    deleteData: deleteStudentFromDB,
    refresh: refreshStudents
  } = useSupabase("registered_students");

  // Guruh qo'shish
  const handleAddGroup = async (groupData) => {
    const newGroup = {
      name: groupData.name,
      teacher: groupData.teacher,
      schedule: groupData.schedule || "Kunlar belgilanmagan",
      students: []
    };
    const result = await addGroupToDB(newGroup);
    if (result) {
      alert("✅ Guruh muvaffaqiyatli qo'shildi!");
      setShowAddGroupForm(false);
      await refreshGroups();
    } else {
      alert("❌ Xatolik yuz berdi!");
    }
  };

  // Guruh o'chirish
  const handleDeleteGroup = async (groupId) => {
    if (window.confirm("Guruhni o'chirmoqchimisiz?")) {
      const result = await deleteGroupFromDB(parseInt(groupId));
      if (result) {
        alert("✅ Guruh o'chirildi!");
        if (selectedGroup?.id === groupId) setSelectedGroup(null);
        await refreshGroups();
      } else {
        alert("❌ Xatolik yuz berdi!");
      }
    }
  };

  // O'quvchi qo'shish
  const handleAddStudent = async (studentData) => {
    const phoneRegex = /^\+?998[0-9]{9}$|^0[0-9]{9}$/;
    const cleanPhone = studentData.phone.replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      alert("Telefon raqam noto'g'ri formatda! Masalan: +998901234567");
      return;
    }
    
    const newStudent = {
      name: studentData.name,
      surname: studentData.surname,
      phone: cleanPhone,
      course: studentData.course,
      monthly_fee: parseFloat(studentData.monthlyFee),
      discount: parseFloat(studentData.discount) || 0
    };
    
    const result = await addStudentToDB(newStudent);
    if (result) {
      alert("✅ O'quvchi muvaffaqiyatli qo'shildi!");
      await refreshStudents();
    } else {
      alert("❌ Xatolik yuz berdi!");
    }
  };

  // O'quvchi o'chirish
  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("O'quvchini o'chirmoqchimisiz?")) {
      const result = await deleteStudentFromDB(parseInt(studentId));
      if (result) {
        alert("✅ O'quvchi o'chirildi!");
        await refreshStudents();
      } else {
        alert("❌ Xatolik yuz berdi!");
      }
    }
  };

  // GURUHGA O'QUVCHI QO'SHISH (TO'LIQ FUNKSIYA)
  const handleAddStudentToGroup = async (groupId, studentJSON) => {
    const student = JSON.parse(studentJSON);
    
    // Hozirgi guruhni topish
    const currentGroup = groups.find(g => g.id == groupId);
    if (!currentGroup) {
      alert("Guruh topilmadi!");
      return;
    }
    
    // O'quvchi allaqachon guruhdami?
    const existingStudents = currentGroup.students || [];
    if (existingStudents.some(s => s.id == student.id)) {
      alert("Bu o'quvchi allaqachon guruhda!");
      return;
    }
    
    // Yangi o'quvchini qo'shish
    const updatedStudents = [...existingStudents, {
      id: student.id,
      name: student.name,
      surname: student.surname,
      phone: student.phone,
      monthlyFee: student.monthly_fee,
      discount: student.discount,
      attended: false,
      paid: false,
      attendance: {},
      payments: {},
      paymentDates: {},
      paymentAmounts: {}
    }];
    
    // Guruhni yangilash
    const result = await updateGroupInDB(parseInt(groupId), {
      ...currentGroup,
      students: updatedStudents
    });
    
    if (result) {
      // Ro'yxatdan o'tgan o'quvchilardan o'chirish
      await deleteStudentFromDB(parseInt(student.id));
      
      alert(`✅ "${student.name} ${student.surname}" guruhga qo'shildi!`);
      setShowAddStudentModal(false);
      
      // Ma'lumotlarni yangilash
      await refreshGroups();
      await refreshStudents();
      
      // Tanlangan guruhni yangilash
      const updatedGroup = groups.find(g => g.id == groupId);
      setSelectedGroup(updatedGroup);
    } else {
      alert("❌ Xatolik yuz berdi!");
    }
  };

  // Guruhdan o'quvchini o'chirish
  const handleRemoveStudentFromGroup = async (groupId, studentId) => {
    if (window.confirm("O'quvchini guruhdan chiqarmoqchimisiz?")) {
      const currentGroup = groups.find(g => g.id == groupId);
      if (!currentGroup) return;
      
      const studentToRemove = currentGroup.students?.find(s => s.id == studentId);
      if (!studentToRemove) return;
      
      // Guruhdan o'chirish
      const updatedStudents = currentGroup.students.filter(s => s.id != studentId);
      const result = await updateGroupInDB(parseInt(groupId), {
        ...currentGroup,
        students: updatedStudents
      });
      
      if (result) {
        // O'quvchini ro'yxatga qaytarish
        await addStudentToDB({
          name: studentToRemove.name,
          surname: studentToRemove.surname,
          phone: studentToRemove.phone,
          course: currentGroup.name,
          monthly_fee: studentToRemove.monthlyFee,
          discount: studentToRemove.discount
        });
        
        alert(`✅ O'quvchi guruhdan chiqarildi!`);
        await refreshGroups();
        await refreshStudents();
        
        const updatedGroup = groups.find(g => g.id == groupId);
        setSelectedGroup(updatedGroup);
      } else {
        alert("❌ Xatolik yuz berdi!");
      }
    }
  };

  // Davomatni yangilash
  const handleUpdateAttendance = async (groupId, studentId, dateKey, status) => {
    const currentGroup = groups.find(g => g.id == groupId);
    if (!currentGroup) return;
    
    const updatedStudents = currentGroup.students.map(s => {
      if (s.id == studentId) {
        return {
          ...s,
          attendance: {
            ...(s.attendance || {}),
            [dateKey]: status
          }
        };
      }
      return s;
    });
    
    await updateGroupInDB(parseInt(groupId), {
      ...currentGroup,
      students: updatedStudents
    });
    
    await refreshGroups();
    setSelectedGroup(groups.find(g => g.id == groupId));
  };

  // To'lovni yangilash
  const handleUpdatePayment = async (groupId, studentId, monthKey, status, paymentDate, amount) => {
    const currentGroup = groups.find(g => g.id == groupId);
    if (!currentGroup) return;
    
    const updatedStudents = currentGroup.students.map(s => {
      if (s.id == studentId) {
        return {
          ...s,
          payments: {
            ...(s.payments || {}),
            [monthKey]: status
          },
          paymentDates: {
            ...(s.paymentDates || {}),
            [monthKey]: paymentDate
          },
          paymentAmounts: {
            ...(s.paymentAmounts || {}),
            [monthKey]: amount
          }
        };
      }
      return s;
    });
    
    await updateGroupInDB(parseInt(groupId), {
      ...currentGroup,
      students: updatedStudents
    });
    
    await refreshGroups();
    setSelectedGroup(groups.find(g => g.id == groupId));
  };

  // Yuklanayotgan holat
  if (groupsLoading || studentsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">🐘</div>
          <p className="text-gray-600 text-lg">Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cloud status */}
        <div className="mb-6 bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2 rounded-lg text-sm text-center">
          🐘 Ma'lumotlar Supabase bulutida saqlanmoqda | Guruhlar: {groups?.length || 0} | O'quvchilar: {registeredStudents?.length || 0}
        </div>

        {/* GURUHLAR BO'LIMI */}
        {activeTab === "groups" && (
          <div>
            {!showAddGroupForm ? (
              <button
                onClick={() => setShowAddGroupForm(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 mb-6"
              >
                ➕ Yangi guruh yaratish
              </button>
            ) : (
              <AddGroupForm onAddGroup={handleAddGroup} onCancel={() => setShowAddGroupForm(false)} />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <GroupList 
                  groups={groups || []} 
                  selectedGroup={selectedGroup} 
                  onSelectGroup={setSelectedGroup} 
                  onDeleteGroup={handleDeleteGroup} 
                />
              </div>
              
              <div className="lg:col-span-2">
                <GroupDetails 
                  group={selectedGroup}
                  onAddStudent={() => setShowAddStudentModal(true)}
                  onRemoveStudent={handleRemoveStudentFromGroup}
                  onToggleActive={() => {}}
                  onUpdateAttendance={handleUpdateAttendance}
                  onUpdatePayment={handleUpdatePayment}
                />
              </div>
            </div>

            {showAddStudentModal && selectedGroup && (
              <AddStudentModal 
                group={selectedGroup} 
                registeredStudents={registeredStudents || []} 
                onAddStudent={handleAddStudentToGroup} 
                onClose={() => setShowAddStudentModal(false)} 
              />
            )}
          </div>
        )}
        
        {/* RO'YXATDAN O'TGAN O'QUVCHILAR BO'LIMI */}
        {activeTab === "registered" && (
          <div>
            <AddStudentForm onAddStudent={handleAddStudent} />
            <RegisteredStudentsList 
              students={registeredStudents || []} 
              onDeleteStudent={handleDeleteStudent} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;