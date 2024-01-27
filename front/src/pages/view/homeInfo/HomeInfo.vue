<template>
    <a-row :gutter="24">
        <a-col :span="12">
            <a-card :title="data[0].title">
                <a-list size="small" bordered :data-source="data[0].list">
                    <template #renderItem="{ item }">
                        <a-list-item>{{ item }}</a-list-item>
                    </template>
                </a-list>
            </a-card>
        </a-col>
        <a-col :span="12">
            <a-card :title="data[1].title">
                <a-list size="small" bordered :data-source="data[1].list">
                    <template #renderItem="{ item }">
                        <a-list-item>{{ item }}</a-list-item>
                    </template>
                </a-list>
            </a-card>
        </a-col>
    </a-row>
</template>

<script lang="ts">
import http from "../../../util/http";
import Utils from "../../../util/Utils";
import moment from 'moment';

interface DataItem {
    title: string;
}

export default {
    data() {
        return {
            site: "0",
            timer: null,
            data: [
                {
                    title: '检查周期提醒',
                    list: [],
                },
                {
                    title: '近日养修提醒',
                    list: [],
                },
            ] as DataItem[],
            checkList: [],
            remainList: [],
        }
    },
    async created() {
        await this.getRemainInfo();
        this.timer = setInterval(() => { this.getRemainInfo(); }, 60 * 1000);
    },
    async beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
    methods: {
        async getRemainInfo() {
            const res0 = await http.get("/demo/device/checkCycleReminder.json");
            if (res0 && res0.data && res0.data.status === 200) {
                this.data[0].list = res0.data.data.map(info => `[${this.getStationName(info.stationId)}] ${info.name}应在${moment(info.nextFixTime).format("YYYY-MM-DD hh:mm:ss")}检查`);
            }
            const res1 = await http.get("/demo/device/recentMaintenanceReminder.json");
            if (res1 && res1.data && res1.data.status === 200) {
                this.data[1].list = res0.data.data.map(info => `[${this.getStationName(info.stationId)}] ${info.name}应在${moment(info.nextFixTime).format("YYYY-MM-DD hh:mm:ss")}养修`);
            }
        },
        getStationName(stationId){
            let statioName = Utils.stationList[0].name;
            Utils.stationList.forEach(item => {
                if (+item.stationId === stationId) {
                    statioName = item.name;
                }
            });
            return statioName;
        },
    }
}

</script>


<style scoped>
.title {
    font-weight: 800;
}
</style>
