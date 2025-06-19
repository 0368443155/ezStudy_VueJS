<template>
  <div class="container">
    <AppHeader :currentView="currentView" @change-view="changeView" />
    <main style="margin-top: 20px;">
      <StudentManagement v-if="currentView === 'students'"
                         :students="students"
                         :classes="classes"
                         @save-student="handleSaveStudent"
                         @delete-student="handleDeleteStudent" />
      <ClassManagement v-if="currentView === 'classes'"
                       :classes="classes"
                       @save-class="handleSaveClass"
                       @delete-class="handleDeleteClass" />
    </main>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import AppHeader from './components/AppHeader.vue';
  import StudentManagement from './components/StudentManagement.vue';
  import ClassManagement from './components/ClassManagement.vue';

  const classes = ref([
    { id: 1, name: 'Khối 10', parentId: null },
    { id: 2, name: 'Lớp 10A1', parentId: 1 },
    { id: 3, name: 'Lớp 10A2', parentId: 1 },
    { id: 4, name: 'Khối 11', parentId: null },
    { id: 5, name: 'Lớp 11B1', parentId: 4 },
    { id: 6, name: 'Lớp 11B2', parentId: 4 },
    { id: 7, name: 'Khối 12', parentId: null },
    { id: 8, name: 'Lớp 12C1', parentId: 7 },
  ]);

  const students = ref([
    { id: 101, name: 'Nguyễn Văn A', dob: '2008-05-10', classId: 2 },
    { id: 102, name: 'Trần Thị B', dob: '2008-09-15', classId: 2 },
    { id: 103, name: 'Lê Văn C', dob: '2007-01-20', classId: 5 },
    { id: 104, name: 'Phạm Thị D', dob: '2006-03-30', classId: 8 },
  ]);

  const currentView = ref('students'); 

  function changeView(view) {
    currentView.value = view;
  }

  function handleSaveClass(classData) {
    if (classData.id) {
      const index = classes.value.findIndex(c => c.id === classData.id);
      if (index !== -1) {
        classes.value[index] = classData;
      }
    } else { 
      const newId = Math.max(0, ...classes.value.map(c => c.id)) + 1;
      classes.value.push({ ...classData, id: newId });
    }
  }

  function handleDeleteClass(classId) {
    const childrenIds = classes.value.filter(c => c.parentId === classId).map(c => c.id);
    const idsToDelete = [classId, ...childrenIds];

    classes.value = classes.value.filter(c => !idsToDelete.includes(c.id));

    students.value = students.value.filter(s => !idsToDelete.includes(s.classId));
  }


  function handleSaveStudent(studentData) {
    if (studentData.id) { 
      const index = students.value.findIndex(s => s.id === studentData.id);
      if (index !== -1) {
        students.value[index] = studentData;
      }
    } else { 
      const newId = Math.max(100, ...students.value.map(s => s.id)) + 1;
      students.value.push({ ...studentData, id: newId });
    }
  }

  function handleDeleteStudent(studentId) {
    students.value = students.value.filter(s => s.id !== studentId);
  }
</script>
