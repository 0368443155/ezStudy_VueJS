const { createApp } = Vue;

        createApp({
            // 1. DATA: Lưu trữ toàn bộ trạng thái của ứng dụng
            data() {
                return {
                    danhSachHocSinh: [],
                    danhSachLopHoc: [],
                    currentView: 'list', // 'list' hoặc 'form'
                    formData: { // Dữ liệu cho form thêm/sửa
                        id: null,
                        name: '',
                        dob: '',
                        classId: null,
                    },
                    isEditMode: false,
                    filterClassId: null, // ID lớp đang được chọn để lọc
                }
            },

            // 2. COMPUTED: Dữ liệu được tính toán dựa trên data
            computed: {
                // Tự động lọc danh sách học sinh khi filterClassId thay đổi
                filterDanhSachHocSinh() {
                    if (!this.filterClassId) {
                        return this.danhSachHocSinh;
                    }
                    return this.danhSachHocSinh.filter(s => s.classId == this.filterClassId);
                },
                // Tự động thay đổi tiêu đề của form
                formTitle() {
                    return this.isEditMode ? 'SỬA HỌC SINH' : 'THÊM HỌC SINH';
                }
            },

            // 3. METHODS: Các hành động của người dùng
            methods: {
                // --- Quản lý LocalStorage ---
                saveDataToStorage() {
                    localStorage.setItem('ezstudy_danhSachHocSinh', JSON.stringify(this.danhSachHocSinh));
                    localStorage.setItem('ezstudy_danhSachLopHoc', JSON.stringify(this.danhSachLopHoc));
                },
                loadDataFromStorage() {
                    const danhSachHocSinhData = localStorage.getItem('ezstudy_danhSachHocSinh');
                    const danhSachLopHocData = localStorage.getItem('ezstudy_danhSachLopHoc');

                    if (danhSachHocSinhData) {
                        this.danhSachHocSinh = JSON.parse(danhSachHocSinhData);
                    }
                    if (danhSachLopHocData) {
                        this.danhSachLopHoc = JSON.parse(danhSachLopHocData);
                    }
                },
                initData() {
                    this.loadDataFromStorage();
                    // Nếu chưa có dữ liệu, tạo dữ liệu mẫu
                    if (this.danhSachLopHoc.length === 0) {
                        this.danhSachLopHoc = [
                            { id: 11, name: 'Lớp 11B' },
                            { id: 12, name: 'Lớp 12A' },
                        ];
                    }
                    if (this.danhSachHocSinh.length === 0) {
                        this.danhSachHocSinh = [
                            { id: 1, name: 'Đỗ An', dob: '2009-05-10', classId: 11 },
                            { id: 2, name: 'Nguyễn Ngọc', dob: '2008-11-20', classId: 12 },
                        ];
                    }
                    this.saveDataToStorage();
                },

                // --- Điều hướng giao diện ---
                showListView() {
                    this.currentView = 'list';
                    this.resetForm();
                },
                showAddForm() {
                    this.isEditMode = false;
                    this.resetForm();
                    this.currentView = 'form';
                },
                showEditForm(student) {
                    this.isEditMode = true;
                    // Copy dữ liệu của student vào formData để tránh sửa trực tiếp
                    this.formData = { ...student }; 
                    this.currentView = 'form';
                },

                // --- Logic Nghiệp vụ (CRUD) ---
                handleSave() {
                    if (!this.formData.name || !this.formData.dob || !this.formData.classId) {
                        alert('Vui lòng điền đầy đủ các trường bắt buộc.');
                        return;
                    }

                    if (this.isEditMode) {
                        // Sửa học sinh
                        const index = this.danhSachHocSinh.findIndex(s => s.id === this.formData.id);
                        if (index !== -1) {
                            this.danhSachHocSinh[index] = this.formData;
                        }
                    } else {
                        // Thêm học sinh mới
                        this.formData.id = Date.now(); // Tạo ID duy nhất bằng timestamp
                        this.danhSachHocSinh.push(this.formData);
                    }
                    
                    this.saveDataToStorage();
                    this.showListView();
                },
                handleDelete(studentId) {
                    if (confirm('Bạn có chắc chắn muốn xóa học sinh này?')) {
                        this.danhSachHocSinh = this.danhSachHocSinh.filter(s => s.id !== studentId);
                        this.saveDataToStorage();
                    }
                },

                //các hàm phụ 
                //reset form sau mỗi lần nhập hoặc sửa
                resetForm() {
                    this.formData = { id: null, name: '', dob: '', classId: null };
                },

                //lấy tên lớp từ danh sách
                getClassName(classId) {
                    const cls = this.danhSachLopHoc.find(c => c.id === classId);
                    return cls ? cls.name : 'Chưa có lớp';
                },

                //tính tuổi dựa theo năm sinh
                tinhTuoi(dob) {
                    if (!dob) return 'N/A';
                    const ngaySinh = new Date(dob);
                    const hienTai = new Date();
                    let age = hienTai.getFullYear() - ngaySinh.getFullYear();
                    const m = hienTai.getMonth() - ngaySinh.getMonth();
                    if (m < 0 || (m === 0 && hienTai.getDate() < ngaySinh.getDate())) {
                        age--;
                    }
                    return age;
                }
            },

            //khởi tạo data khi chạy ứng dụng
            mounted() {
                this.initData();
            }
        }).mount('#app');