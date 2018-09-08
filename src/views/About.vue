<template>
  <div>
    <div class="top">友情提示：最终解释权归松松所有。</div>
    <h1 class="about" @click="$router.push('/home')">首页</h1>
  </div>
</template>
<style>
.top {
  padding-top: 60px
}
.about {
      padding-top: 15px;
      cursor: pointer;
      color: #42b983;
    }
</style>
