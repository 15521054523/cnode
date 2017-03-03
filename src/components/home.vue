<template>
    <div class="home">
        <Headers>
          <a slot="icon1" href="javascript:;" class="header-left" @click="clickMenu"><i class="iconfont icon-caidan01"></i></a>
          <b slot="text">{{headerName}}</b>
          <a slot="icon2" href="javascript:;" class="header-right"><i class="iconfont icon-zhifeiji"></i></a>
        </Headers>
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" @top-status-change="handleTopChange" @bottom-status-change="handleTopChange" :bottom-all-loaded="allLoaded" ref="loadmore">
            <transition-group class="home-ul" tag="ul" enter-active-class="animated bounceInUp" leave-active-class="animated bounceInUp">
                <li :key="item" class="home-item" v-for="item in cnodeList">
                    <router-link :to=" '/detail/' + item.id" class="home-link">
                      <h3 class="title">
                       <span class="tag" v-if="item.top">置顶</span>
                       <span class="tag" v-else-if="item.good">精华</span>
                       <span class="tag gray" v-else-if="item.tab == 'share'">分享</span>
                       <span class="tag gray" v-else-if="item.tab == 'ask'">问答</span>
                       <span class="tag gray" v-else-if="item.tab == 'job'">招聘</span>
                       <b class="txt">{{item.title}}</b>
                      </h3>
                      <div class="content">
                        <div class="content-img">
                          <img :src="item.author.avatar_url" alt="">
                        </div>
                        <div class="content-txt">
                          <p><span class="fr"><i class="green">{{item.reply_count}}</i>/{{item.visit_count}}</span><span class="name">{{item.author.loginname}}</span></p>
                          <p class="text-right">{{item.last_reply_at | getDateDiff}}</p>
                        </div>
                      </div>
                    </router-link>
                </li>
            </transition-group>
        </mt-loadmore>
        <v-menu :menu="isShowMenu" @transferMenu="getMenu" @childMenuClick="getMenuList"></v-menu>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
        <Returntop></Returntop>
    </div>
</template>
<script>
import {returnAppointPos} from '../assets/js/utils.js';
import { Loadmore,Indicator } from 'mint-ui';
import Headers from './headers';
import Menu from './menu';
import Returntop from './returnTop';
const URL = 'https://cnodejs.org/api/v1/';
export default {
    name: 'home',
    data () {
        return {
            cnodeList: [],
            allLoaded: false,
            recordScrollPosition: 0, // 记录滚动的位置
            headerName: '全部',      // 头部名字
            tab: 'all',              // 主题分类，默认为全部
            page: 1,                 // 当前页数
            isEmpty: true,           // true表示第一次加载
            mdrender: false,         // 当为 false 时，不渲染。默认为 true，渲染出现的所有 markdown 格式文本。
            isShowMenu: false        // 是否显示菜单
        }
    },
    mounted () {
      // 首次加载数据
      // 开启loading
      Indicator.open();
      this.ajax(`${URL}topics?page=${this.page}&mdrender=${this.mdrender}&tab=${this.tab}`, () => {
        // 数据加载完毕关闭loading
        Indicator.close();
      });
    },
    // 进入该组件时调用
    beforeRouteEnter (to, from, next) {
      next(vm => {
        document.documentElement.scrollTop = document.body.scrollTop = vm.recordScrollPosition;
      });
    },
    // 离开该路由时调用
    beforeRouteLeave (to, from, next) {
      this.recordScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
      next();
    },
    methods: {
        // 菜单点击
        clickMenu () {
          this.isShowMenu = !this.isShowMenu;
          // 禁止屏幕滚动
          document.body.addEventListener('touchmove',this.prevent,false);
        },
        // 阻止默认行为
        prevent(event) {
           event.preventDefault();
        },
        // 获取子组件菜单点击事件
        getMenu (msg) {
          this.isShowMenu = msg;
           // 释放屏幕滚动
          document.body.removeEventListener('touchmove',this.prevent,false);
        },
        // 获取子组件菜单列表点击事件
        getMenuList (msg) {
          if (!msg) return;
          switch (msg) {
            case 'all':
              this.headerName = '全部';
              break;
            case 'good':
              this.headerName = '精华';
              break;
            case 'share':
              this.headerName = '分享';
              break;
            case 'ask':
              this.headerName = '问答';
              break;
            case 'job':
              this.headerName = '招聘';
              break;
            default :
              this.headerName = '全部';
          }
          this.tab = msg;
          // 执行关闭菜单方法
          this.getMenu();
          // 还原默认初始状态
          this.reductionDefault();
          // 返回顶部
          returnAppointPos(0);
          // 开启loading
          Indicator.open();
          this.ajax(`${URL}topics?page=${this.page}&mdrender=${this.mdrender}&tab=${this.tab}`, () => {
            // 数据加载完毕关闭loading
            Indicator.close();
          });
        },
        // 上拉刷新
        loadTop () {
          // 还原默认初始状态
          this.reductionDefault();
          this.ajax(`${URL}topics?page=${this.page}&mdrender=${this.mdrender}&tab=${this.tab}`,() => {
            // 关闭加载动画
            this.$refs.loadmore.onTopLoaded();
          });

        },
        // 下拉刷新
        loadBottom () {
           // 页数+1
          this.page++;
          this.ajax(`${URL}topics?page=${this.page}&mdrender=${this.mdrender}&tab=${this.tab}`,() => {
            // 关闭加载动画
            this.$refs.loadmore.onBottomLoaded();
          });
        },
        // 滑动组件
        handleTopChange (status) {
          // 手指放开时
          if (status == 'loading') {
              Indicator.open();
          } else if (status == 'pull') {  // 数据加载完毕
              Indicator.close();
          }
        },
        // 还原默认初始值
        reductionDefault () {
          // 页数设置为1，保证每次都是获取到最新的十条数据
          this.page = 1;
          this.limit = 10;
          this.cnodeList = [];
        },
        // ajax请求
        ajax (url, cb) {
           this.$http.get(url).then( res => {
            if (res.status === 200){
                // 如果不是第一次加载数据就追加数据
                if(!this.isEmpty) {
                    this.cnodeList = this.cnodeList.concat(res.body.data);
                } else {
                    this.cnodeList = res.body.data;
                    this.isEmpty = false;
                }
                cb && cb(res);
            }
          }, error => {
            console.log(error);
          });
        }
    },
    components: {
        mtLoadmore: Loadmore,
        Headers,
        vMenu: Menu,
        Returntop
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.gray{
  background:#ccc !important;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-active {
  opacity: 0;
  transform: translateY(30px);
}
.fr{
  float: right;
}
.green{
  color: #61b7a0;
}
.text-right{
  text-align: right;
}
.home{
  padding-top: 45px;
  background-color: #f7f7f7;
  .home-item{
    display: block;
    border-bottom: 1px solid #ddd;
    .home-link{
      display: block;
      padding: 15px;
      .title{
        display: flex;
        .tag{
          display: block;
          padding: 4px 8px;
          background-color: #61b7a0;
          border-radius: 3px 3px 0 0;
          color: #fff;
          font-size: 12px;
        }
        .txt{
          display: block;
          margin-left: 10px;
          flex: 1;
          line-height: 20px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #2c3e50;
          font-size: 16px;
        }
      }
      .content{
        display: flex;
        margin-top: 10px;
        .content-img{
          width: 44px;
          height: 44px;
          img{
            display: block;
            width: 100%;
            border-radius: 50%;
          }
        }
        .content-txt{
          flex: 1;
          padding-left: 7px;
          p{
            line-height: 20px;
            font-size: 12px;
          }
          i{
            font-style: normal;
          }
          .name{
            color: #666;
          }
          .text-right{
            color: #999;
          }
        }
      }
    }
  }
}
</style>
