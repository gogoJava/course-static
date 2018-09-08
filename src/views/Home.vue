<template>
  <div class="home">
    <h1>这是松松专属网站！</h1>
    <img class="log_icon" :src="logUrl" />
    <h1><span class="about" @click="$router.push('/about')">About</span></h1>
  </div>
</template>

<script>
export default {
  name: "home",
  components: {},
  data() {
    return {
      logUrl: require('./img/log.png')
    }
  }
};
</script>
<style lang="postcss" scoped>
  .home {
    padding-top: 45px;
  }
  .log_icon {
    width: 120px;
    height: 120px;
  }
  .about {
      padding-top: 30px;
      cursor: pointer;
      color: #42b983;
    }
</style>
