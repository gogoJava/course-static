<template>
  <div class="class-create-page">
    <el-card>
      <div slot="header" class="clearfix">
        <span>新建班级</span>
      </div>
      <el-form ref="form" :model="courseInfo" label-width="120px">
        <el-form-item label="班级名称">
          <el-col :span="12">
            <el-input v-model="courseInfo.courseName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="班级类型">
          <el-cascader
                  expand-trigger="hover"
                  :options="courseTypes"
                  :props="typeProps"
                  v-model="selectedTypeId">
          </el-cascader>
        </el-form-item>
        <el-form-item label="任课教师">
          <el-select v-model="courseInfo.accountId" placeholder="请任课教师">
            <el-option v-for="(item, index) of teacherList" :key="index" :label="item.username" :value="item.accountId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上课时间">
          <el-date-picker
                  v-model="courseTime"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="总课时">
          <el-col :span="12"><el-input v-model="courseInfo.courseTotal"></el-input></el-col>
        </el-form-item>
        <el-form-item label="班级课时">
          <el-col :span="12"><el-input v-model="courseInfo.courseCurrent"></el-input></el-col>
        </el-form-item>
        <el-form-item label="班级座位图">
          <el-select v-model="courseInfo.seatId" placeholder="请选择座位图">
            <el-option v-for="(item, index) of seatList" :key="index" :label="seatTitle(item)" :value="item.seatId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课时费">
          <el-input v-model="courseInfo.courseCost" style="width: 140px"></el-input>
          <span> /节</span>
        </el-form-item>
        <el-form-item>
          <el-button @click="$router.back()">取消</el-button>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
  // API
  import * as courseApi from '../../../apis/courseApi'
  import * as seatApi from '../../../apis/seatApi'
  import * as courseTypeApi from '../../../apis/courseTypeApi'
  import * as userApi from '../../../apis/userApi'
  // components
  export default {
    title: '新建班级',
    name: 'class-create-page',
    components: {
    },
    data() {
      return ({
        courseInfo: {
          courseName: '',
          courseStartTime: '',
          courseEndTime: '',
          courseTotal: null,
          courseCurrent: null,
          seatId: '',
          typeId: null,
          accountId: '',
          courseCost: null,
        },
        selectedTypeId: [],
        courseTime: null,
        seatList: [], // 座位列表
        courseTypes: [], // 课程类型列表
        teacherList: [], // 教师数据
        typeProps: {
          value: 'typeId',
          label: 'typeName',
          children: 'courseTypeList'
        }
      })
    },
    methods: {
      seatTitle(seat) {
        return seat.seatLeft + 'x' + seat.seatMid + 'x' + seat.seatRight + 'x' + seat.seatRows
      },
      async loadData() {
        Promise.all([
            this.querySeatList(),
            this.getCourseType(),
            this.loadTeacherData()
        ])
      },
      // 加载座位结构数据
      async querySeatList() {
        const {data} = await seatApi.getSeatList().catch(e => e)
        console.log('querygetSeatList', data)
        this.seatList = data
      },
      // 加载课程类型
      async getCourseType() {
        const {data} = await courseTypeApi.getCourseTypeList({typeSeries: 0}).catch(e => e)
        console.log('getCourseType', data)
        this.courseTypes = data
      },
      // 加载教师信息
      async loadTeacherData() {
        const {data: {list}} = await userApi.getUserList({
          pageNum: 1,
          pageSage: 10,
          type: 2, // 用户类型:1学生2教师
        }).catch(e => e)
        this.teacherList = list || []
      },
      async onSubmit() {
        this.courseInfo.courseStartTime = this.$moment(this.courseTime[0]).format('YYYY-MM-DD HH:mm:ss')
        this.courseInfo.courseEndTime = this.$moment(this.courseTime[1]).format('YYYY-MM-DD HH:mm:ss')
        this.courseInfo.typeId = this.selectedTypeId[this.selectedTypeId.length - 1]
        console.log(this.courseInfo)
        // if (this.courseInfo) return
        await courseApi.addCourse(this.courseInfo).catch(e => e)
        this.$message({
          type: 'success',
          message: '创建成功！'
        })
        this.$router.back()
      }
    },
    mounted() {
      this.loadData()
    }
  }
</script>
<style></style>