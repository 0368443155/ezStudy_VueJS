<template>
  <div>
    <div class="toolbar">
      <h2>Danh sách Lớp học</h2>
      <button @click="$emit('add')">Tạo lớp</button>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 50px;">#</th>
          <th>Lớp</th>
          <th style="width: 150px;">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="paginatedClasses.length === 0">
          <td colspan="3" style="text-align: center;">Không có dữ liệu.</td>
        </tr>
        <tr v-for="(c, index) in paginatedClasses" :key="c.id">
          <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
          <td>{{ c.prefixedName }}</td>
          <td class="actions">
            <a @click="$emit('edit', c.original)">Sửa</a>
            <a @click="$emit('delete', c.id)">Xóa</a>
          </td>
        </tr>
      </tbody>
    </table>

    <Pagination :currentPage="currentPage"
                :totalPages="totalPages"
                @page-changed="onPageChange" />
  </div>
</template>

<script setup>
  import { computed, ref, watch } from 'vue';
  import Pagination from './Pagination.vue';

  const props = defineProps({
    classes: {
      type: Array,
      required: true
    }
  });

  defineEmits(['add', 'edit', 'delete']);

  const currentPage = ref(1);
  const itemsPerPage = ref(5); 

  const formattedClasses = computed(() => {
    const list = [];
    const classMap = {};
    props.classes.forEach(c => {
      classMap[c.id] = { ...c, children: [] };
    });

    const roots = [];
    props.classes.forEach(c => {
      if (c.parentId && classMap[c.parentId]) {
        classMap[c.parentId].children.push(classMap[c.id]);
      } else {
        roots.push(classMap[c.id]);
      }
    });

    function traverse(node, level) {
      list.push({
        id: node.id,
        prefixedName: '---'.repeat(level) + node.name,
        original: props.classes.find(c => c.id === node.id)
      });
      if (node.children) {
        node.children.sort((a, b) => a.name.localeCompare(b.name)).forEach(child => traverse(child, level + 1));
      }
    }

    roots.sort((a, b) => a.name.localeCompare(b.name)).forEach(root => traverse(root, 0));
    return list;
  });

  const totalPages = computed(() => {
    return Math.ceil(formattedClasses.value.length / itemsPerPage.value);
  });

  const paginatedClasses = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return formattedClasses.value.slice(start, end);
  });

  function onPageChange(page) {
    currentPage.value = page;
  }

  watch(() => props.classes, () => {
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value;
    }
  });
</script>
