
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
                @pageChange="refreshRoleList"
                :buttonGroup="{
                    add: true,
                    refresh: true,
                    copy: true,
                    excl: true,
                    pdf: false,
                    print: true
                }"
                :addRowCallBack="openRoleDialog">
                </zte-data-table>
            </el-col>
        </el-row>
        <el-dialog ref="addRoleDialog" :title="roleDialogTitle" :visible.sync="roleDialogVisible">
            <role-dialog :params="dialogParams" :visible.sync="roleDialogVisible" :close="roleDialogClose"></role-dialog>
        </el-dialog>
        <el-dialog ref="rolePrivlegeDialog" :title="roleDialogTitle" :visible.sync="rolePrivlegeDialogVisible">
            <menu-tree :id="dialogParams.id" :resourceType="dialogParams.resourceType" :visible.sync="rolePrivlegeDialogVisible" :close="rolePrivlegeDialogClose"></menu-tree>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import zteDataTable from '@/common/components/datatable/datatable';
import roleDialog from './dialog/roleDialog';
import menuTree from '../dialog/menuTree';
import { Lang } from '@/common/data-i18n/initI18n';

export default {
    name: 'role-config',
    components: {
        zteDataTable,
        roleDialog,
        menuTree
    },
    data() {
        return {
            startLoading: false,
            roleDialogVisible: false,
            rolePrivlegeDialogVisible: false,
            tableTitle: Lang()['role_list'],
            dialogParams: {},
            pageSize: 10,
            totalCount: 0,
            currentPage: 1,
            columns: [],
            data: [],
            i18n: Lang(),
            roleDialogTitle: ''
        }
    },
    computed: {
        ...mapGetters([
            'appContextPath',
            'isLocal'
        ])
    },
    methods: {
        refreshRoleList(){
            const scope = this;
            this.startLoading = true;
            this.$http.post(`${this.appContextPath}sysman/Role/getList.serv`,
                {bo:{},sort: "",order: "desc"},
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
        openRoleDialog(row) {
            debugger
            if(!!row.id) this.dialogParams = row;
            else this.dialogParams = {
                id: '',
                roleCode: '',
                roleName: '',
                roleCategory: '',
                enableFlag: 'Y'
            };
            this.roleDialogVisible = true;
            this.roleDialogTitle = this.i18n[!!row.id? 'edit_role' : 'add_role'];
        },
        roleDialogClose(str) {
            this.roleDialogVisible = false;
            if (str === 'success') {
                this.refreshRoleList();
                this.$message({
                    message: this.i18n['operate_success'],
                    type: 'success'
                });
            }
        },
        rolePrivlegeDialogClose(str){
            this.rolePrivlegeDialogVisible = false;
            if (str === 'success') {
                this.refreshRoleList();
                this.$message({
                    message: this.i18n['operate_success'],
                    type: 'success'
                });
            }
        },
        deleteRole(row) {
            const scope = this;
            this.$confirm(this.i18n['confirm_delete'], this.i18n['reminder'], {
                confirmButtonText: this.i18n['form_confirm'],
                cancelButtonText: this.i18n['form_cancel'],
                type: 'warning'
            }).then(()=>{
                scope.startLoading = true;
                scope.$http.post(`${scope.appContextPath}sysman/Role/delete.serv`,
                 row,
                ).then(
                    success => {
                        if (success) {
                            scope.$message({
                                type: 'success',
                                message: scope.i18n['delete_success']
                            });
                            scope.refreshRoleList();
                        }
                        scope.startLoading = false;
                    }, 
                    error => {
                        scope.startLoading = false;
                    }
                );
            });
        }
    },
    mounted() {
        const scope = this;
        this.columns = [
            {
                id: 'id',
                label: 'ID'
            },
            {
                id: 'roleCode',
                label: this.i18n['role_code']
            },
            {
                id: 'roleName',
                label: this.i18n['role_name']
            },
            {
                id: 'roleCategory',
                label: this.i18n['role_category'],
                type: 'tag',
                colorMap: {
                    '0': 'primary',
                    '1': 'warning',
                },
                filter: {
                    func: 'lookup',
                    params: ['ROLE_TYPE']
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
                        scope.$http.post(`${scope.appContextPath}sysman/Role/update.serv`,
                            row
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
                width: '520',
                type: 'operation',
                groups: [
                    {
                        type: 'button',
                        color: 'success',
                        label: this.i18n['form_edit'],
                        icon: 'el-icon-edit',
                        on(row) {
                            scope.openRoleDialog(row);
                        }
                    },
                    {
                        type: 'button',
                        color: 'primary',
                        label: this.i18n['menu_grant'],
                        icon: 'el-icon-setting',
                        on(row) {
                            scope.dialogParams = {
                                id: row.id,
                                resourceType: '\'0\', \'1\''
                            };
                            scope.roleDialogTitle = scope.i18n['menu_grant'];
                            scope.rolePrivlegeDialogVisible = true;
                        }
                    },
                    {
                        type: 'button',
                        color: 'info',
                        label: this.i18n['service_grant'],
                        icon: 'el-icon-setting',
                        on(row) {
                            scope.dialogParams = {
                                id: row.id,
                                resourceType: '\'2\''
                            };
                            scope.roleDialogTitle = scope.i18n['service_grant']
                            scope.rolePrivlegeDialogVisible = true;
                        }
                    },
                    {
                        type: 'button',
                        color: 'warning',
                        label: this.i18n['add_user'],
                        icon: 'el-icon-circle-plus-outline',
                        on(row) {
                            // scope.dialogParams = {
                            //     id: row.id,
                            //     resourceType: '\'2\''
                            // };
                            // scope.roleDialogTitle = scope.i18n['service_grant']
                            // scope.rolePrivlegeDialogVisible = true;
                        }
                    },
                    {
                        type: 'button',
                        color: 'danger',
                        icon: 'el-icon-circle-close',
                        label: this.i18n['delete'],
                        on(row) {
                            scope.deleteRole(row);
                        }
                    }
                ]
            }
        ];
        this.refreshRoleList();
    }

}
</script>
