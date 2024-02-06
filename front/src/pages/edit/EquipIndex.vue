<template>
    <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" />
    <router-view></router-view>
</template>


<script lang="ts">
import { h } from 'vue';


export default {
    data() {
        return {
            current: ["equipMgt"],
            items: [
                {
                    key: 'stationMgt',
                    label: h('a', { href: '/#/equip/stationMgt' }, '站点管理'),
                    title: '站点管理',
                },
                {
                    key: 'equipTypeMgt',
                    label: h('a', { href: '/#/equip/equipTypeMgt' }, '设备类型管理'),
                    title: '设备类型管理',
                },
            ]
        }
    },
    async created() {
        switch (this.$route.name) {
            case "stationMgt":
            case "equipTypeMgt":
                this.current = [this.$route.name];
                break;
            default:
                this.current = ["equipTypeMgt"];
                break;
        }
    },
    methods: {
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