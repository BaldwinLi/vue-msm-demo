<template>
    <el-autocomplete style="width: 100%"
    popper-class="autocomplete" 
    v-model="text" 
    :fetch-suggestions="querySearchAsync" 
    custom-item="user-select-item" 
    :placeholder="i18n['please_enter_employee_idname']" 
    @select="handleSelect" 
    :trigger-on-focus="triggerOnFocus">
    </el-autocomplete>
</template>

<script>
import { mapGetters } from 'vuex';
import { Lang } from '@/common/data-i18n/initI18n';

export default {
    name: 'user-select',
    data(){
        return {
            text: '',
            i18n: Lang()
        }
    },
    computed: {
        ...mapGetters([
            'appContextPath'
        ])
    },
    props: {
        value: String,
        rules: {
            type: Array,
            default: []
        },
        select: {
            type: Function,
            default: this.handleSelect
        },
        triggerOnFocus: {
            type: Boolean,
            default: false
        }
    },
    watch:{
        value(val) {
            if(!val) this.text = '';
        }
    },
    methods: {
        querySearchAsync(queryString, callback) {
            this.$http.post(`${this.appContextPath}formman/FormDataSourceManageTOdi/getAnalysisDataList.serv?it=8`,
            {"dataSourceId":"5867","searchData":JSON.stringify({
                "param": queryString
            })},
            ).then(
                success => {
                    if(success && success.data && success.data.other && success.data.other.dataList)
                    callback(success.data.other.dataList.map(v=>({
                        id: v.SHORTNO,
                        value: `${v.SHORTNO} / ${v.EMPLOYEE_NAME}`,
                        subValue: v.DEPTNAME
                    })));
                }
            );
        },
        handleSelect(item){
            this.$emit('input',item.id);
        }
    }
}
</script>

