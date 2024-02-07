<template>
    <a-card :loading="loading" title="设备类型管理" style="width: 100%;height: 85vh;">
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
                    <a-popconfirm v-if="dataSource.length" title="将会删除该设备类型下所有的数据，确定要删除吗？" @confirm="onDelete(record.id)">
                        <a>删除</a>
                    </a-popconfirm>
                </template>
            </template>
        </a-table>
    </a-card>
</template>


<script lang="ts">
import { message } from 'ant-design-vue';
import _ from "lodash";
import http from '../../util/http';
import Utils from '../../util/utils';


export default {
    data() {
        return {
            loading: false,
            dataSource: [],
            columns: [
                {
                    title: '设备类型名称',
                    dataIndex: 'type',
                    width: '45%',
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    width: '45%',
                },
            ],
        }
    },
    async created() {
        await this.getData();
    },
    methods: {
        async getData() {
            this.loading = true;
            await Utils.getEquipTypeList();
            this.dataSource = _.cloneDeep(Utils.equipTypeList);
            this.loading = false;
        },
        handleAdd() {
            this.$router.push({ name: "equipTypeAdd" });
        },
        clickEdit(id) {
            this.$router.push({ name: "equipTypeEdit", params: { id: id } });
        },
        async onDelete(id) {
            const res = await http.get("/demo/deviceType/delete.json?id=" + id);
            if (res && res.data && res.data.status === 200) {
                message.success("删除成功");
                this.getData();
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