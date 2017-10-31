
<template>
    <div style="height: 100%; width: 100%;">
        <el-row>
            <el-col :span="24">
                <zte-data-table 
                :staticPagination="true" 
                :title="tableTitle" 
                :columns="columns" 
                :data="data" 
                :start-loading="startLoading" 
                :total-count="totalCount" 
                :page-size="pageSize" 
                @pageChange="refreshResourceList"
                :buttonGroup="{
                    add: true,
                    refresh: true,
                    copy: true,
                    excl: true,
                    pdf: false,
                    print: true
                }"
                :addRowCallBack="openResourceDialog">
                </zte-data-table>
            </el-col>
        </el-row>
        <el-dialog ref="resourceDialog" :title="resourceTitle" :visible.sync="resourceDialogVisible">
            <resource-dialog :params="dialogParams" :visible.sync="resourceDialogVisible" :close="resourceDialogClose" :isEditDialog="isEditDialog"></resource-dialog>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import zteDataTable from '@/common/components/datatable/datatable';
import resourceDialog from './dialog/resourceDialog';
import { Lang } from '@/common/data-i18n/initI18n';

export default {
    name: 'resource-list',
    components: {
        zteDataTable,
        resourceDialog
    },
    data() {
        return {
            startLoading: false,
            resourceDialogVisible: false,
            tableTitle: Lang()['resource_list'],
            dialogParams: {},
            isEditDialog: false,
            pageSize: 10,
            totalCount: 0,
            currentPage: 1,
            columns: [],
            data: [],
            i18n: Lang(),
            resourceTitle: ''
        }
    },
    computed: {
        ...mapGetters([
            'appContextPath',
            'isLocal'
        ])
    },
    methods: {
        refreshResourceList(page, size){
            const scope = this;
            this.startLoading = true;
            this.$http.post(`${this.appContextPath}sysman/Function/getFunctionList.serv`,
                {
                    bo:{},
                    sort:"functionCode",
                    order:"asc"
                },
            ).then(success => {
                if (success) {
                    scope.startLoading = false;
                    if (success.data && success.data.bo) {
                        scope.data = success.data.bo;
                        scope.totalCount = parseInt(success.data.bo.total||success.data.bo.length);
                    }
                }
            }, error => {
                scope.startLoading = false;
            });
        },
        openResourceDialog(row, isEdit) {
            if(isEdit) this.dialogParams = row;
            else if(row.id) this.dialogParams = {
                        id: -1,
                        resourceId: -1,
                        resourceName: '',
                        functionCode: row.functionCode,
                        functionName: '',
                        createdBy: '',
                        createdName: '',
                        createdDate: '',
                        lastUpdatedBy: '',
                        lastUpdatedDate: '',
                        enableFlag: '',
                        orgId: -1,
                        functionType: row.functionType,
                        parentMenu: {id: row.id, resourceName:row.functionName}
                    };
            else this.dialogParams = {
                        id: -1,
                        resourceId: -1,
                        resourceName: '',
                        functionCode: '',
                        functionName: '',
                        createdBy: '',
                        createdName: '',
                        createdDate: '',
                        lastUpdatedBy: '',
                        lastUpdatedDate: '',
                        enableFlag: '',
                        orgId: -1,
                        functionType: '',
                        parentMenu: {id: 0, resourceName: ''}
                    };
            this.isEditDialog = !!isEdit;
            this.resourceDialogVisible = true;
            this.resourceTitle = this.i18n[isEdit? 'edit_resource' : 'add_resource'];
        },
        resourceDialogClose(str) {
            this.resourceDialogVisible = false;
            if (str === 'success') {
                this.refreshResourceList(this.currentPage, this.pageSize);
                this.$message({
                    message: this.i18n['operate_success'],
                    type: 'success'
                });
            }
        }
    },
    mounted() {
        const scope = this;
        this.columns = [
            {
                id: 'id',
                label: this.i18n['form_rownum']
            },
            {
                id: 'resourceId',
                label: this.i18n['resource_id']
            },
            {
                id: 'functionName',
                label: this.i18n['function_name'],
                type: 'tag'
            },
            {
                id: 'functionCode',
                label: this.i18n['function_code']
            },
            {
                id: 'functionType',
                label: this.i18n['function_type'],
                type: 'tag',
                colorMap: {
                    '0': 'success',
                    '1': 'primary',
                    '2': 'danger',
                    '3': 'warning'
                },
                filter: {
                    func: 'lookup',
                    params: ['FUNCTION_TYPE']
                }
            },
            {
                id: 'createdDate',
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
                id: 'createdName',
                label: this.i18n['form_create_by']
            },
            {
                id: 'enableFlag',
                label: this.i18n['enable_flag'],
                type: 'switch',
                valueMap: {
                    onValue: 'Y',
                    offValue: 'N'
                },
                on: {
                    change(row) {
                        scope.startLoading = true;
                        scope.$http.post(`${scope.appContextPath}sysman/Resource/updateState.serv`,
                            {
                                id:row.id,
                                functionType:row.functionType,
                                enableFlag: row.enableFlag,
                                lastUpdatedDate: row.lastUpdatedDate,
                                lastUpdatedBy: row.lastUpdatedBy
                            }
                        ).then(success => {
                            if (success) {
                                scope.startLoading = false;
                                scope.$message({
                                    message: `${scope.i18n['resource']} ${row.id} ${scope.i18n[row.enableFlag === 'Y'? 'turned_on' : 'turned_off']}`,
                                    type: row.enableFlag === 'Y'? 'success' : 'error'
                                });
                            }
                        }, error => {
                        scope.startLoading = false;
                        });
                    }
                }
            },
            {
                label:this. i18n['form_operate'],
                width: '230',
                type: 'operation',
                groups: [
                    {
                        type: 'button',
                        color: 'primary',
                        label: this.i18n['form_add_child'],
                        icon: 'el-icon-plus',
                        on(row) {
                            scope.openResourceDialog(row);
                        }
                    },
                    {
                        type: 'button',
                        color: 'success',
                        label: this.i18n['form_edit'],
                        icon: 'el-icon-edit',
                        on(row) {
                            scope.openResourceDialog(row, true);
                        }
                    }
                ]
            }
        ];
        this.refreshResourceList(this.CurrentPage, this.pageSize);
    }

}
</script>
