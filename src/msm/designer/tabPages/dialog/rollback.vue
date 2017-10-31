<template>
    <div style="height: 100%; width: 100%;">
        <el-form v-loading="startLoading" label-position="left" :rules="rules" label-width="12rem" ref="rollbackForm" :element-loading-text="i18n['hard_loading']" :inline="true" :model="rollbackForm" class="demo-form-inline">
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item :label="i18n['form_review_process_number']">
                        <el-input :disabled="true" v-model="rollbackForm.signReviewFlowNo"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="i18n['form_process_node_name']">
                        <el-input :disabled="true" v-model="rollbackForm.nodeName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item :label="i18n['form_select_fallback_node']" prop="backNodeId">
                    <el-autocomplete value-key="value" style="width:55rem" class="inline-input" v-model="backNodeName" :fetch-suggestions="querySearch" :placeholder="i18n['form_select_fallback_node']" @select="selectNode"></el-autocomplete>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item :label="i18n['form_back_reason']" prop="backReason">
                    <el-input style="width:55rem" type="textarea" :autosize="{ minRows: 2, maxRows: 5}" v-model="rollbackForm.backReason"></el-input>
                </el-form-item>
            </el-row>
            <el-row :gutter="10">
                <el-form-item style="float: right;">
                    <el-button type="primary" @click="onSubmit">
                        <i class="iconfont alibaba-save"></i>
                        {{i18n['form_save']}}
                    </el-button>
                    <el-button @click="onClose">
                         <i class="el-icon-circle-close-outline"></i>
                        {{i18n['form_close']}}
                    </el-button>
                </el-form-item>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Lang } from '@/common/data-i18n/initI18n';

export default {
    name: 'roll-back-dialog',
    data() {
        return {
            startLoading: false,
            BeforeNodeList: [],
            backNodeName: '',
            rollbackForm: {
                signReviewFlowNo: '',
                nodeName: '',
                backNodeId: '',
                backReason: ''
            },
            rules: {
                backNodeId: [
                    { required: true, message: Lang()['please_select_node'] }
                ],
                backReason: [
                    { required: true, message: Lang()['go_back_reason'] }
                ]
            },
            i18n: Lang()
        }
    },
    props: {
        params: {
            type: Object,
            default: {
                processId: "",
                signReviewFlowNo: "",
                nodeName: "",
                baseId: "",
                taskId: "",
            }
        },
        visible: {
            type: Boolean,
            default: false
        },
        close: {
            type: Function,
            default() {
                this.$message({
                    message: this.i18n['operate_success'],
                    type: 'success'
                });
            }
        }
    },
    watch: {
        visible(val) {
            if (val) {
                this.$refs['rollbackForm'].resetFields();
                this.rollbackForm = {
                    signReviewFlowNo: this.params.signReviewFlowNo,
                    nodeName: this.params.nodeName,
                    backNodeId: '',
                    backReason: ''
                };
                this.backNodeName = '';
                this.getBeforeNodeList();
            }
        }
    },
    computed: {
        ...mapGetters([
            'appContextPath',
            'loginUser'
        ])
    },
    methods: {
        querySearch(str, callback) {
            callback(str ? this.BeforeNodeList.filter(e => (e.value.indexOf(str) > -1)) : this.BeforeNodeList);
        },
        getBeforeNodeList() {
            const scope = this;
            this.startLoading = true;
            this.$http.post(`${this.appContextPath}mypending/MyPending/getAllBeforeNode.serv`,
                { processId: this.params.processId }
            ).then(success => {
                if (success && success.data && success.data.bo) {
                    if (success.data && success.data.bo) {
                        scope.BeforeNodeList = success.data.bo.map((v) => ({
                            value: v.name,
                            id: v.id
                        }));
                    } else {
                        scope.BeforeNodeList = [];
                    }
                }
                scope.startLoading = false;
            }, error => {
                scope.startLoading = false;
            });
        },
        onSubmit() {
            const scope = this;
            this.$refs['rollbackForm'].validate((valid) => {
                if (valid) {
                    scope.startLoading = true;
                    scope.$http.post(`${scope.appContextPath}mypending/MyPending/back.serv`,
                        {
                            nodeName: scope.rollbackForm.nodeName,
                            processId: scope.params.processId,
                            taskId: scope.params.taskId,
                            user: scope.loginUser,
                            backNodeId: scope.rollbackForm.backNodeId,
                            baseId: scope.params.baseId,
                            backReason: scope.rollbackForm.backReason
                        }
                    ).then(success => {
                        success && scope.close('success');
                        scope.startLoading = false;
                    }, error => {
                        scope.startLoading = false;
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },
        onClose() {
            this.close();
        },
        selectNode(item) {
            this.rollbackForm.backNodeId = item.id;
        }
    },
    mounted() {
        this.rollbackForm = {
            signReviewFlowNo: this.params.signReviewFlowNo,
            nodeName: this.params.nodeName,
            backNodeId: '',
            backReason: ''
        };
        this.getBeforeNodeList();
    }
}
</script>

<style>
.el-table .info-row {
    background: #c9e5f5;
}

.el-table .positive-row {
    background: #e2f0e4;
}
</style>
