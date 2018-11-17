<template>
  <div class="class-release-page">
    <el-card class="box-card">
      <div slot="header" style="text-align: right;"><el-button type="text" @click="addType()">新增</el-button></div>
      <el-table :data="tableData.list">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table :data="scope.row.courseTypeList" :show-header="false">
              <el-table-column label="课程类型名称" prop="typeName"></el-table-column>
              <el-table-column label="更新时间" prop="updateTime"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="updateInfo(scope.row)">修改</el-button>
                  <el-button type="text" @click="deleteType(scope.row.typeId)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="课程类型名称" prop="typeName"></el-table-column>
        <el-table-column label="更新时间" prop="updateTime"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="addType(scope.row)">新增子类型</el-button>
            <el-button type="text" @click="updateInfo(scope.row)">修改</el-button>
            <el-button type="text" @click="deleteType(scope.row.typeId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--新增修改-->
    <el-dialog :title="isAdd ? '新增类型' : '修改类型'" :visible.sync="dialogVisible" width="50%">
      <el-form label-width="150px">
        <el-form-item label="课程类型名称：">
          <el-input v-model="updateCourseType.typeName" type="text"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmUpdate">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  // components
  import MyPagination from '../../../components/pagination/MyPagination.vue'
  // API
  import * as courseTypeApi from '../../../apis/courseTypeApi'
  export default {
    title: '课程类型',
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
        dialogVisible: false,
        isAdd: false,
        updateCourseType: {
          typeName: null,
          typeSeries: 0
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
        const {data} = await courseTypeApi.getCourseTypeList({typeSeries: 0}).catch(e => e)
        this.tableData.list = data || []
        this.tableData.loading = false
      },
      // 修改
      async updateInfo(info) {
        console.log(info)
        this.isAdd = false
        this.updateCourseType = {...info}
        this.dialogVisible = true
      },
      // 新增
      async addType(info) {
        this.updateCourseType.typeName = null
        this.isAdd = true
        // 父级id
        this.updateCourseType.typeSeries = info ? info.typeId : 0
        this.dialogVisible = true
      },
      async confirmUpdate() {
        if (!this.updateCourseType.typeName) return this.$message('请输入类型名称')
        if (this.isAdd) {
          const params  = {
            typeName: this.updateCourseType.typeName,
            typeSeries: this.updateCourseType.typeSeries || 0,
            deleted: false
          }
          const {code, msg} = await courseTypeApi.addCourseType(params).catch(e => e)
          if(code !== '200') return this.$message('新增失败，' + msg)
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message: '新增成功！'
          })
          this.queryClassList()
        } else {
          const {code, msg} = await courseTypeApi.updateCourseType(this.updateCourseType).catch(e => e)
          if(code !== '200') return this.$message('修改失败，' + msg)
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message: '修改成功！'
          })
          this.queryClassList()
        }
      },
      // 删除课程类型
      async deleteType(typeId) {
        this.$confirm('确定要删除该类型?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {code, msg} = await courseTypeApi.deleteCourseType({typeId}).catch(e => e)
          if (code !== '200') return this.$message('删除失败，' + msg)
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
          this.queryClassList()
        }).catch(() => {})
      }
    },
    mounted() {
      this.queryClassList()
    }
  }
</script>
<style></style>