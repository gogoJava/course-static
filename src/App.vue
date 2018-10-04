<template>
  <div class="home-view">
    <!--<my-menu></my-menu>-->
    <router-view></router-view>
  </div>
</template>
<script>
  import './styles/iconfont/iconfont.css'
  // components
  // import MyMenu from './views/components/menu/MyMenu.vue'
  export default {
    name: 'app',
   components: {
     // MyMenu
   },
  }
</script>
<style lang="stylus">
  html, body {
    height 100%;
    margin: 0;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
  .home-view {
    height 100%;
  }
</style>
