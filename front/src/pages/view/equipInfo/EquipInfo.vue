<template>
    <h3>设备：{{ equipInfo?.name }}</h3>

    <a-row :gutter="40">
        <a-col class="gutter-row" :span="12">
            <a-card title="设备简介">
                <a-card title="文字介绍">
                    <h3>{{ equipTypeInfo.des }}</h3>
                </a-card>
                <a-card title="常用参数">
                    <a-table bordered :data-source="equipTypeInfo.paramList" :columns="columns"></a-table>
                </a-card>
                <a-card title="视频">
                    <a-upload v-model:file-list="videoFileList" :show-upload-list="{ showRemoveIcon: false }">
                    </a-upload>
                </a-card>
            </a-card>
        </a-col>
        <a-col class="gutter-row" :span="12">
            <a-card title="作业指导">
                <a-card title="设计图">
                    <a-upload v-model:file-list="designFile" :show-upload-list="{ showRemoveIcon: false }">
                    </a-upload>
                </a-card>
                <a-card title="作业指导书">
                    <a-upload v-model:file-list="workGuideFile" :show-upload-list="{ showRemoveIcon: false }">
                    </a-upload>
                </a-card>
                <a-card title="技术指导">
                    <a-upload v-model:file-list="skillGuideFile" :show-upload-list="{ showRemoveIcon: false }">
                    </a-upload>
                </a-card>
                <a-card title="投稿">
                    <a-upload v-model:file-list="contributeFile" :show-upload-list="{ showRemoveIcon: false }">
                    </a-upload>
                </a-card>
            </a-card>
        </a-col>
    </a-row>
</template>


<script lang="ts">
import _ from "lodash";
import { message } from 'ant-design-vue';
import http from "../../../util/http";
import Utils from "../../../util/utils";

export default {
    data() {
        return {
            videoFileList: ([]) as UploadProps['fileList'],
            designFile: ([]) as UploadProps['fileList'],
            workGuideFile: ([]) as UploadProps['fileList'],
            skillGuideFile: ([]) as UploadProps['fileList'],
            contributeFile: ([]) as UploadProps['fileList'],
            equipTypeList: [],
            equipTypeInfo: -1,
            equipId: -1,
            equipInfo: undefined,
            columns: [
                {
                    title: '参数名称',
                    dataIndex: 'name',
                    width: '40%',
                },
                {
                    title: '参数值',
                    dataIndex: 'value',
                    width: '60%',
                },
            ],
        }
    },
    async created() {
        this.equipId = this.$route.params.equipId;
        await this.getEquipTypeList();
        await this.getEquipInfo();
        await this.getFileList();

    },
    methods: {
        async getFileList() {
            const res1 = http.get("/demo/file/list.json", { params: { deviceType: this.equipInfo.type, type: "2-1" } });
            const res2 = http.get("/demo/file/list.json", { params: { deviceType: this.equipInfo.type, type: "2-2" } });
            const res3 = http.get("/demo/file/list.json", { params: { deviceType: this.equipInfo.type, type: "2-3" } });
            const res4 = http.get("/demo/file/list.json", { params: { deviceType: this.equipInfo.type, type: "2-4" } });
            const res5 = http.get("/demo/file/list.json", { params: { deviceType: this.equipInfo.type, type: "2-5" } });
            const res = await Promise.all([res1, res2, res3, res4, res5]);
            if (res) {
                const videoInfo = res[0].data.data;
                this.videoFileList = (videoInfo.map(info => { return { name: info.name, uid: info.id, status: 'done', url: Utils.filePrefix + info.id }; }));
                const designInfo = res[1].data.data;
                this.designFile = (designInfo.map(info => { return { name: info.name, uid: info.id, status: 'done', url: Utils.filePrefix + info.id }; }));
                const workGuideInfo = res[2].data.data;
                this.workGuideFile = (workGuideInfo.map(info => { return { name: info.name, uid: info.id, status: 'done', url: Utils.filePrefix + info.id }; }));
                const skillGuideInfo = res[3].data.data;
                this.skillGuideFile = (skillGuideInfo.map(info => { return { name: info.name, uid: info.id, status: 'done', url: Utils.filePrefix + info.id }; }));
                const contributeInfo = res[4].data.data;
                this.contributeFile = (contributeInfo.map(info => { return { name: info.name, uid: info.id, status: 'done', url: Utils.filePrefix + info.id }; }));
            }
        },
        async getEquipTypeList() {
            const res = await http.get("/demo/deviceType/list.json");
            if (res && res.data && res.data.status === 200) {
                this.equipTypeList = res.data.data;
            }
        },
        async getEquipInfo() {
            const res = await http.get("/demo/device/list.json?id=" + this.equipId);
            if (res && res.data && res.data.status === 200 && res.data.data.length > 0) {
                this.equipInfo = res.data.data[0];
                const equipInfo = this.equipTypeList.find(item => item.id === this.equipInfo.type);
                if (equipInfo && equipInfo.other) {
                    this.equipTypeInfo = JSON.parse(equipInfo.other);
                }
            }
        },
    }
}

</script>

<style></style>