<script setup lang="ts">
    import Button from '@/volt/Button.vue';
    import Divider from 'primevue/divider';
    import SideBarButton from './SideBarButton.vue';
    import ToggleSwitch from '@/volt/ToggleSwitch.vue';
    import { ref, watch } from 'vue';

    let isDark = ref(true);

    function user(){
        alert("TODO");
    }

    function logOut(){
        alert("TODO");
    }

    watch(isDark, (value) => {
        if(value){
            document.documentElement.classList.add("dark");
        }else{
            document.documentElement.classList.remove("dark");
        }
    });
</script>

<template>
    <div class="flex items-center flex-col w-18 h-full p-3 gap-4 bg-slate-100 dark:bg-zinc-950">
        <div class="flex w-full items-center flex-col">
            <Button :onclick="user" icon="pi pi-user" class="w-full aspect-square" style="font-size: 1.5rem" />
        </div>
        <Divider type="solid" />
        <div class="flex w-full h-full gap-2 items-center flex-col">
            <SideBarButton icon="pi pi-home" path="/" />
            <SideBarButton icon="pi pi-chart-pie" path="/statistics" />
        </div>
        <Divider type="solid" />
        <div class="flex flex-col w-full items-center">
            <ToggleSwitch v-model="isDark" />
            <a href="https://github.com/Heraclito-Q-Saldanha/challenge" target="_blank" class="text-center pi pi-github w-full text-primary aspect-square mt-2" style="font-size: 2.25rem"></a>
            <Button :onclick="logOut" icon="pi pi-sign-out" variant="text" class="w-full aspect-square" style="font-size: 1.5rem" />
        </div>
    </div>
</template>