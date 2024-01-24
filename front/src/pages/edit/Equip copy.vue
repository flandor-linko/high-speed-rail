
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
        <div>
        </div>
        <h2>&nbsp;&nbsp;&nbsp;&nbsp;{{ greeting }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

            <a-radio-group v-model:value="equipType" button-style="solid">
                <a-radio-button v-for="item in equipTypeList" :value="+item.id" :key="item.id">{{ item.type
                }}</a-radio-button>
                <!-- <a-radio-button value="1">轨道</a-radio-button>
                <a-radio-button value="2">接头</a-radio-button>
                <a-radio-button value="3">道岔</a-radio-button>
                <a-radio-button value="4">道床</a-radio-button>
                <a-radio-button value="5">钢轨</a-radio-button>
                <a-radio-button value="6">曲线</a-radio-button>
                <a-radio-button value="7">桥隧</a-radio-button>
                <a-radio-button value="8">桥墩</a-radio-button>
                <a-radio-button value="9">桥梁</a-radio-button> -->
            </a-radio-group>

            <a-form-item label="检查周期" name="cycle" style="margin-left: 2rem;margin-top: 1rem;display: flex;">
                <a-row>
                    <a-col>
                        <a-input-number size="large" id="inputNumber" v-model:value="cycleValue" :min="1" :max="10"
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
        </h2>
        <a-form layout="vertical" :model="formState">
            <a-row :gutter="40">
                <a-col class="gutter-row" :span="12">
                    <a-card title="设备简介" :bordered="false">
                        <a-form-item label="文字介绍" name="des">
                            <a-textarea :rows="2" placeholder="请输入文字介绍" :maxlength="12" v-model:value="formState.des" />
                        </a-form-item>
                        <a-button class="editable-add-btn" style="margin-bottom: 8px" @click="handleAdd">添加参数</a-button>
                        <a-table bordered :data-source="dataSource" :columns="columns">
                            <template #bodyCell="{ column, text, record }">
                                <template v-if="column.dataIndex === 'name' || column.dataIndex === 'value'">
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
                                <template v-else-if="column.dataIndex === 'operation'">
                                    <a-popconfirm v-if="dataSource.length" title="确定删除?" @confirm="onDelete(record.name)">
                                        <a>删除</a>
                                    </a-popconfirm>
                                </template>
                            </template>
                        </a-table>
                        <a-form-item label="视频文件" name="video">
                            <a-upload v-model:file-list="fileList" :max-count="1" accept="video/*"
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76">
                                <a-button>
                                    <upload-outlined></upload-outlined>
                                    上传视频文件（最多1个）
                                </a-button>
                            </a-upload>
                        </a-form-item>
                        <a-form-item :wrapper-col="{ offset: 20, span: 4 }">
                            <a-button type="primary" html-type="submit">保存</a-button>
                        </a-form-item>
                    </a-card>
                </a-col>
                <a-col class="gutter-row" :span="12">
                    <a-card title="作业指导" :bordered="false">
                        <a-form-item label="设计图" name="video">
                            <a-upload v-model:file-list="fileList"
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76">
                                <a-button>
                                    <upload-outlined></upload-outlined>
                                    上传设计图文件
                                </a-button>
                            </a-upload>
                        </a-form-item>
                        <a-form-item label="作业指导书" name="video">
                            <a-upload v-model:file-list="fileList"
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76">
                                <a-button>
                                    <upload-outlined></upload-outlined>
                                    上传作业指导书
                                </a-button>
                            </a-upload>
                        </a-form-item>
                        <a-form-item label="技术指导" name="video">
                            <a-upload v-model:file-list="fileList"
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76">
                                <a-button>
                                    <upload-outlined></upload-outlined>
                                    上传技术指导
                                </a-button>
                            </a-upload>
                        </a-form-item>
                        <a-form-item label="投稿" name="video">
                            <a-upload v-model:file-list="fileList"
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76">
                                <a-button>
                                    <upload-outlined></upload-outlined>
                                    上传投稿文件
                                </a-button>
                            </a-upload>
                        </a-form-item>
                    </a-card>
                </a-col>
            </a-row>
        </a-form>
    </div>
</template>


<script setup lang="ts">
import { Ref, UnwrapRef, onMounted, reactive, ref } from 'vue';
import _ from "lodash";
import { UploadOutlined } from '@ant-design/icons-vue';
import type { UploadProps } from 'ant-design-vue';
import http from "../../util/http";

let equipType = ref<string>('0');
const cycleValue = ref<number>(1);
let equipTypeList: Ref<EquipType[]> = ref([]);
// const cycle = ref<string>('1');
const open = ref<boolean>(false);
const fileList = ref<UploadProps['fileList']>([
    {
        uid: '1',
        name: 'xxx.png',
        status: 'done',
        response: 'Server Error 500', // custom error message to show
        url: 'http://www.baidu.com/xxx.png',
    }
]);
const greeting = ref('设备信息管理');
let modalData = { name: "", value: "" };
const columns = [
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
];

const dataSource: Ref<DataItem[]> = ref([]);

interface DataItem {
    name: string;
    value: string;
}

interface EquipType {
    id: number;
    cycle: number;
    type: string;
    other: string,
}

interface FormState {
    des: string
}
const formState: UnwrapRef<FormState> = reactive({
    des: ""
});

const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

onMounted(() => {
    getEquipTypeList();
})

const getEquipTypeList = async () => {
    const res = await http.post("/demo/deviceType/list.json");
    if (res && res.data && res.data.status === 200) {
        // equipType = equipTypeList[0].id;
        equipTypeList = res.data.data as any;
    };
};

const edit = (name: string) => {
    editableData[name] = _.cloneDeep(dataSource.value.filter(item => name === item.name)[0]);
};
const save = (name: string) => {
    Object.assign(dataSource.value.filter(item => name === item.name)[0], editableData[name]);
    delete editableData[name];
};

const onDelete = (name: string) => {
    dataSource.value = dataSource.value.filter(item => item.name !== name);
};
const handleAdd = () => {
    open.value = true;
};

const handleOk = () => {
    if (!modalData.name || !modalData.value) {
        return;
    }
    open.value = false;
    const newData = { name: modalData.name, value: modalData.value };
    initModalData();
    dataSource.value.push(newData);
};

const handleCancel = () => {
    open.value = false;
    initModalData();
};

const initModalData = () => {
    modalData = { name: "", value: "" };
}

</script>

<style>
.container {
    background: #ececec;
    padding: 30px;
    text-align: left;
}
</style>