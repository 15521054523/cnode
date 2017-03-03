<template>
  <div class="menu">
    <div class="mask animated" v-if="menu" :class="{'fadeIn': menu}" @click="setMenu"></div>
    <div class="menu-body animated" v-if="menu" :class="{'fadeInLeft': menu}">
      <a href="javascript:;" class="login">
        <i class="iconfont icon-jiantou-copy-copy"></i>
        <span>登录</span>
      </a>
      <div class="nav">
        <a class="nav-link" href="javascript:;" @click="menuHanlder('all')"><i class="iconfont icon-icon"></i><span>全部</span></a>
        <a class="nav-link" href="javascript:;" @click="menuHanlder('good')"><i class="iconfont icon-zansel"></i><span>精华</span></a>
        <a class="nav-link" href="javascript:;" @click="menuHanlder('share')"><i class="iconfont icon-fenxiang"></i><span>分享</span></a>
        <a class="nav-link" href="javascript:;" @click="menuHanlder('ask')"><i class="iconfont icon-wenda"></i><span>问答</span></a>
        <a class="nav-link" href="javascript:;" @click="menuHanlder('job')"><i class="iconfont icon-zhaopin"></i><span>招聘</span></a>
        <a class="nav-link" href="javascript:;"><i class="iconfont icon-wenda"></i><span>消息</span></a>
        <a class="nav-link" href="javascript:;"><i class="iconfont icon-guanyu"></i><span>关于</span></a>
        <!-- <a class="nav-link" href="javascript:;" v-for="item in menuData"><i class="iconfont icon-guanyu"></i><span>{{item}}</span></a> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'menu',
  data () {
    return {
        menuData: [
          '最新','精华','分享','问答','招聘','消息','关于'
        ]
    }
  },
  methods: {
    // 弹出菜单
    setMenu () {
      // 创建一个自定义方法，如何在父组件调用
      this.$emit('transferMenu', false);
    },
    // 菜单列表点击
    menuHanlder (str) {
      if (str) {
        str = typeof str == 'object' ? '' : str;
        this.$emit('childMenuClick', str);
      }
    }
  },
  // 获取父组件传递过来的数据
  props: ['menu']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .animated{
    animation-duration: 0.6s;
  }
  .mask{
    position: fixed;
    left: 0;
    top: 0;
    z-index:9;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.5);
  }
  .menu-body{
    position: fixed;
    left: 0;
    top: 0;
    z-index:9;
    padding: 20px;
    width: 180px;
    height: 100%;
    background-color: rgba(255,255,255,.9);
    box-sizing: border-box;
    .login{
      padding-bottom: 20px;
      border-bottom: 1px solid #ddd;
      display: block;
      .iconfont{
        font-size: 36px;
        color: #f44336;
      }
      span{
        margin-top: 8px;
        margin-left: 5px;
        display: inline-block;
        vertical-align:top;
        font-size: 16px;
        letter-spacing: 2px;
        color: #828181;
      }
    }
    .nav{
      padding-top: 20px;
      .nav-link{
        display: block;
        margin-top: 20px;
        font-weight: bold;
        font-size: 14px;
        .iconfont{
          margin-right: 30px;
          font-size: 18px;
        }
      }
    }
  }
</style>
