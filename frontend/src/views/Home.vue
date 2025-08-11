<script setup lang="ts">
    import Button from '@/volt/Button.vue';
    import FormTaskModal from '@/components/FormTaskModal.vue';
    import DataTable from '@/volt/DataTable.vue';
    import Column from 'primevue/column';
    import { useQuery } from 'vue-query';
    import { computed, ref, watch } from 'vue';
    import { deleteTaskRequest, getTasksRequest } from '@/api/tasks';
    import Paginator from '@/volt/Paginator.vue';
    import Loading from '@/components/Loading.vue';
    import DangerButton from '@/volt/DangerButton.vue';
    import { useConfirm } from "primevue/useconfirm";
    import { useToast } from 'primevue/usetoast';
    import { formatDateUS, formatDateTimeUS} from "../utils.ts";

    const { data, isLoading, isError, refetch } = useQuery('tasks', fetchData);
    const confirm = useConfirm();
    const toast = useToast();

    const formTask = ref(false);
    const editId = ref<string | undefined>();
    const skip = ref(0);
    const limit = 12;
    const totalRecords = computed(() => (data.value && data.value.length == limit) ? (skip.value + limit + 1) : skip.value + limit);

    async function fetchData() {
        return await getTasksRequest(skip.value, limit);
    }

    function closeTaskModal(){
        formTask.value = false;
        editId.value = undefined;
        refetch.value();
    }
    
    async function deleteTask(id: string) {
        confirm.require({
            message: 'Are you sure you want to delete the task?',
            header: 'Confirmation',
            rejectProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptProps: {
                label: 'Confirm'
            },
            accept: async () => {
                await deleteTaskRequest(id);
                toast.add({ summary: "Task deleted", life: 3000, severity: "success" });
                refetch.value();
            }
        });
    }

    function editTaskModal(id: string){
        formTask.value = true;
        editId.value = id;
    }

    watch(totalRecords, () => {
        refetch.value();
    });
    
</script>

<template>
    <FormTaskModal v-if="formTask" :onClose="closeTaskModal" :id="editId" />
    <div class="flex flex-col w-full h-full p-8">
        <div v-if="isError" class="flex flex-col items-center justify-center w-full h-full">
            <p>Error loading data</p>
            <Button v-on:click="refetch">try again</Button>
        </div>
        <template v-else>
            <div v-if="isLoading" class="flex items-center justify-center w-full h-full">
                <Loading class="flex w-64 h-64" />
            </div>
            <div v-else class="flex flex-col w-full h-full rounded-2xl gap-4">
                <div class="flex flex-row w-full justify-end">
                    <div class="absolute left-1/2 transform -translate-x-1/2">
                        <h1 class="font-semibold">Task Management</h1>
                    </div>
                    <Button icon="pi pi-plus" v-on:click="formTask = !formTask" label="Add Task" variant="text" :pt="{root: 'flex gap-1 items-center hover:cursor-pointer',label: 'dark:text-white text-black'}"></Button>
                </div>
                <DataTable :value="data" pt:table="min-w-200" class="h-full overflow-auto">
                    <Column field="title" header="Title"></Column>
                    <Column field="description" header="Description"></Column>
                    <Column field="priority" header="Priority"></Column>
                    <Column field="status" header="Status"></Column>
                    <Column field="assignedTo" header="Assigned To"></Column>
                    <Column field="dueDate" header="Due Date">
                        <template #body="slotProps">
                            {{ slotProps.data.dueDate ? formatDateUS(slotProps.data.dueDate) : "" }}
                        </template>
                    </Column>
                    <Column field="createdAt" header="Created At">
                        <template #body="slotProps">
                            {{ formatDateTimeUS(slotProps.data.createdAt) }}
                        </template>
                    </Column>
                    <Column header="Actions" style="width: 150px;">
                        <template #body="slotProps">
                            <div class="flex gap-1">
                                <Button 
                                    icon="pi pi-pencil"
                                    class="p-button-rounded p-button-text p-button-info" 
                                    aria-label="Edit"
                                    v-on:click="editTaskModal(slotProps.data.id)"
                                />
                                <DangerButton 
                                    icon="pi pi-trash"
                                    class="p-button-rounded p-button-text p-button-danger" 
                                    aria-label="Delete"
                                    v-on:click="deleteTask(slotProps.data.id)"
                                />
                            </div>
                        </template>
                    </Column>
                </DataTable>
                <Paginator v-model:first="skip" :rows="limit" :totalRecords="totalRecords" />
            </div>
        </template>
    </div>
</template>

