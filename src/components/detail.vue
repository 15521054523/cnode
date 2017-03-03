<template>
  <div class="detail">
    <Headers>
      <router-link to="/home" class="header-left" slot="icon1"><i class="iconfont icon-jiantou"></i></router-link>
      <b slot="text">详情</b>
    </Headers>
    <div class="detail-body">
      <div class="detail-head">
        <h2 class="title">{{detailList.title}}</h2>
        <div class="avatar">
          <span class="time">{{detailList.last_reply_at | getDateDiff}}</span>
          <img class="user-img" :src="avatar_url" alt="">
          <span class="user-name">{{loginname}}</span>
        </div>
      </div>
      <div class="detail-content">
        <div v-html="detailList.content"></div>
      </div>
      <div class="detail-comments-length">
        {{commentsCountLength}}回复
      </div>
      <div class="detail-comments">
        <ul>
          <li class="comments-item" v-for="(item,index) in commentsList">
            <div class="avatar">
              <span class="time">{{item.create_at | getDateDiff}}</span>
              <span class="good"><i class="iconfont icon-zansel"></i>{{item.ups.length}}</span>
              <span class="name"><img :src="item.author.avatar_url" alt="">{{item.author.loginname}} <b>{{index+1}}楼</b></span>
            </div>
            <div class="desc" v-html="item.content"></div>
          </li>
        </ul>
        <div class="none-more" v-if="commentsDataLoadStatus">
          ~已经没有更多评论了~
        </div>
      </div>
    </div>
    <Returntop></Returntop>
  </div>
</template>

<script>
import { Indicator } from 'mint-ui';
import Headers from './headers';
import Returntop from './returnTop';
const URL = 'https://cnodejs.org/api/v1/';
export default {
  name: 'detail',
  data () {
    return {
      detailList: {},                 // 详情数据
      loginname: '',                  // 用户名
      avatar_url: '',                 // 用户头像
      page: 0,
      commentsCountLength: 0,         // 总评论的数量
      commentsDataLoadStatus: false,  // 数据是否加载完了
      commentsEmpty: true,            // 是否是第一次加载评论数据
      commentsStatus: true,           // 滚动时的状态防止多次执行
      commentsPage: 0,                // 0、10、20
      commentsCount: 10,              // 一次加载多少条数据
      commentsList: []                // 评论数据
    }
  },
  mounted () {
     this.getData();
  },
  // 进入该组件时调用
  beforeRouteEnter (to, form, next) {
    // 只有在next下才能获取到this
    next(vm => {
      // 重新获取一遍数据
      // vm.getData();
      window.addEventListener('scroll',vm.scrollBottom, false);
    });
  },
  // 离开该路由时调用
  beforeRouteLeave (to, from, next) {
    // 还原默认初始状态
    this.reductionDefault();
    // 离开时清除滚动事件
    window.removeEventListener('scroll',this.scrollBottom, false);
    // 继续往下执行
    next();
  },
  // 自动检测
  watch: {
    // 路由发生变化时，再次执行该函数
   '$route': 'getData'
  },
  methods: {
    // 首次加载数据渲染
    getData () {
      // 获取文章id
      let id = this.$route.params.id;
      if ( id === undefined) return;
      // 开启load加载
      Indicator.open();
      this.ajax(`${URL}topic/${id}`, (res) => {
        this.detailList = res.body.data;
        this.loginname = this.detailList.author.loginname;
        this.avatar_url = this.detailList.author.avatar_url;
        // 第一次先加载十条评论数据
        this.getCommentsData(this.commentsPage,this.commentsCount, () => {
          this.commentsCountLength = this.detailList.replies.length;
          Indicator.close();
        });
      });
    },
    // 滚动到底部
    scrollBottom (event) {
      // 获取滚动的距离和文档的可视高度和总共的高度
      let t = document.documentElement.scrollTop || document.body.scrollTop;
      let win_height = document.documentElement.clientHeight || document.body.clientHeight;
      let ele_height = document.documentElement.scrollHeight || document.body.scrollHeight;
      // 评论数据没有加载完毕才能继续执行
      if (!this.commentsDataLoadStatus) {
        if (t + win_height >= ele_height) {
          if (this.commentsStatus) {
            // 页数每次+1
            this.page++;
            this.commentsStatus = false;
            this.commentsPage = this.page * this.commentsCount;
            // 加载评论数据
            this.getCommentsData(this.commentsPage,this.commentsCount, () => {
              this.commentsStatus = true;
            });
          }
        }
      }
    },
    // 评论数据
    getCommentsData (page, count, cb) {
      count += page;
      // 如果当前长度大于总评论的长度那么就重新赋值总评论的长度
      if (count > this.detailList.replies.length) {
        count = this.detailList.replies.length;
        // 显示加载完毕
        this.commentsDataLoadStatus = true;
      }
      for (let i = page; i < count; i++) {
        if (this.commentsEmpty) {
          this.commentsList.push(this.detailList.replies[i]);
        } else {
          let arr = this.commentsList.concat(this.detailList.replies[i]);
          this.commentsList = arr;
        }
      }
      this.commentsEmpty = false;
      cb && cb();
    },
    // 还原默认初始值
    reductionDefault () {
      // 设置为第一次加载
      this.commentsEmpty = true;
      // 清空用户名称和头像
      this.loginname = '';
      this.avatar_url = '';
      // 清空总评论数
      this.commentsCountLength = 0;
      // 清空页数
      this.page = 0;
      this.commentsPage = 0;
      this.commentsCount = 10;
      // 设置为未加载完毕
      this.commentsDataLoadStatus = false;
      // 清空详情数据
      this.detailList = [];
      // 清空评论数据
      this.commentsList = [];
    },
    // ajax请求
    ajax (url,cb) {
      this.$http.get(url).then( res => {
        if (res.status === 200) {
          cb && cb(res);
        }
      }, error => {
        console.log(error);
      });
    }
  },
  components: {
    Headers,
    Returntop
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.markdown-text img{
  width: auto;
  max-width: 100%;
}
.detail{
  padding-top: 45px;
  .detail-body{
    .detail-head{
      padding: 10px;
      .title{
        line-height: 25px;
        font-size: 18px;
        font-weight: bold;
      }
      .avatar{
        padding: 10px 0;
        .user-img{
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        .user-name{
          color: #0088cc;
          font-size: 14px;
        }
        .time{
          float: right;
          line-height: 30px;
          color: #999;
          font-size: 12px;
        }
      }
    }
    .detail-content{
      padding: 10px;
      .markdown-text{
        p{
          line-height: 20px;
          font-size: 14px;
          font-weight: bold;
          a{
            color: #999;
            font-weight: normal;
          }
        }
      }
      h2{
        margin-top: 20px;
        margin-bottom: 15px;
        font-size: 36px;
        font-weight: bold;
      }
      ul{
        margin: 0 0 10px 25px;
        li{
          line-height: 23px;
          list-style: disc;
          font-size: 16px;
          font-weight: bold;
          li{
            list-style: circle;
          }
          a{
            display: block;
            line-height: 23px;
            font-size: 14px;
            font-weight: normal;
            color: #61b7a0;
          }
        }
      }
    }
    .detail-comments-length{
      padding: 15px;
      background-color: #fbfbfb;
    }
    .detail-comments{
      .comments-item{
        padding: 15px;
        border-top: 1px solid #ddd;
        .avatar{
          font-size: 0;
          & > span{
            display: inline-block;
          }
          .time{
            float: right;
            line-height: 30px;
            color: #999;
            font-size: 12px;
          }
          .good{
            float: right;
            margin-right: 5px;
            line-height: 30px;
            color: #666;
            font-size: 12px;
            .iconfont{
              margin-right: 2px;
              font-size: 12px;
            }
          }
          .name{
            font-size: 14px;
            img{
              margin-right: 7px;
              width: 30px;
              height: 30px;
              border-radius: 50%;
            }
            b{
              color: #61b7a0;
            }
          }
        }
        .desc{
          padding-top: 5px;
          line-height: 20px;
          color: #666;
          p{
            word-wrap: break-word;
          }
          a{
            color: #61b7a0;
          }
        }
      }
      .none-more{
        padding: 15px;
        border-top: 1px solid #ddd;
        text-align: center;
        color: #c3c3c3;
      }
    }
  }
}
</style>
