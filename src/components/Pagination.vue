<template>
  <div class="pagination-container" v-if="totalPages > 1">
    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
      « Trước
    </button>
    <span>Trang {{ currentPage }} / {{ totalPages }}</span>
    <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
      Sau »
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['page-changed']);

function changePage(page) {
  if (page > 0 && page <= props.totalPages) {
    emit('page-changed', page);
  }
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
}

.pagination-container button {
  margin: 0 5px;
}

.pagination-container span {
  margin: 0 10px;
  font-size: 14px;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
