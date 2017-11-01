<template>
    <div style="height: 100%; width: 100%;">
        <el-form v-loading="startLoading" label-position="left" :rules="rules" label-width="12rem" ref="roleForm" :element-loading-text="i18n['hard_loading']" :inline="true" :model="roleForm" class="demo-form-inline">
            <el-row :gutter="10">
                <el-col :span="12" v-if="!!roleForm.id">
                    <el-form-item :label="i18n['form_rownum']" prop="id">
                        <el-input :disabled="true" v-model="roleForm.id"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="i18n['role_code']" prop="roleCode">
                        <el-input v-model="roleForm.roleCode" :placeholder="i18n['please_enter_role_code']"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="!roleForm.id">
                    <el-form-item :label="i18n['enable_flag']" prop="enableFlag">
                        <el-switch style="width: 20rem;"
                            v-model="roleForm.enableFlag" 
                            active-value="Y"
                            inactive-value="N"
                        ></el-switch>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item :label="i18n['role_name']" prop="roleName">
                        <el-input v-model="roleForm.roleName" :placeholder="i18n['please_enter_role_name']"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="i18n['role_category']" prop="roleCategory">
                        <el-select v-model="roleForm.roleCategory" :placeholder="i18n['please_enter_role_type']" clearable>
                            <el-option
                                v-for="item in roleTypes"
                                :key="item.id"
                                :label="item.value"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="24" v-if="!!roleForm.id" prop="enableFlag">
                    <el-form-item :label="i18n['enable_flag']">
                        <el-switch 
                            v-model="roleForm.enableFlag" 
                            active-value="Y"
                            inactive-value="N"
                        ></el-switch>
                    </el-form-item>
                </el-col>
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
import { ROLE_TYPE } from '@/common/dataModel';

export default {
    name: 'role-dialog',
    data() {
        return {
            startLoading: false,
            roleForm: {
                id: '',
                roleCode: '',
                roleName: '',
                roleCategory: '',
                enableFlag: 'Y'
            },
            roleTypes: ROLE_TYPE,
            rules: {
                roleCode: [
                    { required: true, message: Lang()['please_enter_role_code'] }
                ],
                roleName: [
                    { required: true, message: Lang()['please_enter_role_name'] }
                ],
                roleCategory: [
                    { required: true, message: Lang()['please_select_role_type'] }
                ]
            },
            i18n: Lang()
        }
    },
    props: {
        params: {
            type: Object,
            default() { 
                return {
                        id: '',
                        roleCode: '',
                        roleName: '',
                        roleCategory: '',
                        enableFlag: 'Y'
                    }
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
                this.$refs['roleForm'].resetFields();
                this.roleForm = {
                    id: this.params.id,
                    roleCode: this.params.roleCode,
                    roleName: this.params.roleName,
                    roleCategory: this.params.roleCategory,
                    enableFlag: this.params.enableFlag
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
            this.$refs['roleForm'].validate((valid) => {
                if (valid) {
                    scope.startLoading = true;
                    let params;
                    if(!!scope.roleForm.id){
                        params = {
                            createdBy: scope.params.createdBy,
                            createdDate: scope.params.createdDate,
                            orgId: scope.loginUser.orgId
                        }
                        params = _.extend(params, scope.roleForm)
                    }else params = scope.roleForm;
                    scope.$http.post(`${scope.appContextPath}sysman/Role/${!!scope.roleForm.id?'update':'insert'}.serv`,
                        params
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
        this.roleForm = {
                    id: this.params.id,
                    roleCode: this.params.roleCode,
                    roleName: this.params.roleName,
                    roleCategory: this.params.roleCategory,
                    enableFlag: this.params.enableFlag
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
