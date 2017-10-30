<template>
    <div style="height: 100%; width: 100%;">
        <el-form v-loading="startLoading" label-position="left" :rules="rules" label-width="12rem" ref="transferForm" :element-loading-text="i18n['hard_loading']" :model="transferForm" class="demo-form-inline">
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item :label="i18n['form_review_process_number']">
                        <el-input :disabled="true" v-model="params.signReviewFlowNo"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="i18n['form_process_node_name']">
                        <el-input :disabled="true" v-model="params.nodeName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item :label="i18n['current_approvement_user']">
                        <el-input :disabled="true" v-model="loginUser.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="i18n['assign_to']" prop="assignTo">
                        <user-select :rules="rules.assignTo" v-model="transferForm.assignTo"></user-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-form-item style="float: right;">
                    <el-button type="primary" @click="onSubmit">
                        <i class="iconfont alibaba-save"></i>
                        {{i18n['form_save']}}
                    </el-button>
                    <el-button @click="onClose" icon="close">
                        {{i18n['form_close']}}
                    </el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Lang } from '@/common/data-i18n/initI18n';
import userSelect from '@/common/components/userselect/userselect';

export default {
    name: 'transfer-dialog',
    components: {
        userSelect
    },
    data() {
        return {
            startLoading: false,
            transferForm: {
                processId: '',
                taskId: '',
                transferType: "0",
                assignTo: '',
                executorId: ''
            },
            rules: {
                assignTo: [
                    { required: true, message: Lang()['please_select_assign_to'] }
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
                this.$refs['transferForm'].resetFields();
                this.transferForm = {
                    processId: this.params.processId,
                    taskId: this.params.taskId,
                    transferType: "0",
                    assignTo: '',
                    executorId: this.loginUser.account + ''
                };
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
        onSubmit() {
            const scope = this;
            this.$refs['transferForm'].validate((valid) => {
                if (valid) {
                    scope.startLoading = true;
                    scope.$http.post(`${scope.appContextPath}mypending/MyPending/transfer.serv`,
                        _.extend(this.transferForm, {
                            user: this.loginUser
                        })
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
        }
    },
    mounted() {
        this.transferForm = {
            processId: this.params.processId,
            taskId: this.params.taskId,
            transferType: "0",
            executorId: this.loginUser.account + '',
            assignTo: ''
        };
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
