<template>
  <div class="class-create-page">
    <el-card>
      <div slot="header" class="clearfix">
        <span>新建课程</span>
      </div>
      <el-form :model="courseInfo" label-width="120px" ref="ruleForm" :rules="rules">
        <el-form-item label="课程名称" prop="courseName">
          <el-col :span="12">
            <el-input v-model="courseInfo.courseName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="课程类型" prop="selectedTypeId">
          <el-cascader
                  expand-trigger="hover"
                  :options="courseTypes"
                  :show-all-levels="false"
                  :props="typeProps"
                  v-model="selectedTypeId">
          </el-cascader>
        </el-form-item>
        <el-form-item label="任课教师" prop="accountId">
          <el-select v-model="courseInfo.accountId" placeholder="请任课教师">
            <el-option v-for="(item, index) of teacherList" :key="index" :label="item.name" :value="item.accountId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上课日期" prop="courseTime">
          <el-date-picker
                  v-model="courseInfo.courseTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="课程时间" prop="startCourse">
          <el-time-picker v-model="courseInfo.startCourse" placeholder="上课时间">
          </el-time-picker>
          <span> 至 </span>
          <el-time-picker v-model="courseInfo.endCourse" placeholder="下课时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="课程座位图" prop="seatId">
          <el-select v-model="courseInfo.seatId" placeholder="请选择座位图">
            <el-option v-for="(item, index) of seatList" :key="index" :label="seatTitle(item)" :value="item.seatId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="总课时" prop="courseTotal">
          <el-col :span="12"><el-input v-model="courseInfo.courseTotal"></el-input></el-col>
        </el-form-item>
        <el-form-item label="单节费用" prop="coursePerCost">
          <el-input v-model="courseInfo.coursePerCost" style="width: 140px"></el-input>
        </el-form-item>
        <el-form-item label="总费用">
          <div style="padding-left: 15px;">{{courseInfo.coursePerCost * courseInfo.courseTotal}}</div>
        </el-form-item>
        <el-form-item label="收费模式">
          <el-radio-group v-model="courseInfo.chargeType">
            <el-radio label="1">按时</el-radio>
            <el-radio label="2">按分成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" v-if="courseInfo.chargeType === '1'">
          <el-row>
            <el-col :span="6">单节基本工资</el-col>
            <el-col :span="6">超出（人）</el-col>
            <el-col :span="6">提成（元）</el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><el-input v-model="courseInfo.averageHourCost" style="width: 80%"></el-input></el-col>
            <el-col :span="6"><el-input v-model="courseInfo.exceedNum" style="width: 80%"></el-input></el-col>
            <el-col :span="6"><el-input v-model="courseInfo.extraCharge" style="width: 80%"></el-input></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="" v-if="courseInfo.chargeType === '2'">
          <el-row>
            <el-col :span="6">出勤课时费</el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><el-input v-model="courseInfo.percentageValue" style="width: 80%"></el-input><span> %</span></el-col>
          </el-row>
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
    title: '新建课程',
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
          coursePerCost: null,
          teacherChargeType: '1', // 教师收费类型:1按时(按课时出席人数)2按提成(分成)
          chargeType: '1', // 1按时2按分成
          averageHour: null, // 按【averageHour】小时收费
          averageHourCost: null, // 按【averageHour】小时收费【averageHourCost】
          percentage: null,
          percentageValue: null, //
          courseTime: null,
          startCourse: null, // 上课时间
          endCourse: null, // 下课时间
          extraCharge: null
        },
        // startCourse: null, // 上课时间
        // endCourse: null, // 下课时间
        selectedTypeId: [],
        // courseTime: null,
        seatList: [], // 座位列表
        courseTypes: [], // 课程类型列表
        teacherList: [], // 教师数据
        typeProps: {
          value: 'typeId',
          label: 'typeName',
          children: 'courseTypeList'
        },
        rules: {
          courseName: [
            { required: true, message: '请输入课程名称', trigger: 'blur' }
          ],
          // selectedTypeId: [
          //   { required: true, message: '请选择课程类型', trigger: 'change' }
          // ],
          accountId: [
            { required: true, message: '请选择任课教师', trigger: 'change' }
          ],
          courseTime: [
            { required: true, message: '请选择上课日期', trigger: 'change' }
          ],
          startCourse: [
            { required: true, message: '请选择上课时间', trigger: 'change' }
          ],
          endCourse: [
            { required: true, message: '请选择下课时间', trigger: 'change' }
          ],
          seatId: [
            { required: true, message: '请选择课程座位图', trigger: 'change' }
          ],
          courseTotal: [
            { required: true, message: '请输入总课时', trigger: 'blur' }
          ],
          coursePerCost: [
            { required: true, message: '请输入单节费用', trigger: 'blur' }
          ]
        },
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
        this.seatList = data
      },
      // 加载课程类型
      async getCourseType() {
        const {data} = await courseTypeApi.getCourseTypeList({typeSeries: 0}).catch(e => e)
        this.courseTypes = data
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
        this.$refs['ruleForm'].validate(async (valid) => {
          if (valid) {
            if (!this.selectedTypeId) return this.$message('请选择课程类型')
            if (this.courseInfo.chargeType === '1') {
              if ((!this.courseInfo.averageHourCost && this.courseInfo.averageHourCost !== 0) || (!this.courseInfo.exceedNum && this.courseInfo.exceedNum !== 0) || (!this.courseInfo.extraCharge && this.courseInfo.extraCharge !== 0)) {
                return this.$message('请填写单节基本工资、超出（人）、提成（元）')
              }
            }
            if (this.courseInfo.chargeType === '2') {
              if ((!this.courseInfo.percentageValue && this.courseInfo.percentageValue !== 0)) {
                return this.$message('请填写出勤课时费')
              }
            }
            this.courseInfo.courseStartTime = this.$moment(this.courseInfo.courseTime[0]).format('YYYY/MM/DD') + ' ' + this.$moment(this.courseInfo.startCourse).format('HH:mm:ss')
            this.courseInfo.courseEndTime = this.$moment(this.courseInfo.courseTime[1]).format('YYYY/MM/DD') + ' ' + this.$moment(this.courseInfo.endCourse).format('HH:mm:ss')
            this.courseInfo.typeId = this.selectedTypeId[this.selectedTypeId.length - 1]
            this.courseInfo.percentage = this.courseInfo.percentageValue / 100 // 小数
            this.courseInfo.courseCost = this.courseInfo.coursePerCost * this.courseInfo.courseTotal
            const params = this.courseInfo
            delete params.percentageValue
            const {code} = await courseApi.addCourse(params).catch(e => e)
            if (code !== '200') return this.$message({type: 'error', message: '创建失败！'})
            this.$message({
              type: 'success',
              message: '创建成功！'
            })
            this.$router.back()
          } else {
            this.$message('请填写必要信息！')
            return false
          }
        })
      }
    },
    mounted() {
      this.loadData()
    }
  }
</script>
<style></style>