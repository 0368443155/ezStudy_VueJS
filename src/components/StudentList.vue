<template>
  <div>
    <div class="toolbar">
      <h2>Danh sách Học sinh</h2>
      <button @click="$emit('add')">Thêm học sinh</button>
    </div>
    <div class="form-group" style="max-width: 300px;">
      <label>Lọc theo lớp:</label>
      <select v-model="selectedClass">
        <option :value="null">--- Tất cả các lớp ---</option>
        <option v-for="c in classes" :key="c.id" :value="c.id">
          {{ c.name }}
        </option>
      </select>
      <a v-if="selectedClass" @click="selectedClass = null" style="cursor:pointer; color: red; margin-left: 10px;">Xóa bộ lọc</a>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Họ và tên</th>
          <th>Tuổi</th>
          <th>Lớp</th>
          <th style="width: 150px;">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="paginatedStudents.length === 0">
          <td colspan="5" style="text-align: center;">Không có dữ liệu học sinh phù hợp.</td>
        </tr>
        <tr v-for="(student, index) in paginatedStudents" :key="student.id">
          <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
          <td>{{ student.name }}</td>
          <td>{{ tinhTuoi(student.dob) }}</td>
          <td>{{ getClassName(student.classId) }}</td>
          <td class="actions">
            <a @click="$emit('edit', student)">Sửa</a>
            <a @click="$emit('delete', student.id)">Xóa</a>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Thêm component Pagination -->
    <Pagination :currentPage="currentPage"
                :totalPages="totalPages"
                @page-changed="onPageChange" />
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import Pagination from './Pagination.vue';

  const props = defineProps({
    students: Array,
    classes: Array
  });

  defineEmits(['add', 'edit', 'delete']);

  const currentPage = ref(1);
  const itemsPerPage = ref(5); 

  const selectedClass = ref(null);

  const filteredStudents = computed(() => {
    if (!selectedClass.value) {
      return props.students;
    }
    return props.students.filter(s => s.classId === selectedClass.value);
  });

  const totalPages = computed(() => {
    return Math.ceil(filteredStudents.value.length / itemsPerPage.value);
  });

  const paginatedStudents = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredStudents.value.slice(start, end);
  });

  // --- Thêm hàm xử lý sự kiện từ Pagination component ---
  function onPageChange(page) {
    currentPage.value = page;
  }

  watch(selectedClass, () => {
    currentPage.value = 1;
  });
  watch(() => props.students, () => {
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value;
    }
  });


  function tinhTuoi(dob) {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  function getClassName(classId) {
    const lop = props.classes.find(c => c.id === classId);
    return lop ? lop.name : 'Chưa xếp lớp';
  }
</script>
