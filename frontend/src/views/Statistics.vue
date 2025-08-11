<script setup lang="ts">
    import { countTasksRequest, getTaskStatisticsRequest } from '@/api/tasks';
    import { Chart } from 'chart.js';
    import { ref, watch } from 'vue';
    import { useQuery } from 'vue-query';
    import Loading from '@/components/Loading.vue';
    import DatePicker from '@/volt/DatePicker.vue';
    import Select from '@/volt/Select.vue';
    import Button from '@/volt/Button.vue';

    const priorities = [
        { display: "Low", value: "LOW" },
        { display: "Medium", value: "MEDIUM" },
        { display: "High", value: "HIGH" }
    ];

    const { data, isLoading, isError, refetch } = useQuery('count', getData);

    const chart = ref<HTMLCanvasElement>();
    let chartInstance: Chart;

    const selectedPriorities = ref(null);
    const selectedDate = ref(null);

    async function getData() {
        const startDate = selectedDate?.value?.[0];
        const endDate = selectedDate?.value?.[1];

        const statistics = await getTaskStatisticsRequest(startDate, endDate, selectedPriorities.value ?? undefined);
        const count = await countTasksRequest(startDate, endDate, selectedPriorities.value ?? undefined);
    
        return { count, statistics };
    }

    function clearFilters(){
        selectedPriorities.value = null;
        selectedDate.value = null;
    }

    watch([selectedPriorities, selectedDate], () => {
        refetch.value();
    });

    watch(data, () => {
        if(!chartInstance)
            return;

        const labels = data?.value.statistics?.map((s:any) => s.DAY) ?? [];
        const low = data?.value.statistics?.map((s:any) => s.LOW) ?? [];
        const medium = data?.value.statistics?.map((s:any) => s.MEDIUM) ?? [];
        const high = data?.value.statistics?.map((s:any) => s.HIGH) ?? [];

        chartInstance.data.labels = labels;
        chartInstance.data.datasets = [
            {
                label: 'High Urgency',
                data: high,
                borderColor: 'red',
                fill: false
            },
            {
                label: 'Medium Urgency',
                data: medium,
                borderColor: 'orange',
                fill: false
            },
            {
                label: 'Low Urgency',
                data: low,
                borderColor: 'green',
                fill: false
            }
        ];
        
        chartInstance.update();
    });

    watch(chart, () => {
        if(!chart.value)
            return;

        const labels = data?.value.statistics?.map((s: any) => s.DAY) ?? [];
        const low = data?.value.statistics?.map((s:any) => s.LOW) ?? [];
        const medium = data?.value.statistics?.map((s:any) => s.MEDIUM) ?? [];
        const high = data?.value.statistics?.map((s:any) => s.HIGH) ?? [];

        chartInstance = new Chart(chart.value!, {
            type: 'line',
            options: {
                responsive: true,
                maintainAspectRatio: false,
            },
            data: {
                labels,
                datasets: [
                    {
                        label: 'High Urgency',
                        data: high,
                        borderColor: 'red',
                        fill: false
                    },
                    {
                        label: 'Medium Urgency',
                        data: medium,
                        borderColor: 'orange',
                        fill: false
                    },
                    {
                        label: 'Low Urgency',
                        data: low,
                        borderColor: 'green',
                        fill: false
                    }
                ]
            },
        });
    })
</script>
<template>
    <div class="flex items-center min-w-0 min-h-0 flex-col w-full h-full p-8 gap-2">
        <div v-if="isLoading" class="flex items-center justify-center w-full h-full">
            <Loading class="flex w-64 h-64" />
        </div>
        <div v-else-if="isError" class="flex flex-col items-center justify-center w-full h-full">
            <p>Error loading data</p>
            <Button v-on:click="refetch">try again</Button>
        </div>
        <template v-else>
            <h1 class="font-semibold">Statistics</h1>
            <div class="flex items-center justify-center flex-row w-full gap-2">
                <div class="flex items-center justify-center w-32 h-20 rounded-2xl bg-slate-100 dark:bg-zinc-950 border-2 border-red-800">
                    <p class="font-semibold">{{ data.count["HIGH"] }}</p>
                </div>
                <div class="flex items-center justify-center w-32 h-20 rounded-2xl bg-slate-100 dark:bg-zinc-950 border-2 border-yellow-800">
                    <p class="font-semibold">{{ data.count["MEDIUM"] }}</p>
                </div>
                <div class="flex items-center justify-center w-32 h-20 rounded-2xl bg-slate-100 dark:bg-zinc-950 border-2 border-emerald-800">
                    <p class="font-semibold">{{ data.count["LOW"] }}</p>
                </div>
            </div>

            <div class="flex min-w-0 min-h-0 flex-col w-full h-full items-center rounded-3xl bg-slate-100 dark:bg-zinc-950 gap-2 p-2">
                <div class="flex items-center justify-end w-full flex-row bg-slate-100 dark:bg-zinc-950 p-2 h-20">
                    <div class="flex absolute left-1/2 -translate-x-1/2 gap-2">
                        <div class="flex flex-col w-48">
                            <label class="text-sm">Filter by Priority</label>
                            <Select size="small"v-model="selectedPriorities" :options="priorities" optionValue="value" optionLabel="display" placeholder="All Priorities" />
                        </div>
                        <div class="flex flex-col w-48">
                            <label class="text-sm">Filter by Creation Date</label>
                            <DatePicker size="small" v-model="selectedDate" selectionMode="range" showIcon iconDisplay="input" placeholder="All Dates" />
                        </div>
                    </div>
                    <button class="flex items-center gap-1 cursor-pointer p-2" :onclick="clearFilters">
                        <i class="pi pi-times" />
                        <p>Clear filters</p>
                    </button>
                </div>                
                <canvas class="flex min-w-0 min-h-0 p-2" ref="chart" />
            </div>
        </template>
    </div>
</template>