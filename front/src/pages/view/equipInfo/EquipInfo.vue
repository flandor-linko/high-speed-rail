<template>
    <h3 style="display: inline;font-weight: bolder;">站点：{{ stationName }}</h3>
    <h3 style="display: inline;margin-left: 2rem;font-weight: bolder;">设备：{{ equipTypeInfo.name }} {{ equipInfo?.name }}
    </h3>
    <a-row :gutter="40">
        <a-col class="gutter-row" :span="8">
            <a-card title="设备简介" :bodyStyle="{ height: '38rem', overflow: 'auto' }">
                <a-card title="视频">
                    <video style="width: 100%;" v-if="videoFileList?.length > 0" controls preload="auto">
                        <source :src="videoFileList[0].url">
                        </source>
                    </video>
                    <!-- <a-upload v-model:file-list="videoFileList" :show-upload-list="{ showRemoveIcon: false }">
                    </a-upload> -->
                </a-card>
                <a-card title="文字介绍">
                    <h3>{{ equipTypeInfo.des }}</h3>
                </a-card>
                <a-card title="常用参数">
                    <a-table bordered :data-source="equipTypeInfo.paramList" :columns="columns"></a-table>
                </a-card>
            </a-card>
        </a-col>
        <a-col class="gutter-row" :span="8">
            <a-card title="作业指导" :bodyStyle="{ height: '38rem', overflow: 'auto' }">
                <a-card title="设计图" :bodyStyle="{ height: '5rem', overflow: 'auto' }">
                    <a-upload v-model:file-list="designFile" :show-upload-list="{ showRemoveIcon: false }">
                    </a-upload>
                </a-card>
                <a-card title="作业指导书" :bodyStyle="{ height: '5rem', overflow: 'auto' }">
                    <a-upload v-model:file-list="workGuideFile" :show-upload-list="{ showRemoveIcon: false }">
                    </a-upload>
                </a-card>
                <a-card title="技术指导" :bodyStyle="{ height: '5rem', overflow: 'auto' }">
                    <a-upload v-model:file-list="skillGuideFile" :show-upload-list="{ showRemoveIcon: false }">
                    </a-upload>
                </a-card>
                <a-card title="投稿" :bodyStyle="{ height: '5rem', overflow: 'auto' }">
                    <a-upload v-model:file-list="contributeFile" :show-upload-list="{ showRemoveIcon: false }"
                        :max-count="10" @change="handleChange"
                        :data="{ deviceType: equipInfo?.type, limit: 10, type: '2-5' }" :action="Utils.uploadUrl">
                        <a-button>
                            <upload-outlined></upload-outlined>
                            上传投稿文件
                        </a-button>
                    </a-upload>
                </a-card>
            </a-card>
        </a-col>
        <a-col class="gutter-row" :span="8">
            <a-card title="分析" :bodyStyle="{ height: '38rem', overflow: 'auto' }">
                <a-card title="静态文件">
                    <a-upload class="limit-height" v-model:file-list="staticFileList" :max-count="50"
                        :action="Utils.uploadUrl" @change="handleChange"
                        :data="{ deviceId: equipId, limit: 50, type: staticFileType }">
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
                                <a href="javascript:;" @click="actions.download">{{ file.name }}</a>
                                <a-tag v-if="file.type === '0-0'" color="blue">检查</a-tag>
                                <a-tag v-else color="green">养修</a-tag>
                            </a-space>
                        </template>
                    </a-upload>
                    <a-button @click="viewStatic" :icon="h(SearchOutlined)">看图</a-button>
                    <a-button @click="delSatic" :icon="h(DeleteOutlined)">删除</a-button>
                </a-card>
                <a-card title="动态文件">
                    <a-upload class="limit-height" v-model:file-list="dynamicFileList" :max-count="10"
                        :action="Utils.uploadUrl" @change="handleChange"
                        :data="{ deviceId: equipId, limit: 10, type: '1' }">
                        <a-button>
                            <upload-outlined></upload-outlined>
                            上传动态文件
                        </a-button>
                        <template #itemRender="{ file, actions }">
                            <a-space>
                                <a-checkbox v-model:checked="dynamicChecked[file.uid]"></a-checkbox>
                                <a href="javascript:;" @click="actions.download">{{ file.name }} </a>
                            </a-space>
                        </template>
                    </a-upload>
                    <a-button @click="viewDynamic" :icon="h(SearchOutlined)">看图</a-button>
                </a-card>
            </a-card>
        </a-col>
    </a-row>

    <a-modal v-model:open="chartModalOpen" title="数据信息" width="100%" wrap-class-name="full-modal"
        @ok="chartModalOpen = false">
        <div v-if="chartModalOpen" style="width:100%;height:100%" ref="chart" id="staticChart"></div>
    </a-modal>
    <a-modal v-model:open="dynamicChartModalOpen" title="数据信息" width="100%" wrap-class-name="full-modal"
        @ok="dynamicChartModalOpen = false">
        <div v-if="dynamicChartModalOpen" style="width:100%;height:100%" ref="chart" id="chart"></div>
    </a-modal>
</template>


<script lang="ts">
import { h } from 'vue';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons-vue';
import _ from "lodash";
import * as echarts from 'echarts';
import { Modal, UploadChangeParam, UploadProps, message } from 'ant-design-vue';
import http from "../../../util/http";
import Utils from "../../../util/utils";
import moment from 'moment';

export default {
    data() {
        return {
            chartModalOpen: false,
            dynamicChartModalOpen: false,
            h: h,
            DeleteOutlined: DeleteOutlined,
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
            dynamicChecked: {},
            equipTypeList: [],
            equipTypeInfo: -1,
            equipId: -1,
            equipInfo: undefined,
            stationName: "",
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
                this.designFile = (designInfo.map(info => { return { name: `${info.name} [${this.formatTime(info.createTime)}]`, uid: info.id, status: 'done', url: Utils.filePrefix + info.id }; }));
                const workGuideInfo = res[2].data.data;
                this.workGuideFile = (workGuideInfo.map(info => { return { name: `${info.name} [${this.formatTime(info.createTime)}]`, uid: info.id, status: 'done', url: Utils.filePrefix + info.id }; }));
                const skillGuideInfo = res[3].data.data;
                this.skillGuideFile = (skillGuideInfo.map(info => { return { name: `${info.name} [${this.formatTime(info.createTime)}]`, uid: info.id, status: 'done', url: Utils.filePrefix + info.id }; }));
                const contributeInfo = res[4].data.data;
                this.contributeFile = (contributeInfo.map(info => { return { name: `${info.name} [${this.formatTime(info.createTime)}]`, uid: info.id, status: 'done', url: Utils.filePrefix + info.id }; }));
                const staticCheckInfo = res[5].data.data;
                const staticCheckFile = (staticCheckInfo.map(info => { return { name: `${info.name} [${this.formatTime(info.createTime)}]`, uid: info.id, status: 'done', url: Utils.filePrefix + info.id, type: "0-0" }; }));
                const staticFixInfo = res[6].data.data;
                const staticFixFile = (staticFixInfo.map(info => { return { name: `${info.name} [${this.formatTime(info.createTime)}]`, uid: info.id, status: 'done', url: Utils.filePrefix + info.id, type: "0-1" }; }));
                this.staticFileList = [...staticCheckFile, ...staticFixFile].sort((a, b) => a.uid - b.uid);
                this.staticFileList.forEach(staticFile => {
                    this.staticChecked[staticFile.uid] = false;
                });
                const dynamicInfo = res[7].data.data;
                this.dynamicFileList = (dynamicInfo.map(info => { return { name: `${info.name} [${this.formatTime(info.createTime)}]`, uid: info.id, status: 'done', url: Utils.filePrefix + info.id }; }));
                this.dynamicFileList.forEach(dynamicFile => {
                    this.dynamicChecked[dynamicFile.uid] = false;
                });
            }
        },
        async getEquipTypeList() {
            const res = await http.get("/demo/deviceType/list.json");
            if (res && res.data && res.data.status === 200) {
                this.equipTypeList = res.data.data;
            }
        },
        formatTime(str) {
            return moment(str).zone("+08:00").format("YYYY-MM-DD HH:mm:ss");
        },
        async viewDynamic() {
            const dynamicFileList = this.dynamicFileList.filter(dynamicFile => {
                return this.dynamicChecked[dynamicFile.uid];
            });
            if (dynamicFileList.length > 1) {
                message.error(`选择动态文件数目不能大于1`);
                return;
            } else if (dynamicFileList.length < 1) {
                message.error(`请选择动态文件`);
                return;
            }
            const modal = Modal.info({
                title: '提示',
                content: `数据加载中`,
            });
            const dynamicFileIds = dynamicFileList.map(dynamicFile => {
                return dynamicFile.uid;
            });
            const resList = [];
            for (let i = 0; i < dynamicFileIds.length; i++) {
                const xIndex = JSON.parse(this.equipInfo.position).xIndex;
                const start = xIndex - 0.2;
                const end = xIndex + 0.2;
                const res = http.get("/demo/file/data.json", { params: { id: dynamicFileIds[i], start: start, end: end } });
                resList.push(res);
            }
            const res = await Promise.all(resList);
            if (res && res.every(item => item.data.status === 200)) {
                modal.update({ type: "success", content: `数据加载成功` });
                const dataList = res.map(res => { return res.data.data; });
                setTimeout(() => {
                    modal.destroy();
                    this.initDynamicChart(dataList);
                }, 1000);
            } else {
                modal.update({ type: "error", content: `文件加载失败` });
            }
        },
        async initDynamicChart(dataList) {
            this.dynamicChartModalOpen = true;
            const xData = dataList[0].map(item => { return item.realMileage; });
            const dataRes = dataList[0];
            // 左高低 —— 2
            const leftHigh10 = [];
            // 右高低10 —— 3
            const righHigh10 = [];
            // 左轨向10 —— 4
            const left10 = [];
            // 右轨向10 —— 5
            const right10 = [];
            dataRes.forEach(dataItem => {
                const dataArray = JSON.parse(dataItem.data);
                const x = dataItem.realMileage;
                leftHigh10.push([x, dataArray[2]]);
                righHigh10.push([x, dataArray[3]]);
                left10.push([x, dataArray[4]]);
                right10.push([x, dataArray[5]]);
            });
            await this.$nextTick();
            let myChart = echarts.init(document.getElementById('chart'));
            myChart.setOption({
                title: [
                    { text: '左高低', left: 'center', },
                    { text: '右高低', left: 'center', top: '25%', },
                    { text: '左轨向', left: 'center', top: '50%', },
                    { text: '右轨向', left: 'center', top: '75%', },
                ],
                dataZoom: [
                    {
                        type: 'slider',
                        xAxisIndex: [0, 1, 2, 3]
                    },
                ],
                xAxis: [
                    {
                        name: "里程",
                        type: "value",
                        scale: true,
                    },
                    {
                        name: "里程",
                        type: "value",
                        scale: true,
                        gridIndex: 1
                    },
                    {
                        name: "里程",
                        type: "value",
                        scale: true,
                        gridIndex: 2
                    },
                    {
                        name: "里程",
                        type: "value",
                        scale: true,
                        gridIndex: 3
                    },
                ],
                tooltip: {
                    trigger: 'axis'
                },
                yAxis: [
                    {
                        splitLine: {     //网格线
                            "show": false
                        }
                    },
                    {
                        gridIndex: 1,
                        splitLine: {     //网格线
                            "show": false
                        }
                    },
                    {
                        gridIndex: 2,
                        splitLine: {     //网格线
                            "show": false
                        }
                    },
                    {
                        gridIndex: 3,
                        splitLine: {     //网格线
                            "show": false
                        }
                    },
                ],
                grid: [
                    {
                        bottom: '80%',
                        show: false,
                    },
                    {
                        top: '25%',
                        height: '20%'
                    },
                    {
                        top: '50%',
                        height: '20%'
                    },
                    {
                        top: '75%',
                        height: '20%'
                    }
                ],
                series: [
                    {
                        name: '左高低',
                        type: 'line',
                        smooth: true,
                        data: leftHigh10,
                        itemStyle: {
                            color: "#5470c6"
                        },
                    },
                    {
                        name: '右高低',
                        type: 'line',
                        smooth: true,
                        data: righHigh10,
                        itemStyle: {
                            color: "#5470c6"
                        },
                        xAxisIndex: 1,
                        yAxisIndex: 1
                    },
                    {
                        name: '左轨向',
                        type: 'line',
                        smooth: true,
                        data: left10,
                        itemStyle: {
                            color: "#5470c6"
                        },
                        xAxisIndex: 2,
                        yAxisIndex: 2
                    },
                    {
                        name: '右轨向',
                        type: 'line',
                        smooth: true,
                        data: right10,
                        itemStyle: {
                            color: "#5470c6"
                        },
                        xAxisIndex: 3,
                        yAxisIndex: 3
                    },
                ]
            });
        },
        async viewStatic() {
            const staticFileList = this.staticFileList.filter(staticFile => {
                return this.staticChecked[staticFile.uid];
            });
            const fileNameList = staticFileList.map(file => file.name);
            if (staticFileList.length > 2) {
                message.error(`选择静态文件数目不能大于2`);
                return;
            } else if (staticFileList.length < 1) {
                message.error(`请选择静态文件`);
                return;
            }
            const modal = Modal.info({
                title: '提示',
                content: `数据加载中`,
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
                modal.update({ type: "success", content: `数据加载成功` });
                const dataList = res.map(res => { return res.data.data; });
                setTimeout(() => {
                    modal.destroy();
                    this.initStaticChart(dataList, fileNameList);
                }, 1000);
            } else {
                modal.update({ type: "error", content: `文件加载失败` });
            }
        },
        async delSatic() {
            const staticFileList = this.staticFileList.filter(staticFile => {
                return this.staticChecked[staticFile.uid];
            });
            if (staticFileList.length === 0) {
                message.error(`请选择静态文件`);
                return;
            }
            const staticFileIds = staticFileList.map(staticFile => {
                return staticFile.uid;
            });
            const resList = [];
            for (let i = 0; i < staticFileIds.length; i++) {
                const res = http.get("/demo/file/delete.json", { params: { id: staticFileIds[i] } });
                resList.push(res);
            }
            const res = await Promise.all(resList);
            if (res && res.every(item => item.data.status === 200)) {
                message.success(`删除成功`);
                // 初始化列表
                this.initStaticList();
            } else {
                message.error(`删除失败`);
            }
        },
        async initStaticList() {
            const res6 = http.get("/demo/file/list.json", { params: { deviceId: this.equipId, type: "0-0" } });
            const res7 = http.get("/demo/file/list.json", { params: { deviceId: this.equipId, type: "0-1" } });
            const res = await Promise.all([res6, res7]);
            if (res) {
                const staticCheckInfo = res[0].data.data;
                const staticCheckFile = (staticCheckInfo.map(info => { return { name: `${info.name} [${this.formatTime(info.createTime)}]`, uid: info.id, status: 'done', url: Utils.filePrefix + info.id, type: "0-0" }; }));
                const staticFixInfo = res[1].data.data;
                const staticFixFile = (staticFixInfo.map(info => { return { name: `${info.name} [${this.formatTime(info.createTime)}]`, uid: info.id, status: 'done', url: Utils.filePrefix + info.id, type: "0-1" }; }));
                this.staticFileList = [...staticCheckFile, ...staticFixFile].sort((a, b) => a.uid - b.uid);
                this.staticFileList.forEach(staticFile => {
                    this.staticChecked[staticFile.uid] = false;
                });
            }
        },
        async initStaticChart(dataList, fileNameList) {
            this.chartModalOpen = true;
            // const xData = dataList[0].map(item => { return item.realMileage; });
            const dataRes = dataList[0];
            // 左轨向10 —— 3
            const left10 = [];
            // 右轨向10 —— 4
            const right10 = [];
            // 左轨向20 —— 5
            const left20 = [];
            // 右轨向20 —— 6
            const right20 = [];
            // 轨距 —— 7
            const guiju = [];
            // 左高低10 —— 8
            const leftHigh10 = [];
            // 右高低10 —— 9
            const righHigh10 = [];
            // 左高低20 —— 10
            const leftHigh20 = [];
            // 右高低20 —— 11
            const righHigh20 = [];
            // 超高 —— 12
            const chaogao = [];
            dataRes.forEach(dataItem => {
                const dataArray = JSON.parse(dataItem.data);
                const x = dataItem.realMileage;
                left10.push([x, dataArray[3]]);
                right10.push([x, dataArray[4]]);
                // left20.push([x, dataArray[5]]);
                // right20.push([x, dataArray[6]]);
                // guiju.push([x, dataArray[7]]);
                leftHigh10.push([x, dataArray[8]]);
                righHigh10.push([x, dataArray[9]]);
                // leftHigh20.push([x, dataArray[10]]);
                // righHigh20.push([x, dataArray[11]]);
                // chaogao.push([x, dataArray[12]]);
            });
            const series2 = [];
            if (dataList.length > 1) {
                const dataRes2 = dataList[1];
                // 左轨向10 —— 3
                const left10_2 = [];
                // 右轨向10 —— 4
                const right10_2 = [];
                // 左高低10 —— 8
                const leftHigh10_2 = [];
                // 右高低10 —— 9
                const righHigh10_2 = [];
                dataRes2.forEach(dataItem => {
                    const dataArray = JSON.parse(dataItem.data);
                    const x = dataItem.realMileage;
                    left10_2.push([x, dataArray[3]]);
                    right10_2.push([x, dataArray[4]]);
                    leftHigh10_2.push([x, dataArray[8]]);
                    righHigh10_2.push([x, dataArray[9]]);
                });
                series2.push({
                    name: '左轨向10' + fileNameList[1],
                    type: 'line',
                    smooth: true,
                    data: left10_2,
                    itemStyle: {
                        color: "#3ba272"
                    },
                    xAxisIndex: 0,
                    yAxisIndex: 0
                }, {
                    name: '右轨向10' + fileNameList[1],
                    type: 'line',
                    smooth: true,
                    data: right10_2,
                    itemStyle: {
                        color: "#3ba272"
                    },
                    xAxisIndex: 1,
                    yAxisIndex: 1
                }, {
                    name: '左高低10' + fileNameList[1],
                    type: 'line',
                    smooth: true,
                    data: leftHigh10_2,
                    itemStyle: {
                        color: "#3ba272"
                    },
                    xAxisIndex: 2,
                    yAxisIndex: 2
                }, {
                    name: '右高低10' + fileNameList[1],
                    type: 'line',
                    smooth: true,
                    data: righHigh10_2,
                    itemStyle: {
                        color: "#3ba272"
                    },
                    xAxisIndex: 3,
                    yAxisIndex: 3
                });
            }

            // 防止获取不到dom元素
            await this.$nextTick();
            let myChart = echarts.init(document.getElementById('staticChart'));
            // 绘制图表
            myChart.setOption({
                title: [
                    { text: '左轨向10', left: 'center', },
                    { text: '右轨向10', left: 'center', top: '25%', },
                    { text: '左高低10', left: 'center', top: '50%', },
                    { text: '右高低10', left: 'center', top: '75%', },
                ],
                // legend: [
                //     { show: true },
                //     { show: true },
                //     { show: true },
                //     { show: true },
                // ],
                dataZoom: [
                    {
                        type: 'slider',
                        xAxisIndex: [0, 1, 2, 3]
                    },
                ],
                xAxis: [
                    {
                        name: "里程",
                        type: "value",
                        scale: true,
                    },
                    {
                        name: "里程",
                        type: "value",
                        scale: true,
                        gridIndex: 1
                    },
                    {
                        name: "里程",
                        type: "value",
                        scale: true,
                        gridIndex: 2
                    },
                    {
                        name: "里程",
                        type: "value",
                        scale: true,
                        gridIndex: 3
                    },
                ],
                tooltip: {
                    trigger: 'axis'
                },
                yAxis: [
                    {
                        splitLine: {     //网格线
                            "show": false
                        }
                    },
                    {
                        gridIndex: 1,
                        splitLine: {     //网格线
                            "show": false
                        }
                    },
                    {
                        gridIndex: 2,
                        splitLine: {     //网格线
                            "show": false
                        }
                    },
                    {
                        gridIndex: 3,
                        splitLine: {     //网格线
                            "show": false
                        }
                    },
                ],
                grid: [
                    {
                        bottom: '80%',
                        show: false,
                    },
                    {
                        top: '25%',
                        height: '20%'
                    },
                    {
                        top: '50%',
                        height: '20%'
                    },
                    {
                        top: '75%',
                        height: '20%'
                    }
                ],
                series: [
                    {
                        name: '左轨向10' + fileNameList[0],
                        type: 'line',
                        smooth: true,
                        data: left10,
                        itemStyle: {
                            color: "#5470c6"
                        },
                    },
                    {
                        name: '右轨向10' + fileNameList[0],
                        type: 'line',
                        smooth: true,
                        data: right10,
                        itemStyle: {
                            color: "#5470c6"
                        },
                        xAxisIndex: 1,
                        yAxisIndex: 1
                    },
                    // {
                    //     name: '左轨向20',
                    //     type: 'line',
                    //     smooth: true,
                    //     data: left20
                    // },
                    // {
                    //     name: '右轨向20',
                    //     type: 'line',
                    //     smooth: true,
                    //     data: right20
                    // },
                    // {
                    //     name: '轨距',
                    //     type: 'line',
                    //     smooth: true,
                    //     data: guiju
                    // },
                    {
                        name: '左高低10' + fileNameList[0],
                        type: 'line',
                        smooth: true,
                        data: leftHigh10,
                        itemStyle: {
                            color: "#5470c6"
                        },
                        xAxisIndex: 2,
                        yAxisIndex: 2
                    },
                    {
                        name: '右高低10' + fileNameList[0],
                        type: 'line',
                        smooth: true,
                        data: righHigh10,
                        itemStyle: {
                            color: "#5470c6"
                        },
                        xAxisIndex: 3,
                        yAxisIndex: 3
                    },
                    // {
                    //     name: '左高低20',
                    //     type: 'line',
                    //     smooth: true,
                    //     data: leftHigh20
                    // },
                    // {
                    //     name: '右高低20',
                    //     type: 'line',
                    //     smooth: true,
                    //     data: righHigh20
                    // },
                    // {
                    //     name: '超高',
                    //     type: 'line',
                    //     smooth: true,
                    //     data: chaogao
                    // },
                    ...series2
                ]
            });
        },
        async getEquipInfo() {
            const res = await http.get("/demo/device/list.json?id=" + this.equipId);
            if (res && res.data && res.data.status === 200 && res.data.data.length > 0) {
                this.equipInfo = res.data.data[0];
                const stationList = Utils.stationList.filter(station => station.stationId == this.equipInfo.stationId);
                if (stationList.length > 0) { this.stationName = stationList[0].name; }
                const equipInfo = this.equipTypeList.find(item => item.id === this.equipInfo.type);
                if (equipInfo) {
                    if (!equipInfo.other) {
                        equipInfo.other = JSON.stringify({des: "", paramList: ""});
                    }
                    this.equipTypeInfo = { ...JSON.parse(equipInfo.other), name: equipInfo.type };
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

<style>
.full-modal .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
}


.full-modal .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
}

.full-modal .ant-modal-body {
    flex: 1;
}

.limit-height .ant-upload-list {
    height: 6.6rem;
    overflow: auto;
}
</style>