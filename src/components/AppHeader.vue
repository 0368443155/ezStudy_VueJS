<!-- src/components/AppHeader.vue -->
<template>
  <header class="app-header">
    <nav>
      <span>ezStudy</span>
      <a class="nav-link"
         :class="{ active: currentView === 'students' }"
         @click="$emit('changeView', 'students')">
        Học sinh
      </a>
      <a class="nav-link"
         :class="{ active: currentView === 'classes' }"
         @click="$emit('changeView', 'classes')">
        Lớp
      </a>
    </nav>
  </header>
</template>

<script setup>
  defineProps({
    currentView: String
  });

  defineEmits(['changeView']);
</script>

<style scoped>
  header {
    display: flex;
    align-items: center;
    border-bottom: 2px solid #eee;
    padding-bottom: 15px;
  }

  .logo {
    font-size: 24px;
    font-weight: bold;
    color: #555;
    background-color: #f0f0f0;
    padding: 5px 15px;
    border-radius: 5px;
    margin-right: 30px;
  }

  nav a {
    margin-right: 20px;
    text-decoration: none;
    color: #333;
    font-size: 18px;
    padding: 5px 10px;
  }

    nav a.active {
      color: #007bff;
      border-bottom: 2px solid #007bff;
    }
</style>
