<template>
  <div class="form-container">
    <h2>{{ formTitle }}</h2>
    <form @submit.prevent="onSave">
      <div class="form-group">
        <label for="name">Họ và tên *</label>
        <input type="text" id="name" v-model="localFormData.name" required>
      </div>
      <div class="form-group">
        <label for="dob">Ngày sinh</label>
        <input type="date" id="dob" v-model="localFormData.dob" required>
      </div>
      <div class="form-group">
        <label for="class">Lớp *</label>
        <select id="class" v-model="localFormData.classId" required>
          <option :value="null" disabled>--- Chọn lớp ---</option>
          <option v-for="c in classes" :key="c.id" :value="c.id">
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
  import { ref, computed, watch } from 'vue';

  const props = defineProps({
    initialFormData: { type: Object, required: true },
    isEditMode: { type: Boolean, default: false },
    classes: { type: Array, required: true }
  });

  const emit = defineEmits(['save', 'cancel']);

  //tạo bản sao để chỉnh sửa
  const localFormData = ref({ ...props.initialFormData });

  // theo dõi để cập nhật
  watch(() => props.initialFormData, (newData) => {
    localFormData.value = { ...newData };
  }, { deep: true });

  const formTitle = computed(() => props.isEditMode ? 'SỬA HỌC SINH' : 'THÊM HỌC SINH');

  const onSave = () => {
    if (!localFormData.value.name || !localFormData.value.dob || !localFormData.value.classId) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }
    emit('save', localFormData.value);
  };
</script>

<style scoped>
  .form-container h2 {
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    margin-top: 0;
  }

  .form-group {
    margin-bottom: 15px;
  }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

  .form-actions {
    margin-top: 25px;
  }

    .form-actions button:first-child {
      margin-right: 10px;
    }
</style>
