<template>
  <div class="income-detail-page">
    <el-card>
      <div slot="header" class="clearfix">
        <span>收入详情</span>
      </div>
      <el-table :data="tableData.list" v-loading="tableData.loading" style="width: 100%">
        <el-table-column prop="date" label="学号" width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="address" label="所在班级">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="dialogFormVisible = true">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <my-pagination
              :total="tableData.total"
              :currentPage.sync="searchForm.page"
              :page-size.sync="searchForm.pageSize"
              @current-change="onCurrentPageChange">
      </my-pagination>
    </el-card>
  </div>
</template>
<script>
  // components
  import MyPagination from '../../../components/pagination/MyPagination.vue'
  // API
  import * as incomeApi from '../../../apis/incomeApi'
  export default {
    title: '收入详情',
    name: 'income-detail-page',
    components: {
      MyPagination
    },
    data() {
      return ({
        tableData: {
          loading: true,
          list: [],
          total: 0
        },
        searchForm: {
          keyword: '',
          pageNum: 1,
          pageSize: 10,
        },
      })
    },
    methods: {
      onCurrentPageChange(page) {
        this.searchForm.pageNum = page
        this.queryIncomeList()
      },
      async queryIncomeList() {
        this.tableData.loading = true
        const {total, list} = await incomeApi.getIncomeList(this.searchForm).catch(e => e)

        this.tableData.total = total || 0
        this.tableData.list = list || []
        this.tableData.loading = false
      }
    },
    mounted() {
      this.queryIncomeList()
    }
  }
</script>
<style></style>