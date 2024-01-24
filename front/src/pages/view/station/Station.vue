<template>
    <a-row>
        <a-col>
            <span style="font-size: 1.2rem;font-weight: 600;">设备：</span>
            <a-radio-group class="menu" v-model:value="equipType" @change="typeChange" button-style="solid" size="large">
                <a-radio-button v-for="item in equipTypeList" :value="+item.id" :key="item.id">{{ item.type
                }}</a-radio-button>
            </a-radio-group>
        </a-col>
    </a-row>
    <a-card title="站点设备信息图" style="width: 1024px">
        <template #extra>

        </template>
        <div class="drag-area">
            <FlagTwoTone draggable="true" disabled="false" style="font-size:1.6rem;" />
        </div>
    </a-card>
</template>

<script lang="ts">
import http from "../../../util/http";
import draggable from 'vuedraggable'

interface EquipType {
    id: number;
    cycle: number;
    type: string;
    other: string,
}

export default {
    components: {
        draggable,
    },
    data() {
        return {
            equipType: 0,
            equipTypeList: [] as EquipType[],
        }
    },
    async created() {
        await this.getEquipTypeList();
    },
    methods: {
        async getEquipTypeList() {
            const res = await http.get("/demo/deviceType/list.json");
            if (res && res.data && res.data.status === 200) {
                this.equipTypeList = res.data.data;
                this.equipType = this.equipTypeList[0].id;
                this.typeChange();
            };
        },
    }
}


</script>


<style scoped>
.title {
    font-weight: 800;
}

.menu {
    margin-bottom: 3rem;
}

.drag-area {
    width: 1024px;
    height: 768px;
}
</style>
