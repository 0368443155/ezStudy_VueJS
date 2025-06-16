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
        <button class="btn-search">Tìm kiếm</button>
      </div>
      <button @click="$emit('add')">Thêm học sinh</button>
    </div>

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
        <tr v-for="(student, index) in students" :key="student.id">
          <td>{{ index + 1 }}</td>
          <td>{{ student.name }}</td>
          <td>{{ tinhTuoi(student.dob) }}</td>
          <td>{{ getClassName(student.classId) }}</td>
          <td>
            <a @click="$emit('edit', student)" class="action-link">Sửa</a>
            <a @click="$emit('delete', student.id)" class="action-link delete">Xóa</a>
          </td>
        </tr>
        <tr v-if="!students.length">
          <td colspan="5" style="text-align: center;">Không có dữ liệu học sinh.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
  const props = defineProps({
    students: { type: Array, required: true },
    classes: { type: Array, required: true },
    currentFilter: { type: [Number, String], default: null }
  });

  const emit = defineEmits(['add', 'edit', 'delete', 'filter-changed']);

  const onFilterChange = (event) => {
    const value = event.target.value;
    // 
    emit('filter-changed', value === 'null' ? null : Number(value));
  };

  const getClassName = (classId) => {
    const cls = props.classes.find(c => c.id === classId);
    return cls ? cls.name : 'Chưa có lớp';
  };

  const tinhTuoi = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
</script>

<style scoped>
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

    .filter-group .btn-search {
      margin-left: 10px;
      background-color: #6c757d;
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
