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
    <a-card title="站点设备信息图" style="width: 1027px" :bodyStyle="{ padding: '1px' }">
        <template #extra>
            <div v-if="mode === Mode.View" class="edit-row">
                <div @click="clickEdit">
                    <EditTwoTone style="font-size:1.6rem;" />编辑
                </div>
            </div>
            <div v-else class="edit-row">
                <div @click="clickAdd">
                    <PlusCircleTwoTone style="font-size:1.6rem;" />添加
                </div>
                <div @click="clickOk" style="margin-left: 2rem;">
                    <CheckCircleTwoTone style="font-size:1.6rem;" />完成
                </div>
                <div @click="clickPic" style="margin-left: 2rem;">
                    <PictureTwoTone style="font-size:1.6rem;" />上传底图
                </div>
            </div>
        </template>
        <div>
            <draggable v-if="mode === Mode.Edit"
                :style="{ 'background-image': 'url(' + (picFile.length > 0 ? Utils.filePrefix + picFile[0].id : '') + ')' }"
                class="drag-area" v-model="spotList" @end="dragEnd" item-key="id">
                <template #item="{ element }">
                    <div class="hot-item" @click="clickEditSpot(element)"
                        :style="{ 'left': element.position.x + 'px', 'top': element.position.y + 'px' }">
                        <FlagTwoTone style="font-size:1.6rem;" />
                        <span>{{ element.name }}</span>
                    </div>
                </template>
            </draggable>
            <div v-else
                :style="{ 'background-image': 'url(' + (picFile.length > 0 ? Utils.filePrefix + picFile[0].id : '') + ')' }"
                class="drag-area">
                <div v-for="element in spotList" :key="element.id" class="hot-item"
                    :style="{ 'left': element.position.x + 'px', 'top': element.position.y + 'px' }"
                    @click="clickSpot(element.id)">

                    <a-popover v-if="equipType === -1" :title="element.name" trigger="hover">
                        <template #content>
                            <p>设备类型：{{ equipTypeList.find(item => item.id === element.type).type }}</p>
                            <p v-if="element.lastFixTime">上次养修时间：{{ parseTime(element.lastFixTime) }}</p>
                            <p v-if="element.nextFixTime">下次养修时间：{{ parseTime(element.nextFixTime) }}</p>
                        </template>
                        <EnvironmentTwoTone style="font-size:1.6rem;" />
                        <span>{{ element.name }}</span>
                    </a-popover>
                    <a-popover v-else-if="equipType === element.type" :title="element.name" trigger="hover"
                        :open="popoverOpen">
                        <template #content>
                            <p>设备类型：{{ equipTypeList.find(item => item.id === element.type).type }}</p>
                            <p v-if="element.lastFixTime">上次养修时间：{{ parseTime(element.lastFixTime) }}</p>
                            <p v-if="element.nextFixTime">下次养修时间：{{ parseTime(element.nextFixTime) }}</p>
                        </template>
                        <EnvironmentTwoTone style="font-size:1.6rem;" />
                        <span>{{ element.name }}</span>
                    </a-popover>
                    <a-popover v-else :title="element.name" trigger="hover">
                        <template #content>
                            <p>设备类型：{{ equipTypeList.find(item => item.id === element.type).type }}</p>
                            <p v-if="element.lastFixTime">上次养修时间：{{ parseTime(element.lastFixTime) }}</p>
                            <p v-if="element.nextFixTime">下次养修时间：{{ parseTime(element.nextFixTime) }}</p>
                        </template>
                        <EnvironmentTwoTone style="font-size:1.6rem;" />
                        <span>{{ element.name }}</span>
                    </a-popover>
                </div>
            </div>
        </div>
    </a-card>
    <a-modal v-model:open="open" title="请上传底图" @ok="modalOk">
        <a-upload v-model:file-list="picFile" :max-count="1" accept="image/*" @change="handleChange" @remove="handleRemove"
            :data="{ deviceType: stationId, limit: 1, type: '3' }" :action="Utils.uploadUrl">
            <a-button>
                <upload-outlined></upload-outlined>
                上传底图文件
            </a-button>
        </a-upload>
    </a-modal>
    <a-modal v-model:open="spotEditOpen" title="请上传底图" @ok="spotEditModalOk">
        <a-form-item label="设备名称" name="name">
            <a-input v-model:value="spotEditData.name" style="width: 120px" />
        </a-form-item>
        <a-form-item label="设备类型" name="name">
            <a-select v-model:value="spotEditData.type" style="width: 120px">
                <a-select-option v-for="item in equipTypeList" :value="item.id" :key="item.id">{{ item.type
                }}</a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item label="删除设备" name="name">
            <a-button @click="clickDel">删除设备</a-button>
        </a-form-item>
    </a-modal>
</template>

<script lang="ts">
import { UploadChangeParam, UploadProps, message } from "ant-design-vue";
import http from "../../../util/http";
import draggable from 'vuedraggable'
import Utils from "../../../util/utils";
import _ from "lodash";
import moment from "moment";

interface EquipType {
    id: number;
    cycle: number;
    type: string;
    other: string,
}

/**设备点数据类型 */
interface SpotType {
    "id": number,
    "name": string,
    "stationId": 1,
    "type": number,
    "lastFixTime"?: string,
    "nextFixTime"?: string,
    "position": PositionType
}

interface PositionType {
    x: number,
    y: number
}

enum Mode {
    Edit,
    View
}

let spotDefaultValue = {
    id: 0,
    type: -1,
    stationId: '-1',
    name: "设备",
    position: {
        x: 100,
        y: 100
    },
};

export default {
    components: {
        draggable,
    },
    data() {
        return {
            curAddId: -1,
            open: false,
            spotEditOpen: false,
            spotEditData: undefined,
            popoverOpen: true,
            triggerMode: 0,  // 0悬浮；1直接显示
            /**设备点列表 */
            spotList: [
                // {
                //     "id": 1,
                //     "name": "1",
                //     "stationId": 1,
                //     "type": 1,
                //     "lastFixTime": "2024-01-22T08:54:48.000+0000",
                //     "nextFixTime": "2024-02-21T16:00:00.000+0000",
                //     "position": { x: 100, y: 100 }
                // }
            ] as SpotType[],
            stationId: "0",
            mode: Mode.View,
            Mode: Mode,
            Utils: Utils,
            picFile: ([]) as UploadProps['fileList'],
            equipType: -1,
            equipTypeList: [] as EquipType[],
        }
    },
    async created() {
        this.getData();

    },
    async updated() {
        this.getData();
    },
    methods: {
        async getData() {
            this.stationId = this.$route.params.id ? this.$route.params.id : "0";
            spotDefaultValue.stationId = this.stationId;
            await this.getEquipTypeList();
            await this.getPicFile();
            await this.getSpotList();
        },
        async getEquipTypeList() {
            const res = await http.get("/demo/deviceType/list.json");
            if (res && res.data && res.data.status === 200) {
                this.equipTypeList = res.data.data;
                spotDefaultValue.type = this.equipTypeList[0].id;
                this.typeChange();
            };
        },
        async getSpotList() {
            // this.
            const res = await http.get("/demo/device/list.json?stationId=" + this.stationId);
            if (res && res.data && res.data.status === 200) {
                const spotList = res.data.data;
                this.spotList = _.map(spotList, (item: SpotType) => {
                    return {
                        ...item,
                        position: JSON.parse(item.position)
                    }
                });
            }
        },
        async typeChange() {

        },
        clickSpot(equipId) {
            this.$router.push({ name: "equipInfo", params: { equipId: equipId } });
        },
        modalOk() {
            this.open = false;
        },
        async getPicFile() {
            // deviceType   当前站点id ； type: "3"底图
            const res1 = await http.get("/demo/file/list.json", { params: { deviceType: this.stationId, type: "3" } });
            if (res1 && res1.data && res1.data.status === 200) {
                if (res1.data.data.length > 0) {
                    this.picFile = [res1.data.data[0]];
                } else {
                    this.picFile = [];
                }
            }
        },
        parseTime(orgTime) {
            return moment(orgTime).format("YYYY-MM-DD hh:mm:ss");
        },
        handleChange(info: UploadChangeParam) {
            if (info.file.status === 'done') {
                message.success(`${info.file.name} 文件上传成功`);
                this.getPicFile();
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 文件上传失败`);
            }
        },
        async handleRemove(file) {
            const res = await http.get("/demo/file/delete.json", {
                params: {
                    id: +file.id,
                }
            });

            if (res.data.status === 200) {
                message.success(`${file.name} 文件删除成功`);
                this.getPicFile();
            }
        },
        dragEnd(evt) {
            console.log(evt);
            const itemEl = evt.item;
            const targetId = itemEl.__draggable_context.element.id;
            const newPosX = evt.originalEvent.offsetX;
            const newPosY = evt.originalEvent.offsetY;
            const targetItem = this.spotList.find(item => item.id === targetId);
            if (targetItem) {
                targetItem.position = { x: newPosX, y: newPosY };
            }
        },
        clickEdit() {
            this.mode = Mode.Edit;
        },
        clickPic() {
            this.open = true;
        },
        clickAdd() {
            const newSpotData = _.cloneDeep(spotDefaultValue);
            newSpotData.id = this.curAddId;
            this.curAddId--;
            this.spotList.push(newSpotData);
            this.spotEditData = newSpotData;
            this.spotEditOpen = true;
        },
        clickEditSpot(spot) {
            this.spotEditData = spot;
            this.spotEditOpen = true;
        },
        spotEditModalOk() {
            this.spotEditOpen = false;
            // this.spotList = this.spotList.filter(item => item.id!== this.spotEditData.id);
            // this.spotList.push(this.spotEditData);
        },
        async clickDel() {
            const id = this.spotEditData.id;
            if (id > 0) {
                const res = await http.get("/demo/device/delete.json", {
                    params: {
                        id: id,
                    }
                });
                if (res.data.status === 200) {
                    message.success("删除成功");
                    this.spotList.splice(this.spotList.findIndex(item => item.id === id), 1);
                    this.spotEditOpen = false;
                }
            } else {
                this.spotList.splice(this.spotList.findIndex(item => item.id === id), 1);
                message.success("删除成功");
                this.spotEditOpen = false;
            }
        },
        async clickOk() {
            const spotList = _.cloneDeep(this.spotList);
            const requestList = [];
            spotList.forEach(spot => {
                //  增
                if (spot.id < 0) {
                    delete spot.id;
                    const data = { ...spot, stationId: +this.stationId, position: JSON.stringify(spot.position) };
                    const request = http.post("/demo/device/create.json", data);
                    requestList.push(request);
                    //  改
                } else {
                    const data = { ...spot, stationId: +this.stationId, position: JSON.stringify(spot.position) };
                    const request = http.post("/demo/device/update.json", data);
                    requestList.push(request);
                    //  删
                }
                // else {
                //     const request = http.get("/demo/device/delete.json?id=" + (-spot.id));
                //     requestList.push(request);
                // }
            });
            const res = await Promise.all(requestList);
            if (res.every(item => item.data.status === 200)) {
                message.success("操作成功");
                this.mode = Mode.View;
            } else {
                message.error("操作失败");

            }
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
    position: relative;
    width: 1024px;
    height: 768px;
    background-size: contain;
}

.hot-item {
    position: absolute;
}

.ant-card-body {
    padding: 1px;
}

.edit-row {
    display: flex;
}
</style>
