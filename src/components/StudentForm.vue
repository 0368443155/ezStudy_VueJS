<!-- src/components/StudentForm.vue -->
<template>
  <div class="form-container">
    <h2>{{ formTitle }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Họ và tên *</label>
        <input id="name" type="text" v-model="form.name" required />
      </div>
      <div class="form-group">
        <label for="dob">Ngày sinh</label>
        <input id="dob" type="date" v-model="form.dob" />
      </div>
      <div class="form-group">
        <label for="class">Lớp *</label>
        <select id="class" v-model="form.classId" required>
          <option :value="null" disabled>--- Chọn lớp ---</option>
          <option v-for="c in availableClasses" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
      </div>
      <div class="form-actions">
        <button type="submit">Lưu</button>
        <button type="button" class="btn-secondary" @click="$emit('cancel')">Hủy</button>
      </div>
    </form>
  </div>
</template>

<script setup>
  import { ref, computed, watchEffect } from 'vue';

  const props = defineProps({
    studentToEdit: Object,
    classes: Array
  });

  const emit = defineEmits(['save', 'cancel']);

  const form = ref({
    id: null,
    name: '',
    dob: '',
    classId: null
  });

  // Chỉ cho phép chọn các lớp con, không phải khối
  const availableClasses = computed(() => {
    return props.classes.filter(c => c.parentId !== null);
  });

  const formTitle = computed(() => {
    return form.value.id ? 'CHỈNH SỬA HỌC SINH' : 'THÊM HỌC SINH';
  });

  // Theo dõi prop studentToEdit, nếu có thì điền dữ liệu vào form
  watchEffect(() => {
    if (props.studentToEdit) {
      form.value = { ...props.studentToEdit };
    } else {
      // Reset form
      form.value = { id: null, name: '', dob: '', classId: null };
    }
  });

  function handleSubmit() {
    emit('save', { ...form.value });
  }
</script>
