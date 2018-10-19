<template>
  <div class="class-edit-page">
    <el-card>
      <div slot="header" class="clearfix">
        <span>课程信息</span>
      </div>
      <el-form ref="form" :model="courseInfo" label-width="120px">
        <el-form-item label="课程状态">
          <div>-> {{courseInfo.courseStatus | courseStatusMsg}}</div>
        </el-form-item>
        <el-form-item label="课程名称">
          <el-col :span="12">
            <el-input v-model="courseInfo.courseName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="课程类型">
          <el-cascader
                  expand-trigger="hover"
                  :options="courseTypes"
                  :props="typeProps"
                  :show-all-levels="false"
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
                  style="width: 500px;"
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
        <el-form-item label="课程课时">
          <el-col :span="12"><el-input v-model="courseInfo.courseCurrent"></el-input></el-col>
        </el-form-item>
        <el-form-item label="课程座位图">
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
          <el-button type="primary" @click="onSubmit">修改</el-button>
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
    title: '课程信息',
    name: 'class-edit-page',
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
        courseTime: [],
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
    computed: {
      courseId() {
        return this.$route.params.id
      }
    },
    filters: {
      courseStatusMsg(status) {
        // 状态（-1取消0新建未发布1已发布2进行中3结束）
        let msg = ''
        switch (status) {
          case '-1':
            msg = '已取消'
            break
          case '0':
            msg = '未发布'
            break
          case '1':
            msg = '已发布'
            break
          case '2':
            msg = '进行中'
            break
          case '3':
            msg = '已结束'
            break
        }
        return msg
      },
    },
    methods: {
      seatTitle(seat) {
        return seat.seatLeft + 'x' + seat.seatMid + 'x' + seat.seatRight + 'x' + seat.seatRows
      },
      async loadData() {
        Promise.all([
            this.querySeatList(),
            this.loadTeacherData(),
            this.queryCourseDetail()
        ])
      },
      // 加载课程信息
       async queryCourseDetail() {
        const {data} = await courseApi.getCourseDetail({courseId: this.courseId}).catch(e => e)
        this.courseInfo = {...data}
        this.courseTime.push(data.courseStartTime)
        this.courseTime.push(data.courseEndTime)
        this.getCourseType(data.typeId)
      },
      // 加载座位结构数据
      async querySeatList() {
        const {data} = await seatApi.getSeatList().catch(e => e)
        this.seatList = data
      },
      // 加载课程类型
      async getCourseType(typeId) {
        const {data} = await courseTypeApi.getCourseTypeList({typeSeries: 0}).catch(e => e)
        this.courseTypes = data
        // 匹配课程类型
        this.courseTypes.forEach(element => {
          if (element.typeId === typeId) {
            this.selectedTypeId.push(element.typeId)
            return
          }
          if (element.courseTypeList && element.courseTypeList.length) {
            element.courseTypeList.forEach(item => {
              if (item.typeId === typeId) {
                this.selectedTypeId.push(element.typeId)
                this.selectedTypeId.push(item.typeId)
              }
            })
          }
        })
      },
      // 加载教师信息
      async loadTeacherData() {
        const {data: {list}} = await userApi.getUserList({
          pageNum: 1,
          pageSage: 10,
          type: 2, // 用户类型:1学生2教师
           deleted: false
        }).catch(e => e)
        this.teacherList = list || []
      },
      async onSubmit() {
        const courseInfo = {
          courseName: this.courseInfo.courseName,
          courseStartTime: this.$moment(this.courseTime[0]).format('YYYY/MM/DD HH:mm:ss'),
          courseEndTime: this.$moment(this.courseTime[1]).format('YYYY/MM/DD HH:mm:ss'),
          courseTotal: this.courseInfo.courseTotal,
          courseCurrent: this.courseInfo.courseCurrent,
          seatId: this.courseInfo.seatId,
          typeId: this.selectedTypeId[this.selectedTypeId.length - 1],
          accountId: this.courseInfo.accountId,
          courseCost: this.courseInfo.courseCost,
          courseId: this.courseInfo.courseId
        }
        // if (this.courseInfo) return
        await courseApi.updateCourse(courseInfo).catch(e => e)
        this.$message({
          type: 'success',
          message: '修改成功！'
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