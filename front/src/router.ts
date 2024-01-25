
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
                path: '/station/:id',
                name: 'station',
                component: () => import('./pages/view/station/Station.vue'),
            },
            {
                path: '/equipInfo/:equipId',
                name: 'equipInfo',
                component: () => import('./pages/view/equipInfo/EquipInfo.vue')
            },
        ]
    },
    {
        path: '/equip',
        name: 'Equip',
        component: () => import('./pages/edit/Equip.vue')
    }
];

const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

export default router;