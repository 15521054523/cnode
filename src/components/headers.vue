<template>
  <div class="headers">
    <!-- <header class="header">
      <a href="javascript:;" class="header-menu" @click="clickMenu"><i class="iconfont icon-caidan01"></i></a>
      最新
      <a href="javascript:;" class="header-community"><i class="iconfont icon-zhifeiji"></i></a>
    </header> -->
    <header class="header">
      <slot name="icon1"></slot>
      <slot name="text"></slot>
      <slot name="icon2"></slot>
    </header>
  </div>
</template>

<script>
export default {
  name: 'headers',
  data () {
    return {

    }
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.header{
  position: fixed;
  top: 0;
  left: 0;
  z-index:9;
  width: 100%;
  height: 45px;
  line-height: 45px;
  background-color: #fff;
  text-align: center;
  box-shadow: 0 -1px 10px 2px rgba(0,0,0,.5);
  .header-left{
    position: absolute;
    left: 10px;
    top: 0;
    cursor: pointer;
    .iconfont{
      font-size: 22px;
      color: #2c3e50;
    }
  }
  .header-right{
    position: absolute;
    right: 10px;
    top: 0;
    cursor: pointer;
    .iconfont{
      color: #61b7a0;
      font-size: 20px;
    }
  }
}
</style>
