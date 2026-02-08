<template>
  <el-menu
    :default-active="activeMenu"
    class="sidebar-menu"
    router
  >
    <template v-for="item in menuItems" :key="item.path">
      <el-menu-item :index="item.path">
        <el-icon>
          <component :is="item.icon" />
        </el-icon>
        <span>{{ item.title }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  menuItems: {
    type: Array,
    required: true
  }
})

const route = useRoute()

const activeMenu = computed(() => {
  const matched = route.matched
  if (matched.length > 0) {
    return matched[matched.length - 1].path
  }
  return route.path
})
</script>

<style scoped>
.sidebar-menu {
  border-right: none;
  height: 100%;
}

.el-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
