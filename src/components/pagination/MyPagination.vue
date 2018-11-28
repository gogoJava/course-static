<script>
  import {Pagination} from 'element-ui'

  export default {
    props: {
      ...Pagination.props,
      layout: {
        default: 'total, sizes, prev, pager, next'
      },
      router: {
        type: Boolean,
        default: false
      },
      queryName: {
        type: String,
        default: 'currentPage',
      },
      pageSizes: {
        type: Array,
        default: () => [10, 20, 30, 40, 50, 100]
      },
    },
    data () {
      return {
        queryCurrentPage: !this.router ? this.currentPage : this.getQueryCurrentPage(),
      }
    },
    computed: {},
    watch: {
      '$route.query' () {
        const newQueryCurrentPage = this.getQueryCurrentPage()
        if (newQueryCurrentPage !== this.queryCurrentPage) {
          this.queryCurrentPage = newQueryCurrentPage
        }
      },
    },
    methods: {
      getQueryCurrentPage () {
        const queryCurrentPageStr = this.$route.query[this.queryName]
        if (queryCurrentPageStr && !isNaN(queryCurrentPageStr)) {
          return queryCurrentPageStr - 0
        }
        return 1
      },
      onCurrentChange (currentPage) {
        if (this.router) {
          this.queryCurrentPage = currentPage
          this.$router.replace({
            query: {
              ...this.$route.query,
              [this.queryName]: currentPage
            }
          })
        }
        this.$emit('update:currentPage', currentPage)
      },
      onSizeChange (size) {
        this.$emit('update:pageSize', size)
      }
    },
    created () {
      this.$on('current-change', this.onCurrentChange)
      this.$on('size-change', this.onSizeChange)
    },
    render () {
      const data = {
        props: {
          ...this.$props,
          currentPage: !this.router ? this.currentPage : this.queryCurrentPage
        },
        on: {}
      }
      const events = ['size-change', 'current-change']
      events.forEach((event) => {
        data.on[event] = (data) => this.$emit(event, data)
      })
      if (!data.props.total) {
        return
      }
      return (
        <el-pagination
          class={'my-pagination'}
          {...data}
        />
      )
    }
  }

</script>

<style>
  .my-pagination {
    margin-top: 20px;
    text-align: right;
  }
</style>
