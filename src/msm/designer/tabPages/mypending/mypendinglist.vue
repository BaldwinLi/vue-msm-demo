<template>
    <div style="height: 100%; width: 100%;">
        <el-row>
            <el-col :span="24">
                <el-form :model="mypendingForm" label-position="left" ref="mypendingForm" label-width="10rem" class="demo-form-inline">
                    <el-row :gutter="10">
                        <el-col :span="6">
                            <el-form-item :label="i18n['form_project_number']" prop="projectNo">
                                <el-col :span="20">
                                    <el-input v-model="mypendingForm.projectNo"></el-input>
                                </el-col>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item :label="i18n['form_review_process_number']" prop="signReviewFlowNo">
                                <el-col :span="20">
                                    <el-input v-model="mypendingForm.signReviewFlowNo"></el-input>
                                </el-col>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item :label="i18n['form_contract_number']" prop="contractTextNo">
                                <el-col :span="20">
                                    <el-input v-model="mypendingForm.contractTextNo"></el-input>
                                </el-col>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item :label="i18n['form_business_department']" prop="busiDepart">
                                <el-col :span="20">
                                    <el-input v-model="mypendingForm.busiDepart"></el-input>
                                </el-col>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="6">
                            <el-form-item :label="i18n['form_project_name']" prop="projectName">
                                <el-col :span="20">
                                    <el-input v-model="mypendingForm.projectName"></el-input>
                                </el-col>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item :label="i18n['form_review_type']" prop="approveType">
                                <el-col :span="20">
                                    <el-select v-model="mypendingForm.approveType" :placeholder="i18n['please_select']">
                                        <el-option :label="i18n['please_select']" value=""></el-option>
                                        <el-option v-for="(item, index) in approveTypes" :key="index" :label="item.value" :value="item.id"></el-option>
                                    </el-select>
                                </el-col>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item :label="i18n['form_search_type']" prop="templateCode">
                                <el-col :span="20">
                                    <el-select v-model="mypendingForm.templateCode" :placeholder="i18n['please_select']">
                                        <el-option :label="i18n['please_select']" value=""></el-option>
                                        <el-option v-for="(item, index) in templates" :key="index" :label="item.templateName" :value="item.templateCode"></el-option>
                                    </el-select>
                                </el-col>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item style="float:right;">
                            <el-button :disabled="startLoading" type="primary" @click="refreshMyPendingList(currentPage, pageSize)">
                                <i v-if="startLoading" class="el-icon-loading"></i>
                                <i v-if="!startLoading" class="el-icon-search"></i>
                                {{i18n['form_query']}}
                            </el-button>
                            <el-button @click="onReset('mypendingForm')">
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
                <zte-data-table :title="tableTitle" :columns="columns" :data="data" :start-loading="startLoading" :current-page="currentPage" :total-count="totalCount" :page-size="pageSize" :page-sizes="[5]" @pageChange="changePage">
                </zte-data-table>
            </el-col>
        </el-row>

        <el-dialog ref="rollbackDialog" :title="i18n['rollback_title']" :visible.sync="rollbackDialogVisible">
            <roll-back-dialog :params="dialogParams" :visible.sync="rollbackDialogVisible" :close="rollbackDialogClose"></roll-back-dialog>
        </el-dialog>

        <el-dialog ref="transferDialog" :title="i18n['transfer_title']" :visible.sync="transferDialogVisible">
            <transfer-dialog :params="dialogParams" :visible.sync="transferDialogVisible" :close="transferDialogClose"></transfer-dialog>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import zteDataTable from '@/common/components/datatable/datatable';
import rollBackDialog from '../dialog/rollback'
import transferDialog from '../dialog/transfer'
import { APPROVE_TYPE } from '@/common/dataModel';
import { Lang } from '@/common/data-i18n/initI18n';
const i18n = Lang();
export default {
    name: 'my-pending-list',
    components: {
        zteDataTable,
        rollBackDialog,
        transferDialog
    },
    data() {
        return {
            startLoading: false,
            tableTitle: Lang()['my_pending_reviews'],
            pageSize: 5,
            totalCount: 0,
            currentPage: 1,
            columns: [],
            data: [],
            mypendingForm: {
                projectNo: '',
                signReviewFlowNo: '',
                contractTextNo: '',
                busiDepart: '',
                projectName: '',
                approveType: '',
                templateCode: ''
            },
            i18n,
            approveTypes: APPROVE_TYPE,
            templates: [],
            rollbackDialogVisible: false,
            transferDialogVisible: false,
            dialogParams: {
                processId: "",
                signReviewFlowNo: "",
                nodeName: "",
                baseId: "",
                taskId: "",
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
        changePage(page) {
            if (page) this.refreshMyPendingList(page.page, page.size);
            else this.refreshMyPendingList(this.currentPage, this.pageSize);
        },
        queryDetail(data) {
            const scope = this;
            const loading = this.$loading({
                fullscreen: true,
                text: this.i18n['hard_loading']
            });
            this.$http.post(`${this.appContextPath}mypending/MyPending/review.serv`,
                { 
                    "formId": data.formId, 
                    "formVersion": data.formVersion, 
                    "baseId": data.baseId, 
                    "taskId": data.taskId, 
                    "processId": data.processId, 
                    "reviewWorkFlowNo": data.reviewWorkFlowNo, 
                    "approveType": data.approveType, 
                    "nodeName": data.nodeName, 
                    "reviewStatus": data.reviewStatus 
                },
            ).then(
                success => {
                    if (success.data && success.data.bo && success.data.bo.htmlPath) {
                        let filePath = `${success.data.bo.htmlPath.split("Form_002_Define")[1]}?outside=1&businessId=${data.reviewWorkFlowNo}&cookie=${Date.now()}`;
                        window.open(`${this.isLocal ? 'http://10.5.5.145:8080' : location.origin}/Form_002_Define${filePath}`);
                    } else {
                        this.$message.error(i18n['instante_form_fail']);
                    }
                    loading.close();
                    scope.startLoading = false
                },
                error => scope.startLoading = false
                );
        },
        refreshMyPendingList(page, size) {
            const scope = this;
            this.startLoading = true;
            this.$http.post(`${this.appContextPath}mypending/MyPending/getList.serv`,
                {
                    bo: {
                        ...this.mypendingForm,
                        userId: this.loginUser.account
                    },
                    sort: "", 
                    order: "desc", 
                    page: page,
                    rows: size
                },
            ).then(success => {
                if (success) {
                    scope.startLoading = false;
                    if (success.data && success.data.bo) {
                        scope.data = success.data.bo.rows;
                        scope.totalCount = parseInt(success.data.bo.total);
                    }
                }
            }, error => {
                scope.startLoading = false;
            });
        },
        onReset(formName) {
            this.$refs[formName].resetFields();
        },
        rollbackDialogClose(str) {
            this.rollbackDialogVisible = false;
            if (str === 'success') {
                this.refreshMyPendingList(this.currentPage, this.pageSize);
                this.$message({
                    message: this.i18n['operate_success'],
                    type: 'success'
                });
            }
        },
        transferDialogClose(str) {
            this.transferDialogVisible = false;
            if (str === 'success') {
                this.refreshMyPendingList(this.currentPage, this.pageSize);
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
                id: 'projectNo',
                label: i18n['form_project_number']
            },
            {
                id: 'projectName',
                label: i18n['form_project_name']
            },
            {
                id: 'signReviewFlowNo',
                label: i18n['form_review_process_number'],
                type: 'hyperlink',
                on: {
                    click(data) {
                        scope.queryDetail(data);
                    }
                }
            },
            {
                id: 'contractTextNo',
                label: i18n['form_contract_number']
            },
            {
                id: 'approveType',
                label: i18n['form_review_type'],
                type: 'tag',
                filter: {
                    func: 'lookup',
                    params: ['APPROVE_TYPE']
                }
            },
            {
                id: 'busiDepart',
                label: i18n['form_business_department']
            },
            {
                id: 'nodeName',
                label: i18n['form_process_node_name']
            },
            {
                id: 'subTime',
                label: i18n['form_commit_time']
            },
            {
                label: i18n['form_operate'],
                width: '420',
                type: 'operation',
                groups: [
                    {
                        type: 'button',
                        color: 'success',
                        label: i18n['approve'],
                        isShow(row) {
                            return row.reviewStatus !== '03'
                        },
                        icon: 'el-icon-edit',
                        on(row) {
                            scope.queryDetail(row);
                        }
                    },
                    {
                        type: 'button',
                        color: 'success',
                        icon: 'el-icon-d-arrow-left',
                        label: i18n['rollback'],
                        isShow(row) {
                            return row.reviewStatus !== '03'
                        },
                        on: ((row) => {
                            this.dialogParams = {
                                processId: row.processId || "",
                                signReviewFlowNo: row.signReviewFlowNo || "",
                                nodeName: row.nodeName || "",
                                baseId: row.baseId || "",
                                taskId: row.taskId || "",
                            };
                            this.rollbackDialogVisible = true;
                        }).bind(this)
                    },
                    {
                        type: 'button',
                        color: 'success',
                        label: i18n['transfer'],
                        isShow(row) {
                            return row.reviewStatus !== '03'
                        },
                        icon: 'iconfont alibaba-skip',
                        on: ((row) => {
                            this.dialogParams = {
                                processId: row.processId || "",
                                signReviewFlowNo: row.signReviewFlowNo || "",
                                nodeName: row.nodeName || "",
                                taskId: row.taskId || "",
                            };
                            this.transferDialogVisible = true;
                        }).bind(this)
                    },
                    {
                        type: 'button',
                        color: 'warning',
                        icon: 'iconfont alibaba-iconfontstop',
                        label: i18n['pause'],
                        isShow(row) {
                            return row.reviewStatus !== '03'
                        },
                        on: ((row) => {
                            scope.startLoading = true;
                            this.$http.post(`${this.appContextPath}mypending/MyPending/pause.serv`,
                                {
                                    processId: row.processId,
                                    baseId: row.baseId,
                                    taskId: row.taskId,
                                    user: this.loginUser
                                }
                            ).then(
                                success => {
                                    scope.startLoading = false;
                                    if (success) {
                                       scope.refreshMyPendingList(scope.currentPage, scope.pageSize);
                                    }
                                },
                                error =>  scope.startLoading = false
                            );
                        }).bind(this)
                    },
                    {
                        type: 'button',
                        color: 'info',
                        icon: 'iconfont alibaba-iconfontplay2',
                        label: i18n['resume'],
                        isShow(row) {
                            return row.reviewStatus === '03'
                        },
                        on: ((row) => {
                            scope.startLoading = true;
                            this.$http.post(`${this.appContextPath}mypending/MyPending/resume.serv`,
                                {
                                    processId: row.processId,
                                    baseId: row.baseId,
                                    taskId: row.taskId,
                                    user: this.loginUser
                                }
                            ).then(
                                success => {
                                    scope.startLoading = false;
                                    if (success) {
                                       scope.refreshMyPendingList(scope.currentPage, scope.pageSize);
                                    }
                                },
                                error =>  scope.startLoading = false
                            );
                        }).bind(this)
                    }
                ]
            }
        ];
        this.startLoading = true;
        this.$http.post(`${this.appContextPath}myreviewman/MyReviewMan/getTemplate.serv`,
            {}
        ).then(
            success => {
                scope.templates = success.data && success.data.bo.map(v => ({
                    templateCode: v.templateCode,
                    templateName: v.templateName
                }));
                scope.refreshMyPendingList(scope.currentPage, scope.pageSize);
            },
            error => scope.startLoading = false
            );
    }
}
</script>
