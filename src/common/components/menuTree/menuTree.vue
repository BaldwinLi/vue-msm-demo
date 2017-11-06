<template>
<div style="height: 100%; width: 100%;">
    <el-row :gutter="10" style="height: 50rem; overflow-y: auto;">
        <el-tree v-loading="startLoading"
            :data="treeData"
            show-checkbox
            node-key="id"
            ref="tree"
            default-expand-all="true"
            :props="defaultProps">
        </el-tree>
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
import { buildTreeData } from '@/common/components/utils';

export default {
    name: 'menu-tree',
    data() {
        return {
            startLoading: false,
            treeData: [],
            defaultProps: {
                children: 'children',
                label: 'resourceName'
            },
            i18n: Lang()
        }
    },
    props: {
        params: {
            type: Object,
            default() {
                return {
                    id: -1,
                    resourceType: -1
                }
            }
        },
        url: {
            type: String,
            default: ''
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
            val && this.refreshTreeMenu();
        }
    },
    computed: {
        ...mapGetters([
            'appContextPath',
            'loginUser'
        ])
    },
    methods: {
        refreshTreeMenu() {
            const scope = this;
            this.startLoading = true;
            const bo = {};
            for (const i in this.params) {
                bo[i] = this.params[i];
            }
            this.$http.post(this.url,
                {
                    bo,
                    sort:"",
                    order:"desc"}
            ).then(
                success => {
                   scope.treeData = buildTreeData(success && success.data && success.data.bo);
                   scope.$refs.tree.setCheckedKeys(scope.treeData.filter(e=>(e.privilegeFlag === 'Y')).map(v=>v.id), true);
                   scope.startLoading = false;
                },
                error => (scope.startLoading = false)
            );
        },
        saveSelect() {
            const ids = this.$refs.tree.getCheckedKeys().join(',');
            const scope = this;
            const resType = this.params.resourceType.split(',').map(v=>v.replace(/^\s*|\s*$/g, '').replace(/^\'*|\'*$/g, '')).join(',');
            scope.startLoading = true;
            this.$http.post(`
                ${this.appContextPath}sysman/RoleResource/save.serv?ids=${ids}&type=${resType}
                `,
                {
                    id: Math.floor(Math.random() * 10000) + 1,
                    resourceId: null,
                    roleId: this.params.id,
                    orgId: this.loginUser.orgId,
                    enableFlag:"Y",
                    createdBy: this.loginUser.account,
                    createdDate: (new Date()).format("yyyy-MM-dd hh:mm:ss"),
                    functionCodes:""}
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
        }
    },
    mounted() {
        this.refreshTreeMenu();
    }
}
</script>