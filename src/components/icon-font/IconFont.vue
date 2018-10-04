<template>
  <span class="iconfont" :class="iconClass" :style="iconStyle"></span>
</template>

<script>
  export default {
    name: 'icon-font',
    props: {
      icon: {
        type: String,
        required: true,
      },
      size: {
        default: null
      },
      color: String,
    },
    computed: {
      iconClass () {
        return `icon-${this.icon}`
      },
      iconStyle () {
        const styles = {}

        if (this.size) {
          styles.fontSize = this.size
        }
        if (this.color) {
          styles.color = this.color
        }

        return styles
      }
    }
  }
</script>

<style>
  .iconfont {
    font-size: 16px;
  }
</style>
