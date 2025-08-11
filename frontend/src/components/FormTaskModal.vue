<script setup lang="ts">
    import InputText from "@/volt/InputText.vue";
    import Button from "@/volt/Button.vue";
    import DatePicker from "@/volt/DatePicker.vue";
    import Select from '@/volt/Select.vue';
    import Textarea from '@/volt/Textarea.vue';
    import InputNumber from "@/volt/InputNumber.vue";
    import AutoComplete from '@/volt/AutoComplete.vue';
    import { computed, defineProps, onMounted, ref, watch } from 'vue';
    import { createTaskRequest, editTaskRequest, getTaskRequest, type CreateTaskData } from "@/api/tasks";
    import { useToast } from 'primevue/usetoast';

    const toast = useToast();

    const { id, onClose } = defineProps<{
        id?: string;
        onClose: () => void;
    }>();

    const priorities = [
        { display: 'Low', value: 'LOW' },
        { display: 'Medium', value: 'MEDIUM' },
        { display: 'High', value: 'HIGH' }
    ];

    const status = [
        { display: 'To Do', value: 'TODO' },
        { display: 'In Progress', value: 'IN_PROGRESS' },
        { display: 'Done', value: 'DONE' }
    ];

    const isEditing = computed(() => id != undefined);

    const task = ref<CreateTaskData>({
        title: "",
        description: "",
        priority: "LOW",
        status: "TODO",
        assignedTo: "",
        tags: [],
        dueDate: undefined,
        estimatedHours: 0,
    });

    async function submit() {
        try {
            if(isEditing.value) {
                await editTaskRequest(id!, task.value);
                toast.add({ summary: "Task edited", life: 3000, severity: "success" });
            } else {
                await createTaskRequest(task.value);
                toast.add({ summary: "Task created", life: 3000, severity: "success" });
            }
            onClose();
        } catch(err) {
            toast.add({ summary: "Error", severity: "error" });
            console.error(err);
        }
    }
    
    onMounted(async () => {
        if(isEditing.value) {
            task.value = await getTaskRequest(id!);
        }
    });
</script>
<template>
    <div class="fixed top-0 left-0 z-10 flex w-screen h-screen items-center justify-center bg-current/20">
        <div class="flex flex-col w-full h-full md:w-96 md:h-min bg-slate-100 rounded-lg p-6 gap-4 dark:bg-zinc-950">
            <div class="flex flex-row w-full justify-between">
                <h1 class="font-semibold">{{ isEditing ? "Edit Task" : "Create New Task" }}</h1>
                <Button icon="pi pi-times" variant="text" :onclick="onClose" />
            </div>
            <form class="flex flex-col w-full" @submit.prevent="submit">
                <div class="flex flex-col w-full">
                    <label>Title</label>
                    <InputText v-model="task.title" placeholder="Task title" />
                </div>
                <div class="flex flex-col w-full">
                    <label>Description</label>
                    <Textarea v-model="task.description" placeholder="Task description" />
                </div>
                <div class="flex flex-col w-full">
                    <label>Due Date</label>
                    <DatePicker v-model="task.dueDate" showIcon iconDisplay="input" />
                </div>    
                <div class="flex flex-col w-full">
                    <label>Estimated Hours</label>
                    <InputNumber v-model="task.estimatedHours" />
                </div>
                <div class="flex flex-col w-full">
                    <label>Priority</label>
                    <Select v-model="task.priority" :options="priorities" optionValue="value" optionLabel="display"></Select>
                </div>
                <div class="flex flex-col w-full">
                    <label>Status</label>
                    <Select v-model="task.status" :options="status" optionValue="value" optionLabel="display"></Select>
                </div>
                <div class="flex flex-col w-full">
                    <label>Assigned To</label>
                    <InputText v-model="task.assignedTo" placeholder="Signature"></InputText>
                </div>
                <div class="flex flex-col w-full">
                    <label>Tags</label>
                    <AutoComplete v-model="task.tags" multiple fluid :typeahead="false" />
                </div>
                <div class="flex flex-col w-full mt-2">
                    <Button label="Save" type="submit" />
                </div>
            </form>
        </div>
    </div>
</template>