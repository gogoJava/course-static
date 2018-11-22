<template>
  <div>
    <pc-view v-if="!isMobile"></pc-view>
    <mobile-view v-if="isMobile"></mobile-view>
  </div>
</template>
<script>
  // components
  import PcView from './PcView'
  import MobileView from './MobileView'
  export default {
    title: '课程列表',
    name: 'class-list-page',
    components: {
      PcView,
      MobileView
    },
    data() {
      return ({
      })
    },
    computed: {
      isMobile() {
        return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
      }
    },
    methods: {
    },
    mounted() {
    }
  }
</script>
<style></style>