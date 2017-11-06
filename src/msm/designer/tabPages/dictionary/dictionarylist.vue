
<template>
    <div style="height: 100%; width: 100%;">
         <el-row>
             <el-col :span="24">
                <el-button @click="refreshDictionaryList(upperParent)" type="warning" style="float: right; margin: 2rem;">
                    <i class="el-icon-d-arrow-left"></i>
                        {{i18n['back_to_parent_dic_list']}}
                </el-button>
            </el-col>
        </el-row>
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
                @pageChange="refreshDictionaryList"
                :buttonGroup="{
                    add: true,
                    refresh: true,
                    copy: true,
                    excl: true,
                    pdf: false,
                    print: true
                }"
                :addRowCallBack="openDictionaryDialog">
                </zte-data-table>
            </el-col>
        </el-row>
        <el-dialog ref="resourceDialog" :title="dictionaryTitle" :visible.sync="dictionaryDialogVisible">
            <dictionary-dialog :params="dialogParams" :parentId="parentId" :visible.sync="dictionaryDialogVisible" :close="dictionaryDialogClose" :isEditDialog="isEditDialog"></dictionary-dialog>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import zteDataTable from '@/common/components/datatable/datatable';
import dictionaryDialog from './dialog/dictionaryDialog';
import { Lang } from '@/common/data-i18n/initI18n';

export default {
    name: 'resource-list',
    components: {
        zteDataTable,
        dictionaryDialog
    },
    data() {
        return {
            startLoading: false,
            upperParent: 0,
            parentId: 0,
            dictionaryDialogVisible: false,
            tableTitle: Lang()['dictionary_list'],
            dialogParams: {},
            isEditDialog: false,
            pageSize: 5,
            totalCount: 0,
            columns: [],
            data: [],
            i18n: Lang(),
            dictionaryTitle: ''
        }
    },
    computed: {
        ...mapGetters([
            'appContextPath',
            'isLocal'
        ])
    },
    methods: {
        refreshDictionaryList(parent){
            const scope = this;
            this.startLoading = true;
            this.parentId = parent || 0;
            this.$http.post(`${this.appContextPath}sysman/Dictionary/getList.serv`,
                {
                    bo:{ parentId: parent||0 },
                    sort:"orderBy",
                    order:"asc"
                },
            ).then(success => {
                if (success) {
                    scope.startLoading = false;
                    if (success.data && success.data.bo) {
                        scope.upperParent = scope.data[0] && scope.data[0].parentId || 0;
                        scope.data = success.data.bo;
                        scope.totalCount = parseInt(success.data.bo.total||success.data.bo.length);
                    }
                }
            }, error => {
                scope.startLoading = false;
            });
        },
        openDictionaryDialog(row, isEdit) {
            if(isEdit) this.dialogParams = row;
            else this.dialogParams = {
                        id: -1,
                        parentId: this.parentId,
                        dictCode: '',
                        dictName: row.functionCode,
                        dictValue: '',
                        enableFlag: '',
                        levelName: '',
                        parentDictCode: '',
                        lastUpdatedBy: '',
                        lastUpdatedDate: '',
                        createdBy: '',
                        createdDate: '',
                        effectiveDate: '',
                        expirationDate: '',
                        orgId: -1,
                        orderBy: 0,
                        remark: '',
                    };
            this.isEditDialog = !!isEdit;

            this.dictionaryDialogVisible = true;
            this.dictionaryTitle = this.i18n[isEdit? 'edit_dictionary' : 'add_dictionary'];
        },
        dictionaryDialogClose(str) {
            this.dictionaryDialogVisible = false;
            if (str === 'success') {
                this.refreshDictionaryList();
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
                label: this.i18n['dictionary_id']
            },
            {
                id: 'parentId',
                label: this.i18n['parent_dictionary_id']
            },
            {
                id: 'dictCode',
                label: this.i18n['dict_code'],
                type: 'tag'
            },
            {
                id: 'dictName',
                label: this.i18n['dict_name'],
                type: 'hyperlink',
                on: {
                    click(data) {
                        scope.refreshDictionaryList(data.id);
                    }
                }
            },
            {
                id: 'dictValue',
                label: this.i18n['dict_value'],
                type: 'tag',
                sortable: true
            },
            {
                id: 'levelName',
                label: this.i18n['view_level'],
                type: 'tag'
            },
            {
                id: 'orderBy',
                label: this.i18n['order_by']
            },
            {
                id: 'effectiveDate',
                label: this.i18n['effective_date']
            },
            {
                id: 'expirationDate',
                label: this.i18n['expiration_date']
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
                        scope.$http.post(`${scope.appContextPath}sysman/Dictionary/update.serv`,
                            row
                        ).then(success => {
                            if (success) {
                                scope.startLoading = false;
                                scope.$message({
                                    message: `${scope.i18n['dictionary_id']} ${row.id} ${scope.i18n[row.enableFlag === 'Y'? 'turned_on' : 'turned_off']}`,
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
                        color: 'success',
                        label: this.i18n['form_edit'],
                        icon: 'el-icon-edit',
                        on(row) {
                            scope.openDictionaryDialog(row, true);
                        }
                    },
                    {
                        type: 'button',
                        color: 'danger',
                        icon: 'iconfont alibaba-delete',
                        label: this.i18n['delete'],
                        on(row) {
                            scope.$confirm(
                                scope.i18n['confirm_delete'], scope.i18n['reminder'], 
                                {
                                    confirmButtonText: scope.i18n['form_confirm'],
                                    cancelButtonText: scope.i18n['form_cancel'],
                                    type: 'warning'
                                }
                            ).then(()=>{
                                scope.startLoading = true;
                                scope.$http.post(`${scope.appContextPath}sysman/Dictionary/delete.serv`,
                                    row,
                                ).then(
                                    success => {
                                        if (success) {
                                            scope.$message({
                                                type: 'success',
                                                message: scope.i18n['delete_success']
                                            });
                                            scope.refreshDictionaryList();
                                        }
                                        scope.startLoading = false;
                                    }, 
                                    error => {
                                        scope.startLoading = false;
                                    }
                                );
                            });
                        }
                    }
                ]
            }
        ];
        this.refreshDictionaryList();
    }

}
</script>
