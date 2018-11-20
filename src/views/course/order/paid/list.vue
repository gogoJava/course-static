<template>
  <div class="course-order-paid-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>支付成功订单</span>
      </div>
      <el-table :data="tableData.list" v-loading="tableData.loading" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="orderNo" label="订单号" width="180">
        </el-table-column>
        <el-table-column prop="name" label="学生姓名" width="180">
        </el-table-column>
        <el-table-column prop="courseName" label="已支付课程">
        </el-table-column>
        <el-table-column prop="orderPayTime" label="时间">
           <template slot-scope="scope">
            <span>{{$moment(scope.row.orderPayTime).format('YYYY-MM-DD HH:mm')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="courseCost" label="金额">
          <template slot-scope="scope">
            <span>¥ {{scope.row.courseCost}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;padding-top: 15px;padding-right: 120px;">
        <div>总计：{{totalIncomeAmount}}元</div>
      </div>
      <my-pagination
              :total="tableData.total"
              :currentPage.sync="searchForm.pageNum"
              :page-size.sync="searchForm.pageSize"
              @current-change="onCurrentPageChange">
      </my-pagination>
    </el-card>
  </div>
</template>
<script>
  // components
  import MyPagination from '../../../../components/pagination/MyPagination.vue'
  // API
  import * as courseApi from '../../../../apis/courseApi'
  export default {
    title: '已支付订单',
    name: 'course-order-paid-list',
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
        totalIncomeAmount: 0
      })
    },
    methods: {
      handleSelectionChange(val) {
        this.totalIncomeAmount = 0
        val.forEach(item => {
          this.totalIncomeAmount = this.totalIncomeAmount + item.courseCost
        })
      },
      onCurrentPageChange(page) {
        this.searchForm.pageNum = page
        this.queryCourseOrderList()
      },
      async queryCourseOrderList() {
        this.tableData.loading = true
        const {data} = await courseApi.getCourseOrderList({
          ...this.searchForm,
          orderStatus: 1, //
        }).catch(e => e)
        const {total, list} = data
        this.tableData.total = total || 0
        this.tableData.list = list || []
        this.tableData.loading = false
      }
    },
    mounted() {
      this.queryCourseOrderList()
    }
  }
</script>
<style></style>