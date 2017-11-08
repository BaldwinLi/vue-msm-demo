<template>
    <div style="height: 100%; width: 100%;">
        <el-row>
            <el-col :span="24">
                <el-form :model="datasourceQueryForm" label-position="left" ref="datasourceQueryForm" label-width="10rem" class="demo-form-inline">
                    <el-row :gutter="10">
                        <el-col :span="6">
                            <el-form-item :label="i18n['data_source_nm']" prop="dataSourceNm">
                                <el-col :span="20">
                                    <el-input v-model="datasourceQueryForm.dataSourceNm"></el-input>
                                </el-col>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item :label="i18n['data_source_type']" prop="dataSourceType">
                                <el-select v-model="datasourceQueryForm.dataSourceType" clearable :placeholder="i18n['please_select']">
                                    <el-option v-for="(item, index) in mapList['DATA_SOURCE_TYPE']" :key="index" :label="item.value" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item :label="i18n['data_source_call_type']" prop="dataSourceCallType">
                                <el-select v-model="datasourceQueryForm.dataSourceCallType" clearable :placeholder="i18n['please_select']">
                                    <el-option v-for="(item, index) in mapList['DATA_SOURCE_CALL_TYPE']" :key="index" :label="item.value" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item :label="i18n['form_status']" prop="dataSourceStatus">
                                <el-select v-model="datasourceQueryForm.dataSourceStatus" clearable :placeholder="i18n['please_select']">
                                    <el-option v-for="(item, index) in mapList['DATA_SOURCE_STATUS']" :key="index" :label="item.value" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item style="float:right;">
                            <el-button :disabled="startLoading" type="primary" @click="refreshDataSourceList()">
                                <i v-if="startLoading" class="el-icon-loading"></i>
                                <i v-if="!startLoading" class="el-icon-search"></i>
                                {{i18n['form_query']}}
                            </el-button>
                            <el-button @click="onReset('datasourceQueryForm')">
                                <i class="iconfont alibaba-refresh"></i>
                                {{i18n['reset']}}
                            </el-button>
                        </el-form-item>
                    </el-row>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <zte-data-table :buttonGroup="{
                    add: true,
                    refresh: true,
                    copy: true,
                    excl: true,
                    pdf: false,
                    print: true
                }" :title="tableTitle" :columns="columns" :data="data" :start-loading="startLoading" :total-count="totalCount" :page-sizes="[5]" :staticPagination="true" @pageChange="refreshDataSourceList">
                </zte-data-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import zteDataTable from '@/common/components/datatable/datatable';
import { DATA_SOURCE_STATUS, DATA_SOURCE_CALL_TYPE, DATA_SOURCE_TYPE } from '@/common/dataModel';
import { Lang } from '@/common/data-i18n/initI18n';
const i18n = Lang();
export default {
    name: 'data-source',
    components: {
        zteDataTable
    },
    data() {
        return {
            startLoading: false,
            tableTitle: Lang()['form_datasource_list'],
            pageSize: 5,
            totalCount: 0,
            currentPage: 1,
            columns: [],
            data: [],
            datasourceQueryForm: {
                dataSourceCallType: '',
                dataSourceNm: '',
                dataSourceStatus: '',
                dataSourceType: ''
            },

            i18n,
            mapList: {
                DATA_SOURCE_STATUS,
                DATA_SOURCE_CALL_TYPE,
                DATA_SOURCE_TYPE
            }
        }
    },
    computed: {
        ...mapGetters([
            'appContextPath',
            'isLocal',
            'loginUser'
        ])
    },
    methods: {
        refreshDataSourceList(page, size) {
            const scope = this;
            this.startLoading = true;
            this.$http.post(`${this.appContextPath}formman/FormDataSourceManageT/getList.serv`,
                {
                    bo: this.datasourceQueryForm,
                    sort: 'createTime',
                    order: 'desc'
                    
                },
            ).then(success => {
                if (success) {
                    scope.startLoading = false;
                    if (success.data && success.data.bo) {
                        scope.data = success.data.bo;
                        scope.totalCount = parseInt(success.data.bo && success.data.bo.length);
                    }
                }
            }, error => {
                scope.startLoading = false;
            });
        },
        onReset(formName) {
            this.$refs[formName].resetFields();
        },
        publish(row) {
            const scope = this;
            this.$confirm(this.i18n['confirm_publish_datasource'], this.i18n['reminder'], {
                confirmButtonText: this.i18n['form_confirm'],
                cancelButtonText: this.i18n['form_cancel'],
                type: 'warning'
            }).then(() => {
                scope.startLoading = true;
                row.enableFlag = 'N';
                scope.$http.post(`${scope.appContextPath}formman/FormDataSourceManageT/publish.serv`,
                    row
                ).then(
                    success => {
                        if (success) {
                            scope.$message({
                                type: 'success',
                                message: scope.i18n['operate_success']
                            });
                            scope.refreshDataSourceList();
                        }
                        scope.startLoading = false;
                    },
                    error => { scope.startLoading = false }
                );
            });
        },
        delete(row) {
            const scope = this;
            row.enableFlag = 'N';
            this.$confirm(this.i18n['confirm_delete'], this.i18n['reminder'], {
                confirmButtonText: this.i18n['form_confirm'],
                cancelButtonText: this.i18n['form_cancel'],
                type: 'warning'
            }).then(() => {
                scope.startLoading = true;
                scope.$http.post(`${scope.appContextPath}formman/FormDataSourceManageT/delete.serv`,
                    row
                ).then(success => {
                    if (success) {
                        scope.$message({
                            type: 'success',
                            message: scope.i18n['delete_success']
                        });
                        scope.refreshDataSourceList();
                    }
                    scope.startLoading = false;
                }, error => {
                    scope.startLoading = false;
                });
            });
        },
        openDialog () {}
    },
    mounted() {
        const scope = this;
        this.columns = [
            {
                id: 'dataSourceId',
                label: this.i18n['form_rownum']
            },
            {
                id: 'dataSourceNm',
                label: this.i18n['data_source_nm']
            },
            {
                id: 'dataSourceType',
                label: this.i18n['data_source_type'],
                type: 'tag',
                colorMap: {
                    '0': 'success',
                    '1': 'primary',
                    '2': 'danger',
                    '3': 'warning'
                },
                filter: {
                    func: 'lookup',
                    params: ['DATA_SOURCE_TYPE']
                }
            },
            {
                id: 'dataSourceCallType',
                label: this.i18n['data_source_call_type'],
                type: 'tag',
                colorMap: {
                    '0': 'success',
                    '1': 'primary'
                },
                filter: {
                    func: 'lookup',
                    params: ['DATA_SOURCE_CALL_TYPE']
                }
                   
            },
            {
                id: 'dataSourceStatus',
                label: this.i18n['form_status'],
                type: 'tag',
                colorMap: {
                    '0': 'danger',
                    '1': 'success',
                },
                filter: {
                    func: 'lookup',
                    params: ['DATA_SOURCE_STATUS']
                }
            },
            {
                id: 'createBy',
                label: this.i18n['form_create_by']
            },
            {
                id: 'createTime',
                label: this.i18n['form_create_time'],
                icon: 'el-icon-time',
                renderHeader(h, option) {
                    return h('i', {
                                attrs: {
                                    class: 'el-icon-time'
                                }
                        }, ' ' + option.column.label
                    );
                }
            },
            {
                label: i18n['form_operate'],
                width: '300',
                type: 'operation',
                groups: [
                    {
                        type: 'button',
                        color: 'primary',
                        label: i18n['edit'],
                        icon: 'el-icon-search',
                        isShow(row) {
                            return row.dataSourceStatus === '1'
                        },
                        on(row) {
                            scope.openDialog(row);
                        }
                    },
                    {
                        type: 'button',
                        color: 'success',
                        label: i18n['edit'],
                        icon: 'el-icon-edit',
                        isShow(row) {
                            return row.dataSourceStatus === '0'
                        },
                        on(row) {
                            scope.openDialog(row);
                        }
                    },
                    {
                        type: 'button',
                        color: 'danger',
                        icon: 'iconfont alibaba-delete',
                        label: i18n['delete'],
                        isShow(row) {
                            return row.dataSourceStatus === '0'
                        },
                        on: ((row) => {
                            this.delete(row);
                        }).bind(this)
                    },
                    {
                        type: 'button',
                        color: 'warning',
                        icon: 'el-icon-check',
                        label: i18n['publish'],
                        isShow(row) {
                            return row.dataSourceStatus === '0'
                        },
                        on: ((row) => {
                            this.publish(row);
                        }).bind(this)
                    }
                ]
            }
        ];
        this.refreshDataSourceList();
    }
}
</script>
