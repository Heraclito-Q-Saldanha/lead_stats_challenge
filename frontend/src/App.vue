<script setup lang="ts">
    import { RouterView } from 'vue-router';
    import Toast from './volt/Toast.vue';
    import SideBar from '@/components/SideBar.vue';
    import ConfirmDialog from '@/volt/ConfirmDialog.vue';
</script>

<template>
  <Toast />
  <ConfirmDialog />
  <main>
    <div class="flex flex-row w-screen h-screen dark:bg-zinc-900 dark:text-white">
      <SideBar />
      <RouterView />
    </div>
  </main>
</template>
