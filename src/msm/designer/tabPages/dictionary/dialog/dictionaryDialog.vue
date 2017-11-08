<template>
    <div style="height: 100%; width: 100%;">
        <el-form v-loading="startLoading" label-position="left" :rules="rules" label-width="12rem" ref="dictionaryForm" :element-loading-text="i18n['hard_loading']" :inline="true" :model="dictionaryForm" class="demo-form-inline">
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item :label="i18n['dictionary_id']">
                        <el-input :disabled="true" v-model="dictionaryForm.id"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="i18n['parent_dictionary_id']">
                        <el-input :disabled="true" v-model="dictionaryForm.parentId"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item :label="i18n['dict_code']" prop="dictCode" style="float: left;margin-left:1.5rem;">
                        <el-input v-model="dictionaryForm.dictCode" :placeholder="i18n['please_enter_dictCode']"></el-input>
                    </el-form-item>
                </el-col>
            <!-- </el-row>
            <el-row :gutter="10"> -->
                <el-col :span="12">
                    <el-form-item :label="i18n['dict_name']" prop="dictName" style="float: left;margin-left:1.5rem;">
                        <el-input v-model="dictionaryForm.dictName" :placeholder="i18n['please_enter_dictName']"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item :label="i18n['dict_value']" prop="dictValue">
                        <el-input v-model="dictionaryForm.dictValue" :placeholder="i18n['please_enter_dictValue']"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item style="width: 100%;" :label="i18n['view_level']" prop="viewLevel">
                        <el-select style="width: 20rem;" v-model="dictionaryForm.viewLevel" clearable :placeholder="i18n['please_enter_viewLevel']">
                            <el-option
                                v-for="item in VIEW_LEVELS"
                                :key="item.id"
                                :label="item.value"
                                :value="item.id">
                            </el-option>
                         </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="16">
                    <el-form-item :label="i18n['effect_date_range']" prop="dateRange">
                        <el-date-picker
                            v-model="dictionaryForm.dateRange"
                            type="daterange"
                            align="right"
                            unlink-panels
                            :range-separator="i18n['to']"
                            :start-placeholder="i18n['effective_date']"
                            :end-placeholder="i18n['expiration_date']"
                            :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="10">
                    <el-form-item :label="i18n['order_by']" prop="orderBy">
                        <el-input-number v-model="dictionaryForm.orderBy" controls-position="right" :min="0" :max="100"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="i18n['enable_flag']">
                        <el-switch 
                            v-model="dictionaryForm.enableFlag" 
                            active-value="Y"
                            inactive-value="N"
                        ></el-switch>
                    </el-form-item>
                </el-col>
            </el-row>
             <el-row>
                <el-form-item :label="i18n['form_back_reason']" prop="remark">
                    <el-input style="width:55rem" type="textarea" :autosize="{ minRows: 2, maxRows: 5}" v-model="dictionaryForm.remark"></el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-col :span="12">
                        <el-form-item :label="i18n['org_text_label']">
                            <el-input :disabled="true" v-model="orgName"></el-input>
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
import { VIEW_LEVEL } from '@/common/dataModel';

export default {
    name: 'dictionary-dialog',
    data() {
        return {
            startLoading: false,
            dictionaryForm: {
                        createdBy: '',
                        orgName: '',
                        createdDate: '',
                        dictCode: '',
                        dictName: '',
                        dictValue: '',
                        dateRange: '',
                        effectiveDate: '',
                        enableFlag: 'Y',
                        expirationDate: '',
                        id: Math.floor(Math.random() * 1e4) + 1,
                        lastUpdatedBy: '',
                        lastUpdatedDate: '',
                        levelName: '',
                        orderBy: '0',
                        orgId: '',
                        parentDictCode: '',
                        parentI: '',
                        remark: '',
                        viewLevel: ''
                    },
            VIEW_LEVELS: VIEW_LEVEL,
            rules: {
                dictCode: [
                    { required: true, message: Lang()['please_enter_dictCode'] }
                ],
                dictName: [
                    { required: true, message: Lang()['please_enter_dictName'] }
                ],
                dictValue: [
                    { required: true, message: Lang()['please_enter_dictValue'] }
                ],
                viewLevel: [
                    { required: true, message: Lang()['please_enter_viewLevel'] }
                ],
                dateRange: [
                    { required: true, message: Lang()['please_enter_dateRange'] }
                ],
                orderBy: [
                    { required: true, message: Lang()['please_enter_orderBy'] }
                ]
            },
            pickerOptions: {
            shortcuts: [{
                            text: Lang()['last_one_week'],
                            onClick(picker) {
                                    const end = new Date();
                                    const start = new Date();
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                    picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: Lang()['last_one_month'],
                            onClick(picker) {
                                    const end = new Date();
                                    const start = new Date();
                                    start.setMonth(start.getMonth() - 1);
                                    picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: Lang()['last_three_months'],
                            onClick(picker) {
                                    const end = new Date();
                                    const start = new Date();
                                    start.setMonth(start.getMonth() - 3);
                                    picker.$emit('pick', [start, end]);
                            }
            }]
        },
            i18n: Lang()
        }
    },
    props: {
        params: {
            type: Object,
            default() {
                return {
                        createdBy: '',
                        createdDate: '',
                        dictCode: '',
                        dictName: '',
                        dictValue: '',
                        effectiveDate: '',
                        enableFlag: 'Y',
                        expirationDate: '',
                        id: '',
                        lastUpdatedBy: '',
                        lastUpdatedDate: '',
                        levelName: '',
                        orderBy: '0',
                        orgId: '',
                        parentDictCode: '',
                        parentId: '',
                        remark: '',
                        viewLevel: ''
                    }
            }
        },
        parentId: {
            type: String,
            default: ''
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
                this.$refs['dictionaryForm'].resetFields();
                this.dictionaryForm = this.isEditDialog?this.params:
                    {
                        createdBy: '',
                        createdDate: '',
                        dictCode: '',
                        dictName: '',
                        dictValue: '',
                        effectiveDate: '',
                        enableFlag: 'Y',
                        expirationDate: '',
                        id: Math.floor(Math.random() * 1e4) + 1,
                        lastUpdatedBy: '',
                        lastUpdatedDate: '',
                        levelName: '',
                        orderBy: '0',
                        orgId: '',
                        parentDictCode: '',
                        parentId: this.parentId,
                        remark: '',
                        viewLevel: ''
                    };
                if(this.isEditDialog) {
                    this.dictionaryForm.dateRange = [new Date(this.params.effectiveDate), new Date(this.params.expirationDate)]
                }
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
        onSubmit() {
            const scope = this;
            this.$refs['dictionaryForm'].validate((valid) => {
                if (valid) {
                    scope.startLoading = true;
                    scope.dictionaryForm.effectiveDate = scope.dictionaryForm.dateRange[0].format('yyyy-MM-dd hh:mm:ss');
                    scope.dictionaryForm.expirationDate = scope.dictionaryForm.dateRange[1].format('yyyy-MM-dd hh:mm:ss');
                    delete scope.dictionaryForm.dateRange;
                    if(scope.isEditDialog){
                        scope.dictionaryForm.lastUpdatedBy = scope.loginUser.account;
                        scope.dictionaryForm.lastUpdatedDate = (new Date()).format("yyyy-MM-dd hh:mm:ss");
                    }else{
                        scope.dictionaryForm.createdBy = scope.loginUser.account;
                        scope.dictionaryForm.createdDate = (new Date()).format("yyyy-MM-dd hh:mm:ss");
                    }
                    scope.dictionaryForm.orgId = scope.loginUser.orgId;
                    scope.$http.post(`${scope.appContextPath}sysman/Dictionary/${scope.isEditDialog?'update':'insert'}.serv`,
                        scope.dictionaryForm
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
        this.dictionaryForm = this.isEditDialog?this.params:
                    {
                        createdBy: '',
                        createdDate: '',
                        dictCode: '',
                        dictName: '',
                        dictValue: '',
                        dateRange: '',
                        effectiveDate: '',
                        enableFlag: 'Y',
                        expirationDate: '',
                        id: Math.floor(Math.random() * 1e4) + 1,
                        lastUpdatedBy: '',
                        lastUpdatedDate: '',
                        levelName: '',
                        orderBy: '0',
                        orgId: '',
                        parentDictCode: '',
                        parentId: this.parentId || 0,
                        remark: '',
                        viewLevel: ''
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
