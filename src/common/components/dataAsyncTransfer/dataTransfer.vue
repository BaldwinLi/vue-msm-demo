<template>
<div>
    <!-- :filter-method="queryData" -->
    <el-row :gutter="10" style="margin-bottom: 2rem;overflow-y: auto;">
        <el-transfer
            v-loading="startLoading"
            v-model="rightDataKeys"
            :titles="[leftTitle, rightTitle]"
            :filterable="true"
            :filter-method="filterData"
            :render-content="renderFunc"
            :filter-placeholder="placeholder"
            :data="leftData"
            :props="defaultProps">
    </el-transfer>
    </el-row>
    <el-row :gutter="10">
        <el-col :span="8" style="float: right;">
            <el-button type="primary" @click="saveSelect">
                <i class="iconfont alibaba-save"></i>
                    {{i18n['form_save']}}
            </el-button>
            <el-button @click="onClose">
                <i class="el-icon-circle-close-outline"></i>
                    {{i18n['form_close']}}
            </el-button>
        </el-col>
    </el-row>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Lang } from '@/common/data-i18n/initI18n';

export default {
    name: 'data-transfer',
    data() {
        return {
            leftData: [],
            rightData: [],
            rightDataKeys: [],
            leftCondition: '',
            rightCondition: '',
            defaultProps: {
                key: 'account',
                label: 'name'
                // disabled: 'disabled'
            },
            startLoading: false,
            i18n: Lang(),
            renderFunc(h, option) {
                return h(
                    'span', 
                    {
                        attrs: {
                            style: option.account==='$no_data_display'?"":"float: left;"
                        }
                    },
                    option.account==='$no_data_display' ? option.name : option.account + ' - ' + option.name
                );
            }
        }
    },
    props: {
        placeholder: {
            type: String,
             default: ''
        },
        leftQueryUrl: {
            type: String,
            default: ''
        },
        rightQueryUrl: {
            type: String,
            default: ''
        },
        saveUrl: {
            type: String,
            default: ''
        },
        leftTitle: {
            type: String,
            default: 'Left'
        },
        rightTitle: {
            type: String,
            default: 'Right'
        },
        params: {
            type: Object,
            default() {
                return {
                    
                    id: -1,
                    roleCode: '',
                    roleName: '',
                    roleCategory: '',
                    parentId: '',
                    createdBy: 0,
                    createdDate: '',
                    lastUpdatedBy: 0,
                    lastUpdatedDate: '',
                    enableFlag:"Y",
                    orgId: -1
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
            val && this.initData();
        }
    },
    computed: {
        ...mapGetters([
            'appContextPath'
        ])
    },
    methods: {
        filterData(condition, item){
            if(condition !== this.leftCondition && !this.rightDataKeys.includes(item.account)) {
                this.asyncQueryUser(condition);
                this.leftCondition = condition;
            } else if (condition !== this.rightCondition) {
                return item.account.indexOf(condition) > -1 || item.name.indexOf(condition) > -1;
            } else return true;
        },
        queryUserByStr(str) {
            const scope = this;
            scope.$http.post(scope.appContextPath + scope.leftQueryUrl,
                {
                    page: 1,
                    rows: 50,
                    bo: {
                            account: str || '',
                            name: str || ''
                    },
                    sort: scope.defaultProps.label, 
                    order:'desc'
                }
            ).then(
                success => {
                    if(success.data && success.data.bo && success.data.bo.rows) {
                        scope.leftData = success.data.bo.rows
                        .filter(e=>(!scope.rightDataKeys.includes(e.account))).concat(scope.rightData);
                        if(success.data.bo.rows.length===0) {
                            scope.leftData.push({
                                account: "$no_data_display", 
                                name: scope.i18n['no_data'],
                                disabled: "true"})

                        }
                    }
                    scope.startLoading = false;
                },
                error => (scope.startLoading = false)
            );
        },
        initData() {
            this.startLoading = true;
            const scope = this;
            this.$http.post(this.appContextPath + this.rightQueryUrl,
            {
                bo: this.params,
                order: "desc",
                sort: "name"
            }
            ).then(
                success => {
                    if(success.data && success.data.bo) {
                        scope.rightData = success.data.bo;
                        scope.rightDataKeys = scope.rightData.map(v=>v.account);
                    }
                    return true;
                },
                error => (scope.startLoading = false)
            ).then(
                success => {
                    if(success) { scope.queryUserByStr() }
                }
            );
        },
        saveSelect() {
            this.startLoading = true;
            const scope = this;
            this.$http.post(this.appContextPath + this.saveUrl,
            {
                bo: this.params,
                other: {
                    userList: this.rightDataKeys
                }
            }
            ).then(
                success => {
                   success && scope.close('success');
                   scope.startLoading = false;
                },
                error => (scope.startLoading = false)
            );
        },
        onClose() {
            this.close();
        },
        asyncQueryUser:  _.debounce(function (str) {
            this.queryUserByStr(str);
        }, 100)
    },
    mounted() {
        this.initData()
    }
}
</script>

<style>
.el-transfer-panel__item .el-checkbox__input {
    position: absolute;
    left: 8px;
    top: 8px;
}
/* .el-checkbox, .el-checkbox__input {
    display: inline-block;
    position: relative;
    white-space: nowrap;
} */
</style>