<template>
  <div class="course-order-paid-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>支付成功订单</span>
      </div>
      <el-table :data="tableData.list" v-loading="tableData.loading" style="width: 100%">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="date" label="ID" width="180">
        </el-table-column>
        <el-table-column prop="name" label="学生姓名" width="180">
        </el-table-column>
        <el-table-column prop="address" label="已支付课程">
        </el-table-column>
        <el-table-column prop="address" label="时间">
        </el-table-column>
        <el-table-column prop="address" label="金额">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text">详情</el-button>
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
          keyword: '',
          pageNum: 1,
          pageSize: 10,
        },
      })
    },
    methods: {
      onCurrentPageChange(page) {
        this.searchForm.pageNum = page
        this.queryCourseOrderList()
      },
      async queryCourseOrderList() {
        this.tableData.loading = true
        const {total, list} = await courseApi.getCourseOrderList({
          ...this.searchForm,
          orderStatus: 1, //
        }).catch(e => e)

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