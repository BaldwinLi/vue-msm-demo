<template>
    <div style="height: 100%; width: 100%;">
        <el-form v-loading="startLoading" :element-loading-text="i18n['hard_loading']" :inline="true" :model="tempForm" class="demo-form-inline">
            <el-form-item :label="i18n['form_template_classification']">
                <el-select v-model="tempForm.classification" :placeholder="i18n['please_select']">
                    <el-option v-for="(item, index) in tempSet" :key="index" :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="width:40%" :label="i18n['form_template']">
                <el-autocomplete style="width:200%" class="inline-input" v-model="tempForm.template" :fetch-suggestions="querySearch" :placeholder="i18n['please_select_template_classification']" @select="selectTemplate"></el-autocomplete>
            </el-form-item>
            <el-form-item style="margin-left:2%">
                <el-button type="primary" @click="onSubmit">{{i18n['create']}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Lang } from '@/common/data-i18n/initI18n';

export default {
    name: 'create-review',
    data() {
        return {
            startLoading: false,
            tempSet: [],
            tempList: [],
            tempForm: {
                classification: '',
                template: ''
            },
            templateId: '',
            i18n: Lang()
        }
    },
    computed: {
        ...mapGetters([
            'appContextPath',
            'isLocal'
        ])
    },
    methods: {
        querySearch(str, cb) {
            cb(str ? this.tempList.filter(e => (e.value.indexOf(str) > -1 && e.value.indexOf(this.tempForm.classification) > -1)) : this.tempList.filter(e => (this.tempForm.classification ? e.value.indexOf(this.tempForm.classification) > -1 : true)));
        },
        refreshTemplatesList() {
            const scope = this;
            this.startLoading = true;
            this.$http.post(`${this.appContextPath}newreview/NewReview/getTemplateList.serv`, {}
            ).then(success => {
                if (success) {
                    if (success.data && success.data.bo) {
                        scope.tempSet = success.data.other.tempSet;
                        scope.tempList = success.data.bo.map((v) => ({
                            value: v.split('/')[1],
                            id: v.split('/')[0]
                        }));
                    }

                    scope.startLoading = false;
                }
            }, error => {
                scope.startLoading = false;
            });
        },
        onSubmit() {
            const scope = this;
            if (!this.templateId) {
                this.$message({
                    message: this.i18n['please_select_template_classification'],
                    type: 'warning'
                });
                return;
            }
            this.startLoading = true;
            this.$http.post(`${this.appContextPath}newreview/NewReview/getFormFilePath.serv`,
                { "bo": { "templateId": this.templateId } }
            ).then(success => {
                if (success) {
                    if (success.data && success.data.bo) {
                        window.open(`${this.isLocal?'http://10.5.5.145:8080':location.origin}/Form_002_Define${success.data.bo.split('/Form_002_Define')[1]}`);
                    } else {
                        scope.$alert(scope.i18n['temp_not_exist'], scope.i18n['error'], {
                            confirmButtonText: scope.i18n['form_confirm']
                        });
                    }
                    scope.startLoading = false;
                }
            }, error => {
                scope.startLoading = false;
            });
        },
        selectTemplate(item) {
            this.templateId = item.id;
            this.tempForm.classification = this.tempSet.filter(e => _.startsWith(item.value, e))[0];
        }
    },
    mounted() {
        this.refreshTemplatesList();
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
