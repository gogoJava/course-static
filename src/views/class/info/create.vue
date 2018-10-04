<template>
  <div class="class-create-page">
    <el-card>
      <div slot="header" class="clearfix">
        <span>新建班级</span>
      </div>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="班级名称">
          <el-col :span="12">
            <el-input v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="班级类型">
          <el-select v-model="form.region" placeholder="请班级类型">
            <el-option label="班级一" value="shanghai"></el-option>
            <el-option label="班级二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任课教师">
          <el-select v-model="form.region" placeholder="请任课教师">
            <el-option label="冯老师" value="shanghai"></el-option>
            <el-option label="松老师" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上课时间">
          <el-time-picker v-model="form.date1" :picker-options="{selectableRange: '18:30:00 - 20:30:00'}" placeholder="开始时间">
          </el-time-picker>
          <span> - </span>
          <el-time-picker arrow-control v-model="form.date2" :picker-options="{ selectableRange: '18:30:00 - 20:30:00' }" placeholder="结束时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="课程时长">
          <el-col :span="12"><el-input v-model="form.name"></el-input></el-col>
        </el-form-item>
        <el-form-item label="班级课时">
          <el-col :span="12"><el-input v-model="form.name"></el-input></el-col>
        </el-form-item>
        <el-form-item label="班级座位图">
          <el-select v-model="form.region" placeholder="请选择座位图">
            <el-option label="one" value="shanghai"></el-option>
            <el-option label="two" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课时费">
          <el-input v-model="form.name" style="width: 140px"></el-input>
          <span> /节</span>
        </el-form-item>
        <el-form-item label="教师工资">
          <el-radio-group v-model="form.resource">
            <el-radio label="人头"></el-radio>
            <el-radio label="分成"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="">
          <el-row>
            <el-col :span="6">半小时</el-col>
            <el-col :span="6">超出（人）</el-col>
            <el-col :span="6">提成（元）</el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><el-input style="width: 80%"></el-input></el-col>
            <el-col :span="6"><el-input style="width: 80%"></el-input></el-col>
            <el-col :span="6"><el-input style="width: 80%"></el-input></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="出勤课时费">
          <el-input v-model="form.name" style="width: 140px"></el-input>
          <span> %</span>
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
  // components
  export default {
    title: '新建班级',
    name: 'class-create-page',
    components: {
    },
    data() {
      return ({
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      })
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      }
    },
  }
</script>
<style></style>