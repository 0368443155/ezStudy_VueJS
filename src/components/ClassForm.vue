<!-- src/components/ClassForm.vue -->
<template>
  <div class="form-container">
    <h2>{{ formTitle }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Tên lớp*</label>
        <input type="text" id="name" v-model="form.name" required />
      </div>
      <div class="form-group">
        <label for="parent">Thuộc</label>
        <select id="parent" v-model="form.parentId">
          <option :value="null">--- Là khối lớp (không có lớp cha) ---</option>
          <option v-for="c in parentClasses" :key="c.id" :value="c.id">
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
  classToEdit: Object,
  classes: Array
});

const emit = defineEmits(['save', 'cancel']);

const form = ref({
  id: null,
  name: '',
  parentId: null
});

// Lọc ra các lớp có thể làm cha (các khối lớp)
const parentClasses = computed(() => {
  return props.classes.filter(c => c.parentId === null && c.id !== form.value.id);
});

const formTitle = computed(() => {
  return form.value.id ? 'CHỈNH SỬA LỚP' : 'THÊM LỚP';
});

// Theo dõi prop classToEdit, nếu có thì điền dữ liệu vào form
watchEffect(() => {
  if (props.classToEdit) {
    form.value = { ...props.classToEdit };
  } else {
    // Reset form
    form.value = { id: null, name: '', parentId: null };
  }
});

function handleSubmit() {
  emit('save', { ...form.value });
}
</script>
