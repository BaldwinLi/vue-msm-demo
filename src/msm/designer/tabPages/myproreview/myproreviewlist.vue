<template>
    <div style="height: 100%; width: 100%;">
        <el-row>
            <el-col :span="24">
                <el-form :model="myproreviewForm" label-position="left" ref="myproreviewForm" label-width="10rem" class="demo-form-inline">
                    <el-row :gutter="10">
                        <el-col :span="6">
                            <el-form-item :label="i18n['form_review_process_number']" prop="signReviewFlowNo">
                                <el-col :span="20">
                                    <el-input v-model="myproreviewForm.signReviewFlowNo"></el-input>
                                </el-col>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item :label="i18n['form_contract_number']" prop="contractTextNo">
                                <el-col :span="20">
                                    <el-input v-model="myproreviewForm.contractTextNo"></el-input>
                                </el-col>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item :label="i18n['form_business_department']" prop="busiDepart">
                                <el-col :span="20">
                                    <el-input v-model="myproreviewForm.busiDepart"></el-input>
                                </el-col>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item :label="i18n['form_project_name']" prop="projectName">
                                <el-col :span="20">
                                    <el-input v-model="myproreviewForm.projectName"></el-input>
                                </el-col>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="6">
                            <el-form-item :label="i18n['form_review_type']" prop="approveType">
                                <el-col :span="20">
                                    <el-select v-model="myproreviewForm.approveType" :placeholder="i18n['please_select']">
                                        <el-option :label="i18n['please_select']" value=""></el-option>
                                        <el-option v-for="(item, index) in approveTypes" :key="index" :label="item.value" :value="item.id"></el-option>
                                    </el-select>
                                </el-col>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item :label="i18n['form_review_status']" prop="reviewStatus">
                                <el-col :span="20">
                                    <el-select v-model="myproreviewForm.reviewStatus" :placeholder="i18n['please_select']">
                                        <el-option :label="i18n['please_select']" value=""></el-option>
                                        <el-option v-for="(item, index) in reviewStatuses" :key="index" :label="item.value" :value="item.id"></el-option>
                                    </el-select>
                                </el-col>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item :label="i18n['form_review_result']" prop="reviewResult">
                                <el-col :span="20">
                                    <el-select v-model="myproreviewForm.reviewResult" :placeholder="i18n['please_select']">
                                        <el-option :label="i18n['please_select']" value=""></el-option>
                                        <el-option v-for="(item, index) in reviewResults" :key="index" :label="item.value" :value="item.id"></el-option>
                                    </el-select>
                                </el-col>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item :label="i18n['form_search_type']" prop="templateCode">
                                <el-col :span="20">
                                    <el-select v-model="myproreviewForm.templateCode" :placeholder="i18n['please_select']">
                                        <el-option :label="i18n['please_select']" value=""></el-option>
                                        <el-option v-for="(item, index) in templates" :key="index" :label="item.templateName" :value="item.templateCode"></el-option>
                                    </el-select>
                                </el-col>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item style="float:right;">
                            <el-button :disabled="startLoading" type="primary" @click="refreshProreviewList(currentPage, pageSize)">
                                <i v-if="startLoading" class="el-icon-loading"></i>
                                <i v-if="!startLoading" class="el-icon-search"></i>
                                {{i18n['form_query']}}
                            </el-button>
                            <el-button @click="onReset('myproreviewForm')">
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
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import zteDataTable from '@/common/components/datatable/datatable';
import { APPROVE_TYPE, REVIEW_STATUS, REVIEW_RESULT } from '@/common/dataModel';
import { Lang } from '@/common/data-i18n/initI18n';
const i18n = Lang();
export default {
    name: 'proreview-list',
    components: {
        zteDataTable
    },
    data() {
        return {
            startLoading: false,
            tableTitle: Lang()['myreview_manage'],
            pageSize: 5,
            totalCount: 0,
            currentPage: 1,
            columns: [],
            data: [],
            myproreviewForm: {
                signReviewFlowNo: '',
                contractTextNo: '',
                busiDepart: '',
                projectName: '',
                approveType: '',
                reviewStatus: '',
                reviewResult: '',
                templateCode: ''
            },
            i18n,
            approveTypes: APPROVE_TYPE,
            reviewStatuses: REVIEW_STATUS,
            reviewResults: REVIEW_RESULT,
            templates: []
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
            if (page) this.refreshProreviewList(page.page, page.size);
            else this.refreshProreviewList(this.currentPage, this.pageSize);
        },
        queryDetail(data) {
            const scope = this;
            const loading = this.$loading({
                fullscreen: true,
                text: this.i18n['hard_loading']
            });
            this.$http.post(`${this.appContextPath}mypending/MyPending/review.serv`,
                {
                    formId: data.formId,
                    formVersion: data.formVersion,
                    baseId: data.baseId,
                    taskId: data.taskId,
                    processId: data.processId,
                    reviewWorkFlowNo: data.reviewWorkFlowNo,
                    approveType: data.approveType,
                    reviewStatus: data.reviewStatus
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
        refreshProreviewList(page, size) {
            const scope = this;
            this.startLoading = true;
            this.$http.post(`${this.appContextPath}reviewman/MyProReview/getPage.serv`,
                {
                    bo: {
                        ...this.myproreviewForm,
                        userId: this.loginUser.account
                    },
                    rows: size,
                    sort: "",
                    order: "desc",
                    page: page
                    
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
        deleteReview(row) {
            const scope = this;
            this.$confirm(this.i18n['confirm_delete'], this.i18n['reminder'], {
                confirmButtonText: this.i18n['form_confirm'],
                cancelButtonText: this.i18n['form_cancel'],
                type: 'warning'
            }).then(() => {
                scope.startLoading = true;
                scope.$http.post(`${scope.appContextPath}reviewman/MyProReview/delete.serv`,
                    {
                        baseId: row.baseId,
                        user: scope.loginUser
                    },
                ).then(success => {
                    if (success) {
                        scope.$message({
                            type: 'success',
                            message: scope.i18n['delete_success']
                        });
                        scope.refreshProreviewList(scope.currentPage, scope.pageSize);
                    }
                    scope.startLoading = false;
                }, error => {
                    scope.startLoading = false;
                });
            });
        }
    },
    mounted() {
        const scope = this;
        this.columns = [
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
                id: 'busiDepart',
                label: i18n['form_business_department']
            },
            {
                id: 'projectName',
                label: i18n['form_project_name']
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
                id: 'reviewStatus',
                label: i18n['form_review_status'],
                type: 'tag',
                filter: {
                    func: 'lookup',
                    params: ['REVIEW_STATUS']
                }
            },
            {
                id: 'reviewResult',
                label: i18n['form_review_result'],
                type: 'tag',
                filter: {
                    func: 'lookup',
                    params: ['REVIEW_RESULT']
                }
            },
            {
                id: 'subTime',
                label: i18n['form_commit_time']
            },
            {
                label: i18n['form_operate'],
                width: '190',
                type: 'operation',
                groups: [
                    {
                        type: 'button',
                        color: 'success',
                        label: i18n['edit'],
                        icon: 'el-icon-edit',
                        isShow(row) {
                            return row.reviewStatus === '00'
                        },
                        on(row) {
                            scope.queryDetail(row);
                        }
                    },
                    {
                        type: 'button',
                        color: 'danger',
                        icon: 'el-icon-circle-close',
                        label: i18n['delete'],
                        isShow(row) {
                            return row.reviewStatus === '00'
                        },
                        on: ((row) => {
                            this.deleteReview(row);
                        }).bind(this)
                    },
                    {
                        type: 'button',
                        color: 'warning',
                        icon: 'iconfont alibaba-process',
                        label: i18n['rate_of_progress'],
                        isShow(row) {
                            return row.reviewStatus !== '00'
                        },
                        on: ((row) => {
                            debugger
                            const loading = this.$loading({
                                fullscreen: true,
                                text: this.i18n['hard_loading']
                            });
                            this.$http.post(`${this.appContextPath}myreviewman/MyReviewMan/getSchedule.serv`,
                                {
                                    processId: row.processId,
                                    userId: this.loginUser.account
                                }
                            ).then(
                                success => {
                                    if (success.data.bo) {
                                        window.open(success.data.bo);
                                    }
                                    loading.close();
                                },
                                error => loading.close()
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
                scope.refreshProreviewList(scope.currentPage, scope.pageSize);
            },
            error => scope.startLoading = false
            );
    }
}
</script>
