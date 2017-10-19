<template>
    <div style="height: 100%; width: 100%;">
        <el-button-group style="float: right;">
            <el-button :disabled="startLoading" type="primary" @click="refreshTable">
                <i v-if="startLoading" class="el-icon-loading"></i>
                <i v-if="!startLoading" class="iconfont alibaba-refresh"></i>
                {{i18n['refresh']}}
            </el-button>
            <el-button type="primary">
                <i class="iconfont alibaba-copy">&nbsp</i>{{i18n['copy']}}
            </el-button>
            <el-button type="primary">
                <i class="iconfont alibaba-exl">&nbsp</i>{{i18n['export_excl']}}
            </el-button>
            <el-button type="primary">
                <i class="iconfont alibaba-print">&nbsp</i>{{i18n['print']}}
            </el-button>
        </el-button-group>
        <el-table :data="rows" border v-loading="startLoading" :element-loading-text="i18n['hard_loading']" style="width: 100%" :row-class-name="tableRowClassName">
            <el-table-column header-align="center" v-for="(column, index) in columns" :key="index.toString()" :prop="getColumnProp(column)" :label="column.label" :width="column.width">
                <template scope="scope">
                    <el-button v-if="column.type==='hyperlink'" @click.native.prevent="column.on.click(scope.row)" type="text" size="small">
                        {{scope.row[column.id]}}
                    </el-button>
                    <el-tag v-if="column.type==='tag'" type="primary" close-transition>
                        <i v-if="!column.filter">{{scope.row[column.id]}}</i>
                        <i v-if="column.filter.func==='lookup'">{{scope.row[column.id] | lookup(...column.filter.params)}}</i>
                    </el-tag>
                    <el-row v-if="column.type==='operation'">
                        <el-col>
                            <el-button v-for="(elem, index) in column.groups" :type="elem.color" :key="index.toString()" size="small" @click="elem.on(scope.row)">
                                <i v-if="elem.icon" :class="elem.icon">&nbsp</i>
                                {{elem.label}}
                            </el-button>
                        </el-col>
                    </el-row>
                    <i v-if="!column.type">{{scope.row[column.id]}}</i>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="pageSizes" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
    </div>
</template>

<script>
import { Lang } from '@/common/data-i18n/initI18n';
import { lookup } from '@/common/filters/filters';

export default {
    name: 'zte-data-table',
    data() {
        return {
            rows: [],
            page: 1,
            size: 5,
            i18n: Lang()
        }
    },
    props: {
        columns: {
            type: Array,
            default() {
                return [];
            }
        },
        data: {
            type: Array,
            default() {
                return [];
            }
        },
        startLoading: {
            type: Boolean,
            default: false
        },
        staticPagination: {
            type: Boolean,
            default: false
        },
        currentPage: {
            type: Number,
            default: 1
        },
        totalCount: {
            type: Number,
            default: 0
        },
        pageSize: {
            type: Number,
            default: 5
        },
        pageSizes: {
            type: Array,
            default() {
                return [5, 10, 20, 30, 40, 50];
            }
        },
        refreshCallback: {
            type: Function,
            default() {
                console.log('refresh_callback is not assigned.');
            }
        }
    },
    filters: {
        lookup
    },
    watch: {
        data(newData) {
            if (this.staticPagination) this.refreshTableData(this.currentPage, this.pagePize);
            else this.rows = newData || [];
        },
        currentPage(newPage) {
            this.page = newPage;
        },
        pageSize(newSize){
            this.size = newSize;
        }
    },
    computed: {
        tableRowClassName(row, index) {
            return row.class || '';
        }
    },
    methods: {
        getColumnProp(column) {
            if (column === '$index') return 'index';
            else if (['selection', 'expand'].includes(column.type)) return column.type;
            else return column.id;
        },
        handleSizeChange(size) {
            this.size = size;
            if (this.staticPagination)
                this.refreshTableData(this.currentPage, size);
            else this.$emit('pageChange', {
                page: this.currentPage,
                size
            });
        },
        handleCurrentChange(page) {
            this.page = page;
            if (this.staticPagination)
                this.refreshTableData(page, this.pageSize);
            else this.$emit('pageChange', {
                page,
                size: this.pageSize
            });
        },
        refreshTableData(page, size, refresh) {
            if (refresh) this.$emit('pageChange');
            else this.rows = this.config.data.slice((page - 1) * size, (page - 1) * size + size);
        },
        refreshTable() {
            this.refreshTableData(this.currentPage, this.pageSize, true)
        }
    },
    mounted() { }
}
</script>
