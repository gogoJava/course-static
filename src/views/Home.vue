<template>
  <div class="home-view">
    <my-menu></my-menu>
    <!--<router-view></router-view>-->
  </div>
</template>
<script>
  // components
  import MyMenu from '../views/components/menu/MyMenu.vue'
  export default {
    name: 'home',
   components: {
     MyMenu
   },
  }
</script>
<style lang="stylus">
  .home-view {
    height 100%;
  }
</style>
