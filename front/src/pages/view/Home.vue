<template>
    <a-row>
        <a-col style="display: flex;">
            <a-image :width="50" src="/logo copy.jpg" :preview="false" />
            <h2 class="title" @click="goHome">阜阳工务段设备管理平台</h2>
        </a-col>
    </a-row>
    <a-row>
        <a-col>
            <span style="font-size: 1.2rem;font-weight: 600;">站点：</span>
            <a-radio-group class="menu" v-model:value="site" button-style="solid" size="large">
                <a-radio-button @click="clickStation(item.stationId)" v-for="item in stationList" :value="item.stationId">{{
                    item.name }}</a-radio-button>
            </a-radio-group>
        </a-col>
    </a-row>
    <router-view></router-view>
</template>

<script lang="ts">
import Utils from "../../util/utils";


export default {
    data() {
        return {
            site: "0",
            stationList: Utils.stationList,
        }
    },
    async created() {
        this.site = +(this.$route.params.id ? this.$route.params.id : "0");
    },
    methods: {
        goHome() {
            window.location.href = "";
        },
        clickStation(stationId) {
            this.$router.replace({ name: "station", params: { id: stationId , typeId: -1 } });
        },
    }
}


</script>


<style scoped>
.title {
    font-weight: 800;
    font-size: xx-large;
}

.menu {
    margin-bottom: 1rem;
}
</style>
