<template>
<!-- Element 2.0 已经不支持该属性 -->
<!-- custom-item="user-select-item"  select-when-unmatched="true" :trigger-on-focus="triggerOnFocus"-->
    <el-autocomplete style="width: 100%"
    popper-class="user-autocomplete" 
    v-model="text" 
    :fetch-suggestions="querySearchAsync"
    :placeholder="i18n['please_enter_employee_idname']" 
    @select="handleSelect" 
    :trigger-on-focus="false"
    :select-when-unmatched="true"
    >
        <template scope="props">
            <div class="name">{{props.item.value}}</div>
            <span class="dept">{{props.item.subValue}}</span>
        </template>
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

<style scoped>
.user-autocomplete li{
    line-height: normal;
    padding: 7px;
}

.user-autocomplete li .name {
    text-overflow: ellipsis;
    overflow: hidden;
}
.user-autocomplete li .dept {
    font-size: 12px;
    color: #b4b4b4;
}

.user-autocomplete li .highlighted .dept {
    color: #ddd;
}
  
</style>