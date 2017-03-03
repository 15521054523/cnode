<template>
  <div class="return-top" v-if="isTop" @click="returnTop">
    <i class="iconfont icon-jiantou-copy-copy"></i>
  </div>
</template>

<script>
import {returnAppointPos} from '../assets/js/utils.js';
export default {
  name: 'return-top',
  data () {
    return {
      isTop: false
    }
  },
  mounted () {
      window.addEventListener('scroll', () => {
         let t = document.documentElement.scrollTop || document.body.scrollTop;
          if (t > 300) {
            this.isTop = true;
          } else {
            this.isTop = false;
          }
      }, false);
  },
  methods: {
    // 返回顶部
    returnTop () {
      returnAppointPos(0)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.return-top{
  position: fixed;
  bottom: 30px;
  right: 30px;
  transform: rotate(-90deg);
  .iconfont{
    font-size: 48px;
    color: #61b7a0;
  }
}
</style>
