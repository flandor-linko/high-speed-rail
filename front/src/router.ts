
import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('./pages/view/Home.vue'),
        children: [
            {
                path: '/',
                name: 'homeInfo',
                component: () => import('./pages/view/homeInfo/HomeInfo.vue')
            },
            {
                path: '/station/:id/:typeId',
                name: 'station',
                component: () => import('./pages/view/station/Station.vue'),
            },
            {
                path: '/station/:id/equipInfo/:equipId/:typeId',
                name: 'equipInfo',
                component: () => import('./pages/view/equipInfo/EquipInfo.vue')
            },
        ]
    },
    {
        path: '/equip',
        name: 'EquipIndex',
        component: () => import('./pages/edit/EquipIndex.vue'),
        redirect: '/equip/stationMgt',
        children: [
            {
                path: '/equip/stationMgt',
                name: 'stationMgt',
                component: () => import('./pages/edit/StationMgt.vue')
            },
            {
                path: '/equip/equipTypeMgt',
                name: 'equipTypeMgt',
                component: () => import('./pages/edit/EquipTypeMgt.vue'),
                // children: [
                //     {
                //         path: '/equip/equipTypeMgt/add',
                //         name: 'equipTypeAdd',
                //         component: () => import('./pages/edit/Equip.vue')
                //     },
                //     {
                //         path: '/equip/equipTypeMgt/edit/:id',
                //         name: 'equipTypeEdit',
                //         component: () => import('./pages/edit/Equip.vue')
                //     },
                // ]
            },
            {
                path: '/equip/equipTypeMgt/add',
                name: 'equipTypeAdd',
                component: () => import('./pages/edit/Equip.vue')
            },
            {
                path: '/equip/equipTypeMgt/edit/:id',
                name: 'equipTypeEdit',
                component: () => import('./pages/edit/Equip.vue')
            },
        ]
    }
];

const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

export default router;