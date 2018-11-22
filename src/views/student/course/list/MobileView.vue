<template>
  <div class="mobile-class-list-page" v-loading="tableData.loading">
    <div v-for="item of tableData.list" class="list-item">
      <div>
        <span>课程：{{item.courseName}}</span>
        <span style="float: right">{{item.courseStatus | courseStatusMsg}}</span>
      </div>
      <div>
        <span>任课老师：{{item.user.name}}</span>
        <span v-if="!item.orderStatus" class="tip-right-info">{{item.bought ? '已购买' : '未购买'}}</span>
        <span v-if="item.orderStatus" class="tip-right-info">{{item.orderStatus | orderStatusMsg}}</span>
      </div>
      <div style="font-size: 12px;color: #999999;">
        <span>上课时间：{{$moment(item.courseStartTime).format('YYYY-MM-DD')}} 至 {{$moment(item.courseEndTime).format('YYYY-MM-DD')}}</span>
        <span style="float: right;color: #409EFF;">
          <span v-if="item.orderStatus === '0'" @click="goPay(item)"></span>
          <span v-if="!item.orderStatus && !item.bought && (item.courseStatus === '1' || item.courseStatus === '2')" @click="goPay(item)">去下单购买</span>
        </span>
      </div>
    </div>
    <div style="text-align: center;padding-top: 15px;" :class="{'more': moreData, 'no-more': !moreData}" @click="loadMore">{{moreData ? '加载更多' : '无更多数据'}}</div>
  </div>
</template>
<script>
  // components
  import MyPagination from '../../../../components/pagination/MyPagination.vue'
  // API
  import * as classApi from '../../../../apis/classApi'
  // store
  import {mapGetters} from 'vuex'
  import * as $account from '../../../../store/modules/account/types'
  export default {
    title: '课程列表',
    name: 'class-list-page',
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
          pageSize: 20,
        },
        dialogVisible: false
      })
    },
    computed: {
      ...mapGetters($account.namespace, {
        currentUser: $account.getters.currentUser
      }),
      moreData() {
        return this.tableData.list.length < this.tableData.total
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
      orderStatusMsg(status) {
        // 状态(0未支付1成功2申请退款3退款)
        let msg = ''
        switch (status) {
          case '0':
            msg = '未支付'
            break
          case '1':
            msg = '支付成功'
            break
          case '2':
            msg = '申请退款'
            break
          case '3':
            msg = '已退款'
            break
        }
        return msg
      },
    },
    methods: {
      loadMore() {
        if (this.moreData) {
          this.searchForm.pageNum ++
          this.queryClassList()
        }
      },
      async queryClassList() {
        this.tableData.loading = true
        const params = {...this.searchForm}
        const {data} = await classApi.getClassList(params).catch(e => e)
        const {total, list} = data
        this.tableData.total = total || 0
        this.tableData.list = [...this.tableData.list, ...list]
        this.tableData.loading = false
      },
      // 去购买
      async goPay(courseInfo) {
        this.$router.push({path: '/home/class/order/pay', query: {courseId: courseInfo.courseId}})
      },
    },
    mounted() {
      this.queryClassList()
    }
  }
</script>
<style>
  .mobile-class-list-page {
    font-size: 14px;
    padding: 0;
    margin-bottom: 60px;
  }
  .mobile-class-list-page .list-item {
    border-bottom: 1px solid #cdcdcd;
    padding: 5px 15px;
  }
  .mobile-class-list-page .list-item:last-child {
    border-bottom: 0;
  }
  .mobile-class-list-page .tip-right-info {
    float: right;
    color: #999999;
    font-size: 12px;
  }
  .mobile-class-list-page .no-more {
    color: #999999;
  }
  .mobile-class-list-page .more {
    color: #409EFF;
  }
</style>