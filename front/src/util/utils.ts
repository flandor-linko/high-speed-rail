import http from "./http";

const Utils = {
    /**下载文件接口 */
    filePrefix: `${import.meta.env.PROD ? '' : '/demo'}/file/download.json?id=`,
    /**上传文件接口 */
    uploadUrl: `${import.meta.env.PROD ? '' : '/demo'}/file/upload.json`,
    /**站点列表 */
    stationList: [],
    colorList: [
        "#f50",
        "#87d068",
        "#2db7f5",
        "#f50",
        "#EE30A7",
        "#BF3EFF",
        "#DAA520",
        "#836FFF",
        "#00EE00",
        "#8B1C62",
        "#436EEE",
        "#B23AEE",
        "#CD6600",
        "#EE7AE9",
        "#FF7256",
        "#33ffcc",
        "#6666ff",
        "#99ffff",
        "#660099",
        "#660033",
        "#663300",
    ],
    equipTypeList: [],
    getEquipTypeList: async function () {
        const res1 = await http.get("/demo/deviceType/list.json");
        if (res1 && res1.data && res1.data.status === 200) {
            const equipTypeList = res1.data.data;
            this.equipTypeList = equipTypeList;
        };
    }
}

export default Utils;
