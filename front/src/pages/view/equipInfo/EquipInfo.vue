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
            <a-card title="分析">
                <a-card title="静态文件">
                    <a-upload v-model:file-list="staticFileList" :max-count="50" :action="Utils.uploadUrl"
                        @change="handleChange" :data="{ deviceId: equipId, limit: 50, type: staticFileType }">
                        <a-button @click="staticFileType = '0-0'">
                            <upload-outlined></upload-outlined>
                            上传检查文件
                        </a-button>
                        <a-button @click="staticFileType = '0-1'">
                            <upload-outlined></upload-outlined>
                            上传养修文件
                        </a-button>
                        <template #itemRender="{ file, actions }">
                            <a-space>
                                <a-checkbox v-model:checked="staticChecked[file.uid]"></a-checkbox>
                                <a href="javascript:;" @click="actions.download">{{ file.name }} [{{ file.type === "0-0" ?
                                    "检查" : "养修" }}]</a>
                            </a-space>
                        </template>
                    </a-upload>
                    <a-button @click="viewStatic" :icon="h(SearchOutlined)">看图</a-button>
                </a-card>
                <a-card title="动态文件">
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
import { h } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import _ from "lodash";
import { Modal, UploadChangeParam, UploadProps, message } from 'ant-design-vue';
import http from "../../../util/http";
import Utils from "../../../util/utils";

export default {
    data() {
        return {
            h: h,
            SearchOutlined: SearchOutlined,
            videoFileList: ([]) as UploadProps['fileList'],
            designFile: ([]) as UploadProps['fileList'],
            workGuideFile: ([]) as UploadProps['fileList'],
            skillGuideFile: ([]) as UploadProps['fileList'],
            contributeFile: ([]) as UploadProps['fileList'],
            staticFileType: "0-0",  // 0-0检查，0-1养修
            staticFileList: ([]) as UploadProps['fileList'],
            dynamicFileList: ([]) as UploadProps['fileList'],
            /**静态文件选中情况 */
            staticChecked: {},
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
            Utils: Utils,
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
            const res6 = http.get("/demo/file/list.json", { params: { deviceId: this.equipId, type: "0-0" } });
            const res7 = http.get("/demo/file/list.json", { params: { deviceId: this.equipId, type: "0-1" } });
            const res8 = http.get("/demo/file/list.json", { params: { deviceId: this.equipId, type: "1" } });
            const res = await Promise.all([res1, res2, res3, res4, res5, res6, res7, res8]);
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
                const staticCheckInfo = res[5].data.data;
                const staticCheckFile = (staticCheckInfo.map(info => { return { name: info.name, uid: info.id, status: 'done', url: Utils.filePrefix + info.id, type: "0-0" }; }));
                const staticFixInfo = res[6].data.data;
                const staticFixFile = (staticFixInfo.map(info => { return { name: info.name, uid: info.id, status: 'done', url: Utils.filePrefix + info.id, type: "0-1" }; }));
                this.staticFileList = [...staticCheckFile, ...staticFixFile].sort((a, b) => a.uid - b.uid);
                this.staticFileList.forEach(staticFile => {
                    this.staticChecked[staticFile.uid] = false;
                });
                const dynamicInfo = res[7].data.data;
                this.dynamicFileList = (dynamicInfo.map(info => { return { name: info.name, uid: info.id, status: 'done', url: Utils.filePrefix + info.id }; }));
            }
        },
        async getEquipTypeList() {
            const res = await http.get("/demo/deviceType/list.json");
            if (res && res.data && res.data.status === 200) {
                this.equipTypeList = res.data.data;
            }
        },
        async viewStatic() {
            const modal = Modal.info({
                title: '提示',
                content: `数据加载中`,
            });
            const staticFileList = this.staticFileList.filter(staticFile => {
                return this.staticChecked[staticFile.uid];
            });
            const staticFileIds = staticFileList.map(staticFile => {
                return staticFile.uid;
            });
            const resList = [];
            for (let i = 0; i < staticFileIds.length; i++) {
                const res = http.get("/demo/file/data.json", { params: { id: staticFileIds[i], start: 0, limit: 200 } });
                resList.push(res);
            }
            const res = await Promise.all(resList);
            if (res && res.every(item => item.data.status === 200)) {
                modal.update({type:"success",content: `数据加载成功`});
                const dataList = res.map(res => { return res.data.data; });
                setTimeout(()=>{modal.destroy();},1000);
            } else {
                modal.update({type:"error",content: `文件加载失败`});
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
        handleChange(info: UploadChangeParam) {
            if (info.file.status === 'done') {
                message.success(`${info.file.name} 文件上传成功`);
                this.getFileList();
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 文件上传失败`);
            }
        },
    }
}

</script>

<style></style>