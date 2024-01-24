<template>
    <h2 class="title">阜阳工务段高铁设备管理平台</h2>
    <a-row>
        <a-col>
            <span style="font-size: 1.2rem;font-weight: 600;">站点：</span>
            <a-radio-group class="menu" v-model:value="site" @change="handleChange" button-style="solid" size="large">
                <a-radio-button value="1">线路所</a-radio-button>
                <a-radio-button value="2">阜阳西</a-radio-button>
                <a-radio-button value="3">太和东</a-radio-button>
                <a-radio-button value="4">临泉</a-radio-button>
                <a-radio-button value="5">界首</a-radio-button>
                <a-radio-button value="6">古城东</a-radio-button>
                <a-radio-button value="7">毫州南</a-radio-button>
                <a-radio-button value="8">芦庙</a-radio-button>
            </a-radio-group>
        </a-col>
    </a-row>
    <router-view></router-view>
</template>

<script lang="ts">

export default {
    data() {
        return {
            site: "0",
        }
    },
    async created() {
        this.site = this.$route.params.id?this.$route.params.id:"0";
    },
    methods: {
        handleChange() {
            this.$router.push({name: "station", params: { id: this.site }} );
            // this.site;
        }
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
</style>
