
import Main from "@/components/main"
// const homePage = () =>
// import(`../viewss/homePage/homePage`);
// const Echarts = () =>
// import(`../viewss/homeEchart/homeEchart`);
// const map = () =>
// import(`../viewss/map/map`)
// const desktop = () =>
// import(`../viewss/desktop/desktop`)
// const power = () =>
// import(`../viewss/power/power`)
// const user = () =>
// import(`../viewss/userMageme/userMageme`)
// const konbi = () =>
// import(`../viewss/outside/outside`)
// const alert = () =>
// import(`../viewss/alert/alert`)
// const customTable = () =>
// import(`../viewss/customTable/customTable`)
// const ListPage = () => 
// import('@/view/list-page/list-page')
// const authority = () =>
// import(`@/view/authority/authority`)
// const UserManagent = () => import(`@/view/user-managent/user-managent.vue`)
// const MapView = () => import('@/view/map-view/map-view.vue')


export const routers = [
    {
        path: '/',
        redirect: '/HomePage'
    },
    {
        path: '/',
        component: () => import('../components/common/Home.vue'),
        meta: { title: '自述文件' },
        children:
            [
                {
                    path: '/HomePage',
                    // component:desktop,
                    component: resolve => require(['../viewss/desktop/desktop.vue'], resolve),
                    meta: { title: '首页1' }
                },
                {
                    path: '/ListPage',
                    // component:homePage,
                    component: resolve => require(['../viewss/homePage/homePage.vue'], resolve),
                    meta: { title: '列表页' }
                },
                {
                    path: '/Authority',
                    // component:power,
                    component: resolve => require(['../viewss/power/power.vue'], resolve),
                    meta: { title: '权限管理' }
                },
                {
                    path: '/WarehouseMap',
                    // component:map,
                    component: resolve => require(['../viewss/map/map.vue'], resolve),
                    meta: { title: '地图' }
                },
                {
                    path: '/ChartPage',
                    // component:Echarts,
                    component: resolve => require(['../viewss/homeEchart/homeEchart.vue'], resolve),
                    meta: { title: '图表' }
                },
                {
                    path: '/konbi',
                    // component:konbi,
                    component: resolve => require(['../viewss/outside/outside.vue'], resolve),
                    meta: { title: '外部页面' }
                },
                {
                    path: '/alert',
                    // component:alert,
                    component: resolve => require(['../viewss/alert/alert.vue'], resolve),
                    meta: { title: '报警页面' }
                },
                {
                    path: '/user',
                    // component:user,
                    component: resolve => require(['../viewss/userMageme/userMageme.vue'], resolve),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/customTable',
                    component: resolve => require(['../viewss/customTable/customTable.vue'], resolve),
                    // component:customTable,
                    meta: { title: '自定义表格' }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                },
            ]
    },
    {
        path: '/login',
        // component: resolve => require(['../components/page/Login.vue'], resolve)
        component: resolve => require(['../components/login/Login.vue'], resolve)
    },
    {
        path: '/kanban1',
        component: resolve => require(['../components/page/kanban1.vue'], resolve)
    },
    {
        path: '/kanban2',
        component: resolve => require(['../components/page/kanban2.vue'], resolve)
    },
    {
        path: '/kanban3',
        component: resolve => require(['../components/page/kanban3.vue'], resolve)
    },
    {
        path: '/shanhe',
        component: resolve => require(['../components/page/shanhe.vue'], resolve)
    },
    {
        path: '/weitai1',
        component: resolve => require(['../components/page/shanhe2.vue'], resolve)
    },
    {
        path: '*',
        redirect: '/404'
    },

    {
        path: '/home',
        component: Main,
        meta: { title: '首页' },
        children: [
            {
                path: '/HomePage1',
                meta: { title: '首页' },
                //  component: resolve => require(['../components/page/Login.vue'], resolve)
                component: resolve => require(['../view/home/home.vue'], resolve)
            },
            {
                path: '/ListPage1',
                // component:ListPage,
                component: resolve => require(['@/view/list-page/list-page.vue'], resolve),
                meta: { title: '列表页' }
            },
            {
                path: '/WarehouseMap1',
                // component:MapView,
                component: resolve => require(['@/view/map-view/map-view.vue'], resolve),
                meta: { title: '地图' }
            },
            {
                path: '/WarehouseMap21',
                // component:MapView,
                component: resolve => require(['@/view/map-view/map-view2.vue'], resolve),
                meta: { title: '地图2' }
            },
            {
                path: '/WarehouseMap31',
                // component:MapView,
                component: resolve => require(['@/view/map-view/map-view3.vue'], resolve),
                meta: { title: '地图3' }
            },
            {
                path: '/user1',
                // component:UserManagent,
                component: resolve => require(['@/view/user-managent/user-managent.vue'], resolve),
                meta: { title: '用户管理' }
            },
            {
                path: '/Authority1',
                // component:authority,
                component: resolve => require(['@/view/authority/authority.vue'], resolve),
                meta: { title: '权限管理' }
            },
            {
                path: '/customTable1',
                // component:customTable,
                component: resolve => require(['../view/custom-table/custom-table.vue'], resolve),
                meta: { title: '自定义表格' }
            },
            {
                path: '/ContainerHeatMap1',
                // component:alert,
                component: resolve => require(['@/view/containerHeat-map/containerHeat-map.vue'], resolve),
                meta: { title: '热力图' }
            },
            {
                path: '/Chart1',
                // component:alert,
                component: resolve => require(['@/view/currency-echarts/currency-echarts.vue'], resolve),
                meta: { title: '图表页' }
            },
            {
                path: '/4041',
                component: resolve => require(['../components/main/components/tips/404.vue'], resolve),
                meta: { title: '404' }
            },
            {
                path: '/alert1',
                // component:alert,
                component: resolve => require(['../viewss/alert/alert.vue'], resolve),
                meta: { title: '报警页面' }
            },
        ]

    },

]