<script setup>
  import { ref, computed, onMounted } from 'vue';
  import AppHeader from './components/AppHeader.vue';
  import StudentList from './components/StudentList.vue';
  import StudentForm from './components/StudentForm.vue';

  // trạng thái của ứng dụng
  const danhSachHocSinh = ref([]);
  const danhSachLopHoc = ref([]);
  const currentView = ref('list'); // 'list' hoặc 'form'
  const filterClassId = ref(null);
  const isEditMode = ref(false);
  const formData = ref({
    id: null,
    name: '',
    dob: '',
    classId: null,
  });

  //
  const filteredStudents = computed(() => {
    if (!filterClassId.value) {
      return danhSachHocSinh.value;
    }
    return danhSachHocSinh.value.filter(s => s.classId == filterClassId.value);
  });

  // các methods, 

  // localstorage
  const saveDataToStorage = () => {
    localStorage.setItem('ezstudy_danhSachHocSinh', JSON.stringify(danhSachHocSinh.value));
    localStorage.setItem('ezstudy_danhSachLopHoc', JSON.stringify(danhSachLopHoc.value));
  };

  const loadDataFromStorage = () => {
    const hocSinhData = localStorage.getItem('ezstudy_danhSachHocSinh');
    const lopHocData = localStorage.getItem('ezstudy_danhSachLopHoc');
    if (hocSinhData) danhSachHocSinh.value = JSON.parse(hocSinhData);
    if (lopHocData) danhSachLopHoc.value = JSON.parse(lopHocData);
  };

  // khởi tạo dữ liệu mẫu
  const initData = () => {
    loadDataFromStorage();
    if (danhSachLopHoc.value.length === 0) {
      danhSachLopHoc.value = [
        { id: 11, name: 'Lớp 11B' },
        { id: 12, name: 'Lớp 12A' },
      ];
    }
    if (danhSachHocSinh.value.length === 0) {
      danhSachHocSinh.value = [
        { id: 1, name: 'Đỗ An', dob: '2009-05-10', classId: 11 },
        { id: 2, name: 'Nguyễn Ngọc', dob: '2008-11-20', classId: 12 },
      ];
    }
    saveDataToStorage();
  };

  // routing
  const resetForm = () => {
    formData.value = { id: null, name: '', dob: '', classId: null };
  };

  const showListView = () => {
    currentView.value = 'list';
  };

  const showAddForm = () => {
    isEditMode.value = false;
    resetForm();
    currentView.value = 'form';
  };

  const showEditForm = (student) => {
    isEditMode.value = true;
    formData.value = { ...student };
    currentView.value = 'form';
  };

  // xử lý lưu hoặc sửa
  const handleSave = (studentData) => {
    if (isEditMode.value) {
      const index = danhSachHocSinh.value.findIndex(s => s.id === studentData.id);
      if (index !== -1) {
        danhSachHocSinh.value[index] = studentData;
      }
    } else {
      danhSachHocSinh.value.push({ ...studentData, id: Date.now() });
    }
    saveDataToStorage();
    showListView();
  };

  const handleDelete = (studentId) => {
    if (confirm('Bạn có chắc chắn muốn xóa học sinh này?')) {
      danhSachHocSinh.value = danhSachHocSinh.value.filter(s => s.id !== studentId);
      saveDataToStorage();
    }
  };

  // xử lý sự kiện thay đổi tìm kiếm bằng lớp
  const handleFilterChange = (classId) => {
    filterClassId.value = classId;
  };

  // tạo data mẫu khi chạy chương trình
  onMounted(() => {
    initData();
  });
</script>

<template>
  <div id="app-container">
    <AppHeader />

    <main>
      <StudentList v-if="currentView === 'list'"
                   :students="filteredStudents"
                   :classes="danhSachLopHoc"
                   :current-filter="filterClassId"
                   @add="showAddForm"
                   @edit="showEditForm"
                   @delete="handleDelete"
                   @filter-changed="handleFilterChange" />

      <StudentForm v-else-if="currentView === 'form'"
                   :initial-form-data="formData"
                   :is-edit-mode="isEditMode"
                   :classes="danhSachLopHoc"
                   @save="handleSave"
                   @cancel="showListView" />
    </main>
  </div>
</template>

<style>
  /*style chính */
  #app-container {
    max-width: 1000px;
    margin: 0 auto;
    background-color: #fff;
    padding: 20px 30px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  main {
    margin-top: 25px;
  }
</style>
