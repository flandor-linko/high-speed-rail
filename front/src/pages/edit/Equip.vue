<template>
    <a-modal v-model:open="open" title="请输入新的参数名称和参数值" @ok="handleOk" @cancel="handleCancel">
        <a-form :model="modalData" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" style="margin-top: 2rem;">
            <a-form-item label="参数名称" name="name">
                <a-input v-model:value="modalData.name" placeholder="参数名称" />
            </a-form-item>
            <a-form-item label="参数值" name="value">
                <a-input v-model:value="modalData.value" placeholder="参数值" />
            </a-form-item>
        </a-form>
    </a-modal>
    <div class="container">
        <h2>
            <!-- &nbsp;&nbsp;&nbsp;&nbsp;{{ greeting }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -->

            <!-- <a-radio-group v-model:value="equipType" button-style="solid" @change="typeChange">
                <a-radio-button v-for="item in equipTypeList" :value="+item.id" :key="item.id">{{ item.type
                }}</a-radio-button>
            </a-radio-group> -->
            <a-form layout="inline">
                <!-- <a-form-item label="设备类型" name="type">
                    <a-select v-model:value="equipType" style="width: 120px" @change="typeChange" size="large">
                        <a-select-option v-for="item in equipTypeList" :value="item.id" :key="item.id">{{ item.type
                        }}</a-select-option>
                    </a-select>
                </a-form-item> -->
                <a-form-item label="设备类型名称" name="typeName">
                    <a-input v-model:value="typeName" placeholder="设备类型名称" style="width: 120px" />
                </a-form-item>
                <a-form-item label="检查周期" name="cycle" style="margin-left: 2rem;">
                    <a-row>
                        <a-col>
                            <a-input-number size="large" id="inputNumber" v-model:value="cycleValue" :min="1"
                                addon-after="月" />
                        </a-col>
                        <!-- <a-col>
                        <a-select size="large" ref="select" v-model:value="cycle" style="width: 120px">
                            <a-select-option value="1">天</a-select-option>
                            <a-select-option value="2">周</a-select-option>
                            <a-select-option value="3">月</a-select-option>
                        </a-select>
                    </a-col> -->
                    </a-row>
                </a-form-item>
            </a-form>
        </h2>
        <a-form layout="vertical" :model="formState">
            <a-row :gutter="40">
                <a-col class="gutter-row" :span="12">
                    <a-card title="设备简介" :bordered="false">
                        <a-form-item label="● 文字介绍" name="des">
                            <a-textarea :rows="2" placeholder="请输入文字介绍" :maxlength="400" v-model:value="formState.des" />
                        </a-form-item>
                        <a-button class="editable-add-btn" style="margin-bottom: 8px" @click="handleAdd">添加参数</a-button>
                        <a-table bordered :data-source="dataSource" :columns="columns">
                            <template #bodyCell="{ column, text, record }">
                                <template v-if="column.dataIndex === 'name'">
                                    <div class="editable-cell">
                                        <div v-if="editableData[record.name]" class="editable-cell-input-wrapper">
                                            <a-input v-model:value="editableData[record.name].name"
                                                @pressEnter="save(record.name)" />
                                            <check-outlined class="editable-cell-icon-check" @click="save(record.name)" />
                                        </div>
                                        <div v-else class="editable-cell-text-wrapper">
                                            {{ text || ' ' }}
                                            <edit-outlined class="editable-cell-icon" @click="edit(record.name)" />
                                        </div>
                                    </div>
                                </template>
                                <template v-if="column.dataIndex === 'value'">
                                    <div class="editable-cell">
                                        <div v-if="editableData[record.value]" class="editable-cell-input-wrapper">
                                            <a-input v-model:value="editableData[record.value].value"
                                                @pressEnter="save(record.value)" />
                                            <check-outlined class="editable-cell-icon-check" @click="saveValue(record.value)" />
                                        </div>
                                        <div v-else class="editable-cell-text-wrapper">
                                            {{ text || ' ' }}
                                            <edit-outlined class="editable-cell-icon" @click="editValue(record.value)" />
                                        </div>
                                    </div>
                                </template>
                                <template v-else-if="column.dataIndex === 'operation'">
                                    <a-popconfirm v-if="dataSource.length" title="确定删除?" @confirm="onDelete(record.name)">
                                        <a>删除</a>
                                    </a-popconfirm>
                                </template>
                            </template>
                        </a-table>
                        <a-form-item :wrapper-col="{ offset: 20, span: 4 }" style="margin-top: 1rem;">
                            <a-button type="primary" @click="saveEquipInfo">保存</a-button>
                        </a-form-item>
                        <a-form-item v-if="mode == 'edit'" label="● 视频文件" name="video">
                            <a-upload v-model:file-list="videoFile" :max-count="1" accept="video/*" @change="handleChange"
                                @remove="handleRemove" :data="{ deviceType: equipType, limit: 1, type: '2-1' }"
                                :action="Utils.uploadUrl">
                                <a-button>
                                    <upload-outlined></upload-outlined>
                                    上传视频文件
                                </a-button>
                            </a-upload>
                        </a-form-item>
                    </a-card>
                </a-col>
                <a-col v-if="mode == 'edit'" class="gutter-row" :span="12">
                    <a-card title="作业指导" :bordered="false">
                        <a-form-item label="● 设计图" name="designFile">
                            <a-upload v-model:file-list="designFile" :max-count="10" @change="handleChange"
                                @remove="handleRemove" :data="{ deviceType: equipType, limit: 10, type: '2-2' }"
                                :action="Utils.uploadUrl">
                                <a-button>
                                    <upload-outlined></upload-outlined>
                                    上传设计图文件
                                </a-button>
                            </a-upload>
                        </a-form-item>
                        <a-form-item label="● 作业指导书" name="workGuideFile">
                            <a-upload v-model:file-list="workGuideFile" :max-count="10" @change="handleChange"
                                @remove="handleRemove" :data="{ deviceType: equipType, limit: 10, type: '2-3' }"
                                :action="Utils.uploadUrl">
                                <a-button>
                                    <upload-outlined></upload-outlined>
                                    上传作业指导书
                                </a-button>
                            </a-upload>
                        </a-form-item>
                        <a-form-item label="● 技术指导" name="skillGuideFile">
                            <a-upload v-model:file-list="skillGuideFile" :max-count="10" @change="handleChange"
                                @remove="handleRemove" :data="{ deviceType: equipType, limit: 10, type: '2-4' }"
                                :action="Utils.uploadUrl">
                                <a-button>
                                    <upload-outlined></upload-outlined>
                                    上传技术指导
                                </a-button>
                            </a-upload>
                        </a-form-item>
                        <a-form-item label="● 投稿" name="contributeFile">
                            <a-upload v-model:file-list="contributeFile" :max-count="10" @change="handleChange"
                                @remove="handleRemove" :data="{ deviceType: equipType, limit: 10, type: '2-5' }"
                                :action="Utils.uploadUrl">
                                <a-button>
                                    <upload-outlined></upload-outlined>
                                    上传投稿文件
                                </a-button>
                            </a-upload>
                        </a-form-item>
                    </a-card>

                    <a-card title="动态文件" :bordered="false" style="margin-top: 2rem;">
                        <a-upload class="limit-height" v-model:file-list="dynamicFileList" :max-count="10"
                            :action="Utils.uploadUrl" @change="handleChange" @remove="handleRemove"
                            :data="{ limit: 10, type: '1' }">
                            <a-button>
                                <upload-outlined></upload-outlined>
                                上传动态文件
                            </a-button>
                        </a-upload>
                    </a-card>
                </a-col>
            </a-row>
        </a-form>
    </div>
</template>


<script lang="ts">
import _ from "lodash";
// import { UploadOutlined } from '@ant-design/icons-vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import http from "../../util/http";
import Utils from "../../util/utils";
import moment from "moment";

interface EquipType {
    id: number;
    cycle: number;
    type: string;
    other: string,
}

interface DataItem {
    name: string;
    value: string;
}
interface ParamType { key: string, value: string }
interface OtherObj { des: string, paramList: ParamType[] }

export default {
    data() {
        return {
            mode: "add",
            Utils: Utils,
            greeting: "设备信息管理",
            typeName: "",
            editId: -1,
            equipType: 0,
            paramList: [] as ParamType[],
            videoFile: ([
                // {
                //     uid: '1',
                //     name: 'xxx.png',
                //     status: 'done',
                //     response: 'Server Error 500', // custom error message to show
                //     url: 'http://www.baidu.com/xxx.png',
                // }
            ]) as UploadProps['fileList'],
            designFile: ([]) as UploadProps['fileList'],
            workGuideFile: ([]) as UploadProps['fileList'],
            skillGuideFile: ([]) as UploadProps['fileList'],
            contributeFile: ([]) as UploadProps['fileList'],
            dynamicFileList: ([]) as UploadProps['fileList'],
            equipTypeList: [] as EquipType[],
            cycleValue: 1,
            formState: {
                des: "",
            },
            open: false,
            modalData: { name: "", value: "" },
            columns: [
                {
                    title: '参数名称',
                    dataIndex: 'name',
                    width: '40%',
                },
                {
                    title: '参数值',
                    dataIndex: 'value',
                    width: '35%',
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                },
            ],
            dataSource: [] as DataItem[],
            editableData: {} as Record<string, DataItem>,
        }
    },
    async created() {
        this.getMode();
        await this.getEquipTypeList();
    },
    methods: {
        async getEquipTypeList() {
            const res = await http.get("/demo/deviceType/list.json");
            if (res && res.data && res.data.status === 200) {
                this.equipTypeList = res.data.data;
                if (this.mode === "edit") {
                    this.equipType = this.equipTypeList.filter(item => item.id === this.editId)[0].id;
                    this.typeChange();
                }
            };
        },
        getMode() {
            this.$route.path.includes("edit") ? this.mode = "edit" : this.mode = "add";
            if (this.mode === "edit") {
                this.editId = +this.$route.params.id;
            }
        },
        async getFileList() {
            const res1 = http.get("/demo/file/list.json", { params: { deviceType: this.equipType, type: "2-1" } });
            const res2 = http.get("/demo/file/list.json", { params: { deviceType: this.equipType, type: "2-2" } });
            const res3 = http.get("/demo/file/list.json", { params: { deviceType: this.equipType, type: "2-3" } });
            const res4 = http.get("/demo/file/list.json", { params: { deviceType: this.equipType, type: "2-4" } });
            const res5 = http.get("/demo/file/list.json", { params: { deviceType: this.equipType, type: "2-5" } });
            const res6 = http.get("/demo/file/list.json", { params: { type: "1" } });
            const res = await Promise.all([res1, res2, res3, res4, res5, res6]);
            if (res) {
                const videoInfo = res[0].data.data;
                this.videoFile = (videoInfo.map(info => { return { name: `${info.name} [${this.formatTime(info.createTime)}]`, uid: info.id, status: 'done', url: Utils.filePrefix + info.id }; }));
                const designInfo = res[1].data.data;
                this.designFile = (designInfo.map(info => { return { name: `${info.name} [${this.formatTime(info.createTime)}]`, uid: info.id, status: 'done', url: Utils.filePrefix + info.id }; }));
                const workGuideInfo = res[2].data.data;
                this.workGuideFile = (workGuideInfo.map(info => { return { name: `${info.name} [${this.formatTime(info.createTime)}]`, uid: info.id, status: 'done', url: Utils.filePrefix + info.id }; }));
                const skillGuideInfo = res[3].data.data;
                this.skillGuideFile = (skillGuideInfo.map(info => { return { name: `${info.name} [${this.formatTime(info.createTime)}]`, uid: info.id, status: 'done', url: Utils.filePrefix + info.id }; }));
                const contributeInfo = res[4].data.data;
                this.contributeFile = (contributeInfo.map(info => { return { name: `${info.name} [${this.formatTime(info.createTime)}]`, uid: info.id, status: 'done', url: Utils.filePrefix + info.id }; }));
                const dynamicFileInfo = res[5].data.data;
                this.dynamicFileList = (dynamicFileInfo.map(info => { return { name: `${info.name} [${this.formatTime(info.createTime)}]`, uid: info.id, status: 'done', url: Utils.filePrefix + info.id }; }));
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
        formatTime(str) {
            return moment(str).zone("+08:00").format("YYYY-MM-DD HH:mm:ss");
        },
        async handleRemove(file) {
            const res = await http.get("/demo/file/delete.json", {
                params: {
                    id: +file.uid,
                }
            });

            if (res.data.status === 200) {
                message.success(`${file.name} 文件删除成功`);
                this.getFileList();
            }
        },

        handleAdd() {
            this.open = true;
        },
        async typeChange() {
            const res = await http.get("/demo/deviceType/get.json", {
                params: {
                    id: this.equipType,
                }
            });
            if (res.data.status === 200 && res.data.data) {
                this.cycleValue = res.data.data.cycle;
                this.typeName = res.data.data.type;
                if (!!res.data.data.other) {
                    const otherObj = JSON.parse(res.data.data.other) as OtherObj;
                    this.dataSource = otherObj.paramList as any;
                    this.formState.des = otherObj.des;
                } else {
                    this.dataSource = [];
                    this.formState.des = "";
                }

            }
            await this.getFileList();
        },
        save(name: string) {
            Object.assign(this.dataSource.filter(item => name === item.name)[0], this.editableData[name]);
            delete this.editableData[name];
        },
        saveValue(value: string) {
            Object.assign(this.dataSource.filter(item => value === item.value)[0], this.editableData[value]);
            delete this.editableData[value];
        },
        edit(name: string) {
            this.editableData[name] = _.cloneDeep(this.dataSource.filter(item => name === item.name)[0]);
        },
        editValue(value: string) {
            this.editableData[value] = _.cloneDeep(this.dataSource.filter(item => value === item.value)[0]);
        },
        onDelete(name: string) {
            this.dataSource = this.dataSource.filter(item => item.name !== name);
        },
        saveEquipInfo() {
            if (!this.typeName) {
                message.error('请输入设备类型名称');
                return;
            }
            if (!this.formState.des) {
                message.error('请输入文字介绍');
                return;
            }
            const otherObj = {
                des: this.formState.des,
                paramList: this.dataSource
            };
            const otherStr = JSON.stringify(otherObj);
            if (this.mode === "add") {
                const data = {
                    cycle: this.cycleValue,
                    other: otherStr,
                    type: this.typeName
                }
                // 修改为body中传参
                http.post("/demo/deviceType/add.json", data).then(res => {
                    if (res && res.data && res.data.status === 200) {
                        message.success("保存成功");
                        this.$router.push({ name: "equipTypeMgt" });
                    }
                });
            } else {
                const data = {
                    id: this.equipType,
                    cycle: this.cycleValue,
                    other: otherStr,
                    type: this.typeName
                }
                // 修改为body中传参
                http.post("/demo/deviceType/update.json", data).then(res => {
                    if (res && res.data && res.data.status === 200) {
                        message.success("保存成功");
                    }
                });
            }
        },

        handleOk() {
            if (!this.modalData.name || !this.modalData.value) {
                return;
            }
            this.open = false;
            const newData = { name: this.modalData.name, value: this.modalData.value };
            this.initModalData();
            this.dataSource.push(newData);
        },
        handleCancel() {
            this.open = false;
            this.initModalData();
        },
        initModalData() {
            this.modalData = { name: "", value: "" };
        }
    }
}

</script>

<style>
.container {
    background: #ececec;
    padding: 30px;
    text-align: left;
}

.limit-height .ant-upload-list {
    height: 6rem;
    overflow: auto;
}
</style>