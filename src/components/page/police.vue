<template>
    <div class="pilice-page">
        <el-table :data="dataList" height="95%" border
            :style="{ fontSize: 15 + 'px', width: '100%' }" highlight-current-row :row-style="{
                height: 50 + 'px',
                background: '#0b164b',
                color: '#fff',
                'font-size': 16 + 'px',
                'border-bottom': '1px solid #4C6FAA',
            }" :header-cell-style="{
    background: '#0A3275',
    color: '#fff',
    height: 50 + 'px',
    padding: '0',
    'font-size': 16 + 'px',
}" tooltip-effect="dark">
            <template slot="empty">
                <span>暂无数据</span>
            </template>
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column prop="value" label="报警信息" :show-overflow-tooltip="true"></el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    props: ['dataList'],
}
</script>
  
  
<style scoped lang="less">
.pilice-page {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
}
</style>
<style lang="less">
.pilice-page {
    .el-table__body {
        width: 100% !important;
    }

    .el-table__cell .gutter {
        display: none;
    }

    .el-table--enable-row-hover .el-table__body tr:hover>td,
    .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
    .el-table__body tr.current-row>td,
    .el-table__body tr.hover-row.current-row>td,
    .el-table__body tr.hover-row.el-table__row--striped.current-row>td,
    .el-table__body tr.hover-row.el-table__row--striped>td,
    .el-table__body tr.hover-row>td {
        background-color: #0b164b;
        border-color: #4C6FAA;
    }

    .el-table th,
    .el-table tr {
        background-color: #050b25;
        border-color: #4C6FAA;
    }

    .el-table--border,
    .el-table--group {
        border-color: #4C6FAA;
    }

    .el-table--border::after,
    .el-table--group::after,
    .el-table::before {
        background-color: #4C6FAA;
    }

    /**
改变表格内竖线颜色
 */
    .el-table--border td,
    .el-table--border th,
    .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
        border-right: 1px solid #4C6FAA !important;
    }

    /**
改变表格内行线颜色
 */
    .el-table td,
    .el-table th.is-leaf {
        border-bottom: 1px solid #4C6FAA !important;
    }

    .el-table thead tr th {
        border-color: #4C6FAA;
    }

    .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 5px;
        /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }

    .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 3px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #4C6FAA;
    }

    .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 3px;
        background: #0b164b;
    }

    .el-table th.gutter {
        display: none;
        width: 0
    }

    .el-table colgroup col[name='gutter'] {
        display: none;
        width: 0;
    }

    .el-table__body {
        width: 100% !important;
    }
}
</style>