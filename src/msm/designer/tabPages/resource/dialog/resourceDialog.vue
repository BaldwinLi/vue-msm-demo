<template>
    <div style="height: 100%; width: 100%;">
        <el-form v-loading="startLoading" label-position="left" :rules="rules" label-width="12rem" ref="resourceForm" :element-loading-text="i18n['hard_loading']" :inline="true" :model="resourceForm" class="demo-form-inline">
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item :label="i18n['form_rownum']">
                        <el-input :disabled="true" v-model="resourceForm.id"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="i18n['resource_name']">
                        <el-input :disabled="true" v-model="resourceForm.parentName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item :label="i18n['function_code']" prop="resourceCode" style="float: left;margin-left:1.5rem;">
                        <el-input v-model="resourceForm.resourceCode" :maxlength="isNotRootAdd?3:10" :placeholder="i18n['please_enter_resourceCode']" :style="{ width: isNotRootAdd ? '19.5rem' : '100%', float: 'left', position: isNotRootAdd ? 'absolute' : 'relative' }">
                            <template v-if="isNotRootAdd" slot="prepend">{{params.functionCode}}</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            <!-- </el-row>
            <el-row :gutter="10"> -->
                <el-col :span="12">
                    <el-form-item :label="i18n['function_name']" prop="resourceName" style="float: left;margin-left:1.5rem;">
                        <el-input v-model="resourceForm.resourceName" :placeholder="i18n['please_enter_resourceName']"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item :label="i18n['resource_url']" prop="resourceValue">
                        <el-input v-model="resourceForm.resourceValue" :placeholder="i18n['please_enter_resourceValue']"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item style="width: 100%;" :label="i18n['resource_icon']" prop="iconValue">
                        <icon-picker style="width: 21rem;" v-model="resourceForm.iconValue"></icon-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item :label="i18n['function_type']" prop="resourceType">
                        <el-select style="width: 20rem;" :disabled="disableResType" v-model="resourceForm.resourceType" clearable :placeholder="i18n['please_enter_resourceType']">
                            <el-option
                                v-for="item in functionTypes"
                                :key="item.id"
                                :label="item.value"
                                :value="item.id">
                            </el-option>
                         </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="i18n['org_text_label']">
                        <el-input :disabled="true" v-model="orgName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="24">
                    <el-checkbox v-model="resourceForm.encryptFlag" true-label="Y" false-label="N">{{i18n['encrypt_flag_label']}}</el-checkbox>
                    <el-checkbox v-model="resourceForm.privilegeFlag" true-label="Y" false-label="N">{{i18n['privilege_flag_label']}}</el-checkbox>
                    <el-checkbox v-model="resourceForm.enableFlag" true-label="Y" false-label="N">{{i18n['enable_flag']}}</el-checkbox>
                </el-col>
            </el-row>
            <el-row v-if="isEditDialog" :gutter="10">
                <el-col :span="12">
                    <el-form-item :label="i18n['form_create_by']">
                        <el-input :disabled="true" v-model="resourceForm.createdBy"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="i18n['form_create_time']">
                        <el-input :disabled="true" v-model="resourceForm.createdDate"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="isEditDialog" :gutter="10">
                <el-col :span="12">
                    <el-form-item :label="i18n['form_last_update_by']">
                        <el-input :disabled="true" v-model="resourceForm.lastUpdatedBy"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="i18n['form_last_update_time']">
                        <el-input :disabled="true" v-model="resourceForm.lastUpdatedDate"></el-input>
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
import iconPicker from '@/common/components/iconpicker/iconpicker';
import { mapGetters } from 'vuex';
import { Lang } from '@/common/data-i18n/initI18n';
import { FUNCTION_TYPE } from '@/common/dataModel';

export default {
    name: 'resource-dialog',
    components: {
        iconPicker
    },
    data() {
        return {
            startLoading: false,
            orgName: '',
            isNotRootAdd: false,
            disableResType: false,
            resourceForm: {
                id: Date.now().toString(),
                parentId: -1,
                parentName: '',
                resourceType: '',
                resourceCode: '',
                resourceName: '',
                resourceValue: '',
                iconValue: '',
                encryptFlag: 'N',
                privilegeFlag: 'N',
                createdBy: -1,
                createdDate: '',
                lastUpdatedBy: -1,
                lastUpdatedDate: '',
                enableFlag: 'Y',
                orgId: -1
            },
            functionTypes: FUNCTION_TYPE,
            rules: {
                resourceType: [
                    { required: true, message: Lang()['please_enter_resourceType'] }
                ],
                resourceCode: [
                    { required: true, message: Lang()['please_enter_resourceCode'] }
                ],
                resourceName: [
                    { required: true, message: Lang()['please_enter_resourceName'] }
                ],
                resourceValue: [
                    { required: true, message: Lang()['please_enter_resourceValue'] }
                ],
                iconValue: [
                    { required: true, message: Lang()['please_enter_iconValue'] }
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
                        id: Date.now().toString(),
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
                        parentMenu: {
                            id: '0', 
                            resourceName: ''
                            }
                    }
            }
        },
        isEditDialog: {
            type: Boolean,
            default: false
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
                this.$refs['resourceForm'].resetFields();
                this.isNotRootAdd = (this.params.parentMenu && (this.params.parentMenu['id'] != 0));
                this.disableResType = ((this.params.id !== -1) || (this.params.parentMenu['id'] != 0));
                this.resourceForm = {
                    id: Date.now().toString(),
                    parentId: -1,
                    parentName: '',
                    resourceType: '',
                    resourceCode: '',
                    resourceName: '',
                    resourceValue: '',
                    iconValue: '',
                    encryptFlag: '',
                    privilegeFlag: '',
                    createdBy: -1,
                    createdDate: '',
                    lastUpdatedBy: -1,
                    lastUpdatedDate: '',
                    enableFlag: 'Y',
                    orgId: -1,
                    parentMenu: null,
                };
                this.getResourceNode();
            }
        }
    },
    computed: {
        ...mapGetters([
            'appContextPath',
            'loginUser',
            'loginUserOrgList'
        ])
    },
    methods: {
        getResourceNode() {
            const scope = this;
            
            if(this.isEditDialog) {
                this.startLoading = true;
                this.$http.post(`${this.appContextPath}sysman/Resource/getList.serv`,
                    {
                        bo: this.params,
                        sort:"RESOURCE_CODE",
                        order:"asc"
                    }
                    ).then(success => {
                        if (success && success.data && success.data.bo) {
                            if(success.data.bo.length) {
                                scope.resourceForm = success.data.bo[0];
                            }
                        }
                        scope.startLoading = false;
                    }, error => {
                        scope.startLoading = false;
                    });
            }else {
                this.resourceForm.parentName = this.params.parentMenu['resourceName'];
                this.resourceForm.resourceType = this.params.functionType;
            }
        },
        onSubmit() {
            const scope = this;
            this.$refs['resourceForm'].validate((valid) => {
                if (valid) {
                    scope.startLoading = true;
                    if(this.isEditDialog){
                        delete this.resourceForm.createdBy;
                        delete this.resourceForm.createdDate;
                        this.resourceForm.lastUpdatedBy = this.loginUser.account;
                        this.resourceForm.lastUpdatedDate = (new Date()).format("yyyy-MM-dd hh:mm:ss");
                    }else{
                        delete this.resourceForm.lastUpdatedBy;
                        delete this.resourceForm.lastUpdatedDate;
                        this.resourceForm.createdBy = this.loginUser.account;
                        this.resourceForm.createdDate = (new Date()).format("yyyy-MM-dd hh:mm:ss");
                        this.resourceForm.parentId = '0';
                        this.resourceForm.parentMenu = this.params.parentMenu;
                        if(this.params.parentMenu && this.params.parentMenu['id']!=0) {
                            this.resourceForm.resourceCode = this.params.functionCode + this.resourceForm.resourceCode;
                        }
                    }
                    this.resourceForm.orgId = this.loginUser.orgId;
                    scope.$http.post(`${scope.appContextPath}sysman/Resource/${this.isEditDialog?'update':'insert'}.serv`,
                        this.resourceForm
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
        const scope = this;
        this.orgName = this.loginUserOrgList.filter(e=>(e.dictValue == scope.loginUser.orgId))[0].dictName;
        this.getResourceNode();
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
