<template>
    <a-row :gutter="24">
        <a-col :span="12">
            <a-card :title="data[0].title" :bodyStyle="{ height: '40rem', overflow: 'auto' }">
                <a-list size="small" bordered :data-source="data[0].list">
                    <template #renderItem="{ item }">
                        <a-list-item @click="clickEquip(item.id)"><a-tag :color="getStationColor(item.stationId)">{{
                            getStationName(item.stationId) }}</a-tag> <span style="text-decoration: underline;">{{
        item.name }}</span>（ {{ getTypeName(item.type) }} ） 应在 <a-tag color="blue">{{
        formatTime(item.nextFixTime) }}</a-tag>
                            检查</a-list-item>
                    </template>
                </a-list>
            </a-card>
        </a-col>
        <a-col :span="12">
            <a-card :title="data[1].title" :bodyStyle="{ height: '40rem', overflow: 'auto' }">
                <a-list size="small" bordered :data-source="data[1].list">
                    <template #renderItem="{ item }">
                        <a-list-item @click="clickEquip(item.id)"><a-tag :color="getStationColor(item.stationId)">{{
                            getStationName(item.stationId) }}</a-tag> <span style="text-decoration: underline;">{{
        item.name }}</span>（ {{ getTypeName(item.type) }} ） 已在 <a-tag color="blue">{{
        formatTime(item.lastFixTime) }}</a-tag>
                            完成养修</a-list-item>
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
            equipTypeList: [],
            checkList: [],
            remainList: [],
        }
    },
    async created() {
        await this.getTypeList();
        await this.getRemainInfo();
        this.timer = setInterval(() => { this.getRemainInfo(); }, 60 * 1000);
    },
    async beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
    methods: {
        async getTypeList() {
            const res = await http.get("/demo/deviceType/list.json");
            if (res && res.data && res.data.status === 200) {
                this.equipTypeList = res.data.data;
            };
        },
        async getRemainInfo() {
            const res0 = await http.get("/demo/device/checkCycleReminder.json");
            if (res0 && res0.data && res0.data.status === 200) {
                this.data[0].list = res0.data.data;
            }
            const res1 = await http.get("/demo/device/recentMaintenanceReminder.json");
            if (res1 && res1.data && res1.data.status === 200) {
                this.data[1].list = res1.data.data;
            }
        },
        getStationName(stationId) {
            let statioName = Utils.stationList[0].name;
            Utils.stationList.forEach(item => {
                if (+item.stationId === stationId) {
                    statioName = item.name;
                }
            });
            return statioName;
        },
        getTypeName(typeId) {
            let typeName = "";
            for (let index = 0; index < this.equipTypeList.length; index++) {
                const element = this.equipTypeList[index];
                if (element.id === typeId) {
                    typeName = element.type;
                    break;
                }
            }
            return typeName;
        },
        getStationColor(stationId) {
            let color = Utils.stationList[0].color;
            // Utils.stationList.forEach(item => {
            //     if (+item.stationId === stationId) {
            //         color = item.color;
            //     }
            // });
            return color;
        },
        formatTime(timeStr: string) {
            return moment(timeStr).zone("+08:00").format("YYYY-MM-DD");
        },
        clickEquip(id) {
            this.$router.push({ name: "equipInfo", params: { equipId: id } });
        },
    }
}

</script>


<style scoped>
.title {
    font-weight: 800;
}</style>
