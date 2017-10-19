<template>
    <div style="height: 100%; width: 100%;">
        <el-table :data="rows" v-loading="noticeStartLoading" :element-loading-text="i18n['hard_loading']" style="width: 100%" :row-class-name="tableRowClassName">
            <el-table-column prop="notice" :label="i18n['public_announcement']">
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Lang } from '@/common/data-i18n/initI18n';

export default {
    name: 'notice-show',
    data() {
        return {
            noticeStartLoading: false,
            rows: [],
            currentPage: 1,
            totalCount: 0,
            pageSize: 20,
            i18n: Lang()
        }
    },
    computed: {
        tableRowClassName(row, index) {
            if (index % 2) {
                return 'info-row';
            } else {
                return 'positive-row';
            }
            return '';
        },
        ...mapGetters([
            'appContextPath'
        ])
    },
    methods: {
        handleSizeChange(size) {
            this.pageSize = size;
            this.refreshTableData(this.currentPage, size);
        },
        handleCurrentChange(current) {
            this.currentPage = current;
            this.refreshTableData(current, this.pageSize);
        },
        refreshTableData(page, rows) {
            const scope = this;
            this.noticeStartLoading = true;
            this.$http.post(`${this.appContextPath}sysman/Notice/getPage.serv`,
                {
                    "bo": {
                        "id": "",
                        "content": "",
                        "category": "",
                        "subCategory": "",
                        "enableFlag": "Y"
                    },
                    "order": "desc",
                    "sort": "createdDate",
                    "page": page,
                    "rows": rows
                }
            ).then(success => {
                if (success) {
                    if (success.data && success.data.bo) {
                        scope.rows = success.data.bo.rows;
                        scope.currentPage = success.data.bo.current;
                        scope.totalCount = success.data.bo.total;
                    }

                    scope.noticeStartLoading = false;
                }
            }, error => {
                scope.noticeStartLoading = false;
            });
        }
    },
    mounted() {
        this.refreshTableData(this.currentPage, this.pageSize);
    }
}
</script>
