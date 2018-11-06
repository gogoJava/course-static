<template>
  <div class="income-detail-page">
    <el-card>
      <div slot="header" class="clearfix">
        <span>个人信息</span>
      </div>
      <el-table :data="tableData.list" v-loading="tableData.loading" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="courseName" label="班级名称" width="180">
        </el-table-column>
        <el-table-column prop="createTime" label="时间" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.createTime.split(' ')[1]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label=日期>
          <template slot-scope="scope">
            <span>{{scope.row.createTime.split(' ')[0]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="actualNumber" label="出勤人数">
        </el-table-column>
        <el-table-column prop="incomeAmount" label="收入">
          <template slot-scope="scope">
            <span>{{scope.row.incomeAmount}}元</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;padding-top: 15px;padding-right: 120px;">
        <div>总计：{{totalIncomeAmount}}元</div>
      </div>
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
  // store
  import {mapGetters} from 'vuex'
  import * as $account from '../../../store/modules/account/types'
  export default {
    title: '个人信息',
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
          pageNum: 1,
          pageSize: 10,
        },
        multipleSelection: [],
        totalIncomeAmount: 0
      })
    },computed: {
      ...mapGetters($account.namespace, {
        currentUser: $account.getters.currentUser
      }),
    },
    methods: {
      handleSelectionChange(val) {
        this.totalIncomeAmount = 0
        this.multipleSelection = val
        this.multipleSelection.forEach(item => {
          this.totalIncomeAmount = this.totalIncomeAmount + item.incomeAmount
        })
      },
      onCurrentPageChange(page) {
        this.searchForm.pageNum = page
        this.queryIncomeList()
      },
      async queryIncomeList() {
        const params = {
            ...this.seagreen,
          accountId: this.currentUser.accountId
        }
        this.tableData.loading = true
        const {data: {total, list}} = await incomeApi.getIncomeList(params).catch(e => e)

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