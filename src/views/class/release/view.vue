<template>
  <div class="class-release-page">
    <el-card class="box-card">
      <el-table :data="tableData.list" v-loading="tableData.loading" style="width: 100%">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="date" label="课程名称" width="180">
        </el-table-column>
        <el-table-column prop="name" label="任课教师" width="180">
        </el-table-column>
        <el-table-column prop="address" label="上课时间">
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
  import MyPagination from '../../../components/pagination/MyPagination.vue'
  // API
  import * as classApi from '../../../apis/classApi'
  export default {
    title: '发布课程',
    name: 'class-release-page',
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
        this.queryClassList()
      },
      async queryClassList() {
        this.tableData.loading = true
        const {total, list} = await classApi.getClassList({
          ...this.searchForm,
        }).catch(e => e)

        this.tableData.total = total || 0
        this.tableData.list = list || []
        this.tableData.loading = false
      }
    },
    mounted() {
      this.queryClassList()
    }
  }
</script>
<style></style>