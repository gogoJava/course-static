<template>
  <div class="income-detail-page">
    <el-card style="margin-bottom: 15px;">
      <el-select v-model="date" multiple filterable allow-create default-first-option placeholder="时间" style="width: 400px;">
        <el-option v-for="item in timeList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-card>
    <el-card class="box-card" style="margin-bottom: 15px;">
      <!--<div slot="header" class="clearfix">-->
        <!--<span>支付成功订单</span>-->
      <!--</div>-->
      <el-table :data="orderData.list" v-loading="orderData.loading" style="width: 100%" @selection-change="orderSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="orderNo" label="订单号" width="180">
        </el-table-column>
        <el-table-column prop="name" label="学生姓名" width="180">
        </el-table-column>
        <el-table-column prop="courseName" label="已支付课程">
        </el-table-column>
        <el-table-column prop="updateTime" label="时间">
          <template slot-scope="scope">
            <span>{{$moment(scope.row.updateTime).format('YYYY-MM-DD HH:mm')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="courseCost" label="金额">
          <template slot-scope="scope">
            <span>¥ {{scope.row.courseCost}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;padding-top: 15px;padding-right: 120px;">
        <div>总计：{{totalOrderAmount}}元</div>
      </div>
      <my-pagination
              :total="orderData.total"
              :currentPage.sync="orderForm.page"
              :page-size.sync="orderForm.pageSize"
              @current-change="orderOnCurrentPageChange">
      </my-pagination>
    </el-card>
    <el-card>
      <!--<div slot="header" class="clearfix">-->
        <!--<span>收入详情</span>-->
      <!--</div>-->
      <el-table :data="tableData.list" v-loading="tableData.loading" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="courseName" label="班级名称">
        </el-table-column>
        <el-table-column prop="user.name" label="教师姓名">
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
        <div>当月总工资：{{totalIncomeAmount}}元</div>
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
  import * as courseApi from '../../../apis/courseApi'
  // store
  import {mapGetters} from 'vuex'
  import * as $account from '../../../store/modules/account/types'
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
        orderData:{
          loading: true,
          list: [],
          total: 0
        },
        searchForm: {
          pageNum: 1,
          pageSize: 10,
        },
        orderForm: {
          pageNum: 1,
          pageSize: 10,
        },
        multipleSelection: [],
        totalIncomeAmount: 0,
        totalOrderAmount: 0,
        date: []
      })
    },
    computed: {
      ...mapGetters($account.namespace, {
        currentUser: $account.getters.currentUser
      }),
      timeList() {
        // const list = new Array(10)
        const data = []
        data.push({
          value: this.$moment().format('YYYY/MM'),
          label: this.$moment().format('YYYY/MM')
        })
        data.push({
          value: this.$moment().subtract(1, 'months').format('YYYY/MM'),
          label: this.$moment().subtract(1, 'months').format('YYYY/MM')
        })
        data.push({
          value: this.$moment().subtract(2, 'months').format('YYYY/MM'),
          label: this.$moment().subtract(2, 'months').format('YYYY/MM')
        })
        data.push({
          value: this.$moment().subtract(3, 'months').format('YYYY/MM'),
          label: this.$moment().subtract(3, 'months').format('YYYY/MM')
        })
        data.push({
          value: this.$moment().subtract(4, 'months').format('YYYY/MM'),
          label: this.$moment().subtract(4, 'months').format('YYYY/MM')
        })
        data.push({
          value: this.$moment().subtract(5, 'months').format('YYYY/MM'),
          label: this.$moment().subtract(5, 'months').format('YYYY/MM')
        })
        return data
      }
    },
    watch: {
      date() {
        Promise.all([
          this.queryIncomeList(),
          this.orderQueryIncomeList()
        ])
      }
    },
    methods: {
      orderSelectionChange(val) {
        this.totalOrderAmount  = 0
        val.forEach(item => {
          this.totalOrderAmount = this.totalOrderAmount + item.courseCost
        })
      },
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
      orderOnCurrentPageChange(page) {
        this.orderForm.pageNum = page
        this.orderQueryIncomeList()
      },
      async queryIncomeList() {
        const params = {
          ...this.seagreen,
          date: this.date
        }
        this.tableData.loading = true
        const {data: {total, list}} = await incomeApi.getIncomeList(params).catch(e => e)

        this.tableData.total = total || 0
        this.tableData.list = list || []
        this.tableData.loading = false
      },
      async orderQueryIncomeList() {
        this.orderData.loading = true
        const {data} = await courseApi.getCourseOrderList({
          ...this.orderForm,
          orderStatus: 1, //
          date: this.date
        }).catch(e => e)
        const {total, list} = data
        this.orderData.total = total || 0
        this.orderData.list = list || []
        this.orderData.loading = false
      }
    },
    mounted() {
      this.queryIncomeList()
      this.orderQueryIncomeList()
    }
  }
</script>
<style></style>