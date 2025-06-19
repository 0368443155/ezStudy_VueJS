<!-- src/components/StudentManagement.vue -->
<template>
  <div>
    <StudentForm v-if="showForm"
                 :studentToEdit="editingStudent"
                 :classes="classes"
                 @save="handleSave"
                 @cancel="hideForm" />
    <StudentList v-else
                 :students="students"
                 :classes="classes"
                 @add="showAddForm"
                 @edit="showEditForm"
                 @delete="handleDelete" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import StudentList from './StudentList.vue';
import StudentForm from './StudentForm.vue';

defineProps({
  students: Array,
  classes: Array
});

const emit = defineEmits(['saveStudent', 'deleteStudent']);

const showForm = ref(false);
const editingStudent = ref(null);

const hideForm = () => {
  showForm.value = false;
  editingStudent.value = null;
};

const showAddForm = () => {
  editingStudent.value = null;
  showForm.value = true;
};

const showEditForm = (student) => {
  editingStudent.value = student;
  showForm.value = true;
};

const handleSave = (student) => {
  emit('saveStudent', student);
  hideForm();
};

const handleDelete = (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa học sinh này?')) {
        emit('deleteStudent', id);
    }
};
</script>
