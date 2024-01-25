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
    <a-card title="站点设备信息图" style="width: 1024px" :bodyStyle="{padding: '0px'}">
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
            <draggable :style="{'background-image':'url(' + (picFile.length > 0 ? Utils.filePrefix + picFile[0].id: '') + ')'}" class="drag-area" v-model="spotList" @end="dragEnd" item-key="id">
                <template #item="{ element }">
                    <div class="hot-item" :style="{ 'left': element.position.x + 'px', 'top': element.position.y + 'px' }">
                        <FlagTwoTone style="font-size:1.6rem;" />
                        <span>{{ element.name }}</span>
                    </div>
                </template>
            </draggable>
        </div>
    </a-card>
    <a-modal v-model:open="open" title="请上传底图" @ok="modalOk">
        <a-upload v-model:file-list="picFile" :max-count="1" accept="image/*" @change="handleChange"
            @remove="handleRemove" :data="{ deviceType: stationId, limit: 1, type: '3' }" :action="Utils.uploadUrl">
            <a-button>
                <upload-outlined></upload-outlined>
                上传底图文件
            </a-button>
        </a-upload>
    </a-modal>
</template>

<script lang="ts">
// import { EditFilled } from "@ant-design/icons-vue";
import { UploadChangeParam, UploadProps, message } from "ant-design-vue";
import http from "../../../util/http";
import draggable from 'vuedraggable'
import Utils from "../../../util/utils";

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
    "lastFixTime": string,
    "nextFixTime": string,
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

export default {
    components: {
        draggable,
    },
    data() {
        return {
            open: false,
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
        this.stationId = this.$route.params.id?this.$route.params.id:"0";
        await this.getEquipTypeList();
        await this.getPicFile();
    },
    methods: {
        async getEquipTypeList() {
            const res = await http.get("/demo/deviceType/list.json");
            if (res && res.data && res.data.status === 200) {
                this.equipTypeList = res.data.data;
                // this.equipType = this.equipTypeList[0].id;
                this.typeChange();
            };
        },

        async typeChange() {

        },
        modalOk() {
            this.open = false;
        },
        async getPicFile() {
            // deviceType   当前站点id ； type: "3"底图
            const res1 = await http.get("/demo/file/list.json", { params: { deviceType: this.stationId, type: "3" } });
            if (res1 && res1.data && res1.data.status === 200 && res1.data.data.length > 0) {
                this.picFile = [res1.data.data[0]];
            }
        },
        handleChange(info: UploadChangeParam){
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
            // const newSpot = {
            //     "id": 1,
            //     "name": "1",
            //     "stationId": 1,
            //     "type": 1,
            //     "lastFixTime": "2024-01-22T08:54:48.000+0000",
            //     "nextFixTime": "2024-02-21T16:00:00.000+0000",
            //     "position": { x: 100, y: 100 }
            // } as SpotType;
            // this.spotList.push(newSpot);
        },
        clickOk() {
            this.mode = Mode.View;
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
    background-size:contain;
}

.hot-item {
    position: absolute;
}

.ant-card-body {
    padding: 0;
}

.edit-row {
    display: flex;
}
</style>
