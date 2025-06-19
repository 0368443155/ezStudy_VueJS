<!-- src/components/ClassManagement.vue -->
<template>
  <div>
    <ClassForm v-if="showForm"
               :classToEdit="editingClass"
               :classes="classes"
               @save="handleSave"
               @cancel="hideForm" />
    <ClassList v-else
               :classes="classes"
               @add="showAddForm"
               @edit="showEditForm"
               @delete="handleDelete" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ClassList from './ClassList.vue';
import ClassForm from './ClassForm.vue';

defineProps({
  classes: Array
});

const emit = defineEmits(['saveClass', 'deleteClass']);

const showForm = ref(false);
const editingClass = ref(null);

const hideForm = () => {
  showForm.value = false;
  editingClass.value = null;
};

const showAddForm = () => {
  editingClass.value = null;
  showForm.value = true;
};

const showEditForm = (cls) => {
  editingClass.value = cls;
  showForm.value = true;
};

const handleSave = (cls) => {
  emit('saveClass', cls);
  hideForm();
};

const handleDelete = (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa lớp này? Thao tác này cũng sẽ xóa toàn bộ học sinh trong lớp.')) {
        emit('deleteClass', id);
    }
}
</script>
