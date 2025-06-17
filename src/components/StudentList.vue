<template>
  <div>
    <div class="actions-bar">
      <div class="filter-group">
        <select :value="currentFilter" @change="onFilterChange">
          <option :value="null">--- Lớp ---</option>
          <option v-for="c in classes" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
        <input type="text"
               v-model="searchName"
               placeholder="Tìm theo tên..."
               class="search-input" />
        <input type="number"
               v-model.number="searchAge"
               placeholder="Tìm theo tuổi..."
               class="search-input" />
        <button @click="clearFilters" class="btn-clear">Xóa bộ lọc</button>
      </div>
      <button @click="$emit('add')">Thêm học sinh</button>
    </div>

    <!-- Bảng dữ liệu -->
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Họ và tên</th>
          <th>Tuổi</th>
          <th>Lớp</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <!--lặp qua danh sách học sinh trong từng phân trang-->
        <tr v-for="(student, index) in paginatedStudents" :key="student.id">
          <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
          <td>{{ student.name }}</td>
          <td>{{ tinhTuoi(student.dob) }}</td>
          <td>{{ getClassName(student.classId) }}</td>
          <td>
            <a @click="$emit('edit', student)" class="action-link">Sửa</a>
            <a @click="$emit('delete', student.id)" class="action-link delete">Xóa</a>
          </td>
        </tr>
        <!-- THAY ĐỔI: Điều kiện kiểm tra `filteredStudents` vì có thể có kết quả nhưng không hiển thị trên trang hiện tại -->
        <tr v-if="!filteredStudents.length">
          <td colspan="5" style="text-align: center;">Không có dữ liệu học sinh phù hợp.</td>
        </tr>
      </tbody>
    </table>

    <!-- MỚI: Thêm thanh điều khiển phân trang -->
    <div v-if="totalPages > 1" class="pagination-controls">
      <button @click="prevPage" :disabled="currentPage === 1">
        « Trước
      </button>
      <span class="page-info">Trang {{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        Sau »
      </button>
    </div>

  </div>
</template>

<script setup>
// theo dõi thay đổi của bộ lọc
import { ref, computed, watch } from 'vue';

const props = defineProps({
  students: { type: Array, required: true },
  classes: { type: Array, required: true },
  currentFilter: { type: [Number, String], default: null }
});

const emit = defineEmits(['add', 'edit', 'delete', 'filter-changed']);

// trạng thái cho tìm kiếm theo tên và tuổi
const searchName = ref('');
const searchAge = ref(null);

// đặt trạng thái cho các phân trang
const currentPage = ref(1);
const itemsPerPage = ref(5); 

// danh sách học sinh sau khi lọc/tìm kiếm
const filteredStudents = computed(() => {
  let studentsToFilter = props.students;

  if (props.currentFilter) {
    studentsToFilter = studentsToFilter.filter(s => s.classId === props.currentFilter);
  }
  if (searchName.value) {
    studentsToFilter = studentsToFilter.filter(s =>
      s.name.toLowerCase().includes(searchName.value.toLowerCase())
    );
  }
  if (searchAge.value !== null && searchAge.value > 0) {
    studentsToFilter = studentsToFilter.filter(s =>
      tinhTuoi(s.dob) === searchAge.value
    );
  }
  return studentsToFilter;
});

// tính tổng số trang
const totalPages = computed(() => {
  return Math.ceil(filteredStudents.value.length / itemsPerPage.value);
});

// lấy danh sách học sinh cho trang hiện tại
const paginatedStudents = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredStudents.value.slice(startIndex, endIndex);
});

// mỗi khi bộ lọc thay đổi thì reset về trang 1
watch(filteredStudents, () => {
    currentPage.value = 1;
});

// khi filter thay đổi
const onFilterChange = (event) => {
  const value = event.target.value;
  emit('filter-changed', value === 'null' ? null : Number(value));
};

//khi clear
const clearFilters = () => {
  searchName.value = '';
  searchAge.value = null;
  emit('filter-changed', null);
};

// hàm cho nút trang tiếp theo
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
//trang trước
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

//hàm lấy tên lớp theo id
const getClassName = (classId) => {
  const cls = props.classes.find(c => c.id === classId);
  return cls ? cls.name : 'Chưa có lớp';
};

//hàm tính tuổi
  const tinhTuoi = (dob) => {
  if (!dob) return 'N/A';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
  //kiểm tra xem ngày sinh với ngày hiện tại
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
</script>

<style scoped>
  .pagination-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }

    .pagination-controls button {
      margin: 0 10px;
      padding: 8px 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

      .pagination-controls button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }

  .page-info {
    font-weight: bold;
  }
  .search-input {
    margin-left: 10px;
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  .btn-clear {
    margin-left: 10px;
    background-color: #6c757d;
  }

  .actions-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .filter-group {
    display: flex;
    align-items: center;
  }

    .filter-group select {
      padding: 8px 12px;
      border-radius: 4px;
      border: 1px solid #ccc;
      min-width: 200px;
    }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
    vertical-align: middle;
  }

  th {
    background-color: #f8f9fa;
    font-weight: bold;
  }

  .action-link {
    margin-right: 10px;
    color: #007bff;
    cursor: pointer;
    text-decoration: underline;
  }

    .action-link.delete {
      color: #dc3545;
    }
</style>
