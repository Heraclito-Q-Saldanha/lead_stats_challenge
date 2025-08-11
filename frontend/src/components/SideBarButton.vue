<script setup lang="ts">
    import Button from '@/volt/Button.vue';
    import { defineProps, computed } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

    const props = defineProps<{
        icon: string,
        path: string
    }>();

    const route = useRoute();
    const router = useRouter();
    const isActive = computed(() => route.path === props.path);
    
    function onClick(){
        router.push(props.path);
    }

</script>

<template>
    <Button v-on:click="onClick" :icon="props.icon" :variant="isActive ? 'outlined' : 'text'" class="w-full aspect-square" style="font-size: 1.5rem" />
</template>