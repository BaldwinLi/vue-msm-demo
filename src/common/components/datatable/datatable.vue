<template>
    <div style="height: 100%; width: 100%;">
        <el-menu theme="dark" style="height: 5.5rem" class="el-menu-demo" mode="horizontal">
            <div class="pull-left">
                <p class="navbar-brand" style="color:#fff">
                    {{title}}
                </p>
            </div>
            <el-button-group style="float: right;margin:1rem">
                <el-button v-if="buttonGroup.add" type="primary" @click="addRowCallBack">
                    <i class="el-icon-plus"></i>
                    {{i18n['form_add']}}
                </el-button>
                <el-button v-if="buttonGroup.refresh" :disabled="startLoading" type="primary" @click="refreshTable">
                    <i v-if="startLoading" class="el-icon-loading"></i>
                    <i v-if="!startLoading" class="iconfont alibaba-refresh"></i>
                    {{i18n['refresh']}}
                </el-button>
                <el-tooltip v-if="buttonGroup.copy" :content="copyTooltipContent" placement="bottom" hide-after="2000">
                    <el-button type="primary" @click="copy" @mouseleave.native="tooltipReset">
                        <i class="iconfont alibaba-copy">&nbsp</i>{{i18n['copy']}}
                    </el-button>
                </el-tooltip>
                <el-button v-if="buttonGroup.excl" type="primary" @click="exportCVS">
                    <i class="iconfont alibaba-exl">&nbsp</i>{{i18n['export_excl']}}
                </el-button>
                <el-button v-if="buttonGroup.pdf" type="primary" @click="exportPDF">
                    <i class="iconfont alibaba-pdf">&nbsp</i>{{i18n['export_pdf']}}
                </el-button>
                <el-button v-if="buttonGroup.print" type="primary" @click="printData">
                    <i class="iconfont alibaba-print">&nbsp</i>{{i18n['print']}}
                </el-button>
            </el-button-group>
        </el-menu>
        <el-table :data="rows" border v-loading="startLoading" :element-loading-text="i18n['hard_loading']" style="width: 100%" :row-class-name="tableRowClassName">
            <el-table-column header-align="center" v-for="(column, index) in columns" :key="index.toString()" :prop="getColumnProp(column)" :label="column.label" :width="column.width" :render-header="column.renderHeader">
                <template scope="scope">
                    <el-button v-if="column.type==='hyperlink'" @click.native.prevent="column.on.click(scope.row)" type="text" size="small">
                        {{scope.row[column.id]}}
                    </el-button>
                    <el-tag v-if="column.type==='tag' && !!trimStr(scope.row[column.id])" :type="(column.colorMap &&　column.colorMap[scope.row[column.id]]) || 'primary'" close-transition>
                        <i v-if="!column.filter">{{scope.row[column.id]}}</i>
                        <i v-if="column.filter && column.filter.func==='lookup'">{{scope.row[column.id] | lookup(...column.filter.params)}}</i>
                    </el-tag>
                    <el-switch v-if="column.type==='switch'" 
                    v-model="scope.row[column.id]" 
                    :on-value="column.valueMap && column.valueMap['onValue']"
                    :off-value="column.valueMap && column.valueMap['offValue']"
                    @change="column.on['change'](scope.row)"
                    ></el-switch>
                    <el-row v-if="column.type==='operation'">
                        <el-col>
                            <el-button v-for="(elem, index) in column.groups" v-if="elem.isShow ? elem.isShow(scope.row) : true" :type="elem.color" :key="index.toString()" size="small" @click="elem.on(scope.row)">
                                <i v-if="elem.icon" :class="elem.icon">&nbsp</i>
                                {{elem.label}}
                            </el-button>
                        </el-col>
                    </el-row>
                    <i v-if="!column.type" :class="column.icon||''">{{scope.row[column.id]}}</i>
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
import { copyToClipboard, exportCSVFile, exportPDFFile, printTableData } from '@/common/components/utils';

export default {
    name: 'zte-data-table',
    data() {
        return {
            rows: [],
            page: 1,
            size: 5,
            i18n: Lang(),
            copyTooltipContent: Lang()['click_copy_to_clipboard']
        }
    },
    props: {
        title: {
            type: String,
            default: ''
        },
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
        buttonGroup: {
            type: Object,
            default() {
                return {
                    add: false,
                    refresh: true,
                    copy: true,
                    excl: true,
                    pdf: false,
                    print: true
                };
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
        addRowCallBack: {
            type: Function,
            default() {
                window.Vue.prototype.$alert(Lang()['func_not_assign']);
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
            if (this.staticPagination) this.refreshTableData(this.currentPage, this.pageSize);
            else this.rows = newData || [];
        },
        currentPage(newPage) {
            this.page = newPage;
        },
        pageSize(newSize) {
            this.size = newSize;
        }
    },
    computed: {
        tableRowClassName(row, index) {
            return row.class || '';
        },
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
            if (refresh) this.$emit('pageChange')
            else　this.rows = this.data.slice((page - 1) * size, (page - 1) * size + size)
        },
        refreshTable() {
            this.refreshTableData(this.currentPage, this.pageSize, true)
        },
        copy(event) {
            copyToClipboard(event, {
                header: this.columns,
                body: this.data
            }, (result) => {
                this.copyTooltipContent = this.i18n[result];
            })
        },
        exportCVS(event) {
            exportCSVFile(event, {
                header: this.columns,
                body: this.data
            }, (result) => {
                this.$message.error(this.i18n[result]);
            })
        },
        exportPDF() {
            exportPDFFile(event, {
                header: this.columns,
                body: this.data
            }, (result) => {
                this.$message.error(this.i18n[result]);
            })
        },
        printData(event) {
            printTableData(event, {
                header: this.columns,
                body: this.data
            });
        },
        tooltipReset() {
            setTimeout(() => {
                this.copyTooltipContent = this.i18n['click_copy_to_clipboard'];
            }, 2000);
        },
        trimStr(str) {
            if(!!str&&str!==0)  return _.trim(str);
            else {
                if(str === 0) return 0;
                else return '';
            }
        }
    },
    mounted() {
        this.size = this.pageSize;
     }
}
</script>
