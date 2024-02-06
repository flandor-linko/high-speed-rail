<template>
    <a-card :loading="loading" title="站点管理" style="width: 100%;height: 85vh;">
        <a-button class="editable-add-btn" type="primary" style="margin-bottom: 8px" @click="handleAdd">添加</a-button>
        <a-table bordered :data-source="dataSource" :columns="columns">
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'name'">
                    <div class="editable-cell">
                        <div class="editable-cell-text-wrapper">
                            {{ text || ' ' }}
                        </div>
                    </div>
                </template>
                <template v-else-if="column.dataIndex === 'operation'">
                    <a @click="clickEdit(record.id)" style="margin-right:2rem;">修改</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <a-popconfirm v-if="dataSource.length" title="确定要删除吗？" @confirm="onDelete(record.id)">
                        <a>删除</a>
                    </a-popconfirm>
                </template>
            </template>
        </a-table>
    </a-card>
    <a-modal v-model:open="addOpen" title="站点信息" @ok="addModalOk">
        <a-form-item label="站点名称" name="name">
            <a-input v-model:value="addData.name" placeholder="站点名称" style="width: 120px" />
        </a-form-item>
    </a-modal>
</template>


<script lang="ts">
import _ from "lodash";
import { message } from 'ant-design-vue';
import http from "../../util/http";

export default {
    data() {
        return {
            loading: false,
            dataSource: [],
            addOpen: false,
            modalMode: "add",
            columns: [
                {
                    title: '站点名称',
                    dataIndex: 'name',
                    width: '45%',
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    width: '45%',
                },
            ],
            addData: {
                name: ""
            },
            editableData: {},
        }
    },
    async created() {
        await this.getData();
    },
    methods: {
        async getData() {
            this.loading = true;
            const res = await http.get("/demo//station/list.json");
            if (res && res.data && res.data.status === 200) {
                this.dataSource = res.data.data;
                this.loading = false;
            }
        },
        clickEdit(id) {
            this.addOpen = true;
            this.modalMode = "edit";
            this.addData = _.cloneDeep(this.dataSource.filter(item => id === item.id)[0]);
        },
        edit(id: string) {
            this.editableData[id] = _.cloneDeep(this.dataSource.filter(item => id === item.id)[0]);
        },
        save(id: string) {
            if (!this.editableData[id].name) {
                message.error(`站点名称必填！`);
                return;
            }
            const data = {
                id: id,
                name: this.editableData[id].name
            }
            // 修改为body中传参
            http.post("/demo/station/update.json", data).then(res => {
                if (res && res.data && res.data.status === 200) {
                    message.success("保存成功");
                    this.getData();
                }
            });
        },
        onDelete(id: string) {
            http.get("/demo/station/delete.json?id=" + id).then(res => {
                if (res && res.data && res.data.status === 200) {
                    message.success("删除成功");
                    this.getData();
                }
            });
        },
        handleAdd() {
            this.addOpen = true;
        },
        addModalOk() {
            if (!this.addData.name) {
                message.error(`站点名称必填！`);
                return;
            }
            if (this.modalMode === "add") {
                const data = {
                    name: this.addData.name
                }
                // 修改为body中传参
                http.post("/demo/station/create.json", data).then(res => {
                    if (res && res.data && res.data.status === 200) {
                        message.success("保存成功");
                        this.addData = { name: "" };
                        this.addOpen = false;
                        this.getData();
                    }
                });
            } else if (this.modalMode === "edit") {
                const data = {...this.addData};
                // 修改为body中传参
                http.post("/demo/station/update.json", data).then(res => {
                    if (res && res.data && res.data.status === 200) {
                        message.success("保存成功");
                        this.addData = { name: "" };
                        this.addOpen = false;
                        this.getData();
                    }
                });
            }
        },
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