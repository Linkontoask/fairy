<template>
  <div class="me">
    <div class="wrapper-info" ref="wrapperInfo">{{ info }}</div>
    <div class="wrapper" ref="wrapper">
      <div class="content seller-content">
        <div class="me-top">
          <ul>
            <li v-for="(item, index) in meTab" :key="index"><img v-bind:src="item.img" alt=""><p>{{ item.name }}</p><i>2</i></li>
          </ul>
        </div>
        <div class="me-bottom">
          <p id="me-bottom-title" v-tap="{methods:click}">我创建的歌单<i>({{ '1' }})</i></p>
          <div class="list-song" ref="listSong">
            <ul>
              <li v-for="(item, index) in song" :key="index">
                <div><img v-bind:src="item.picUrl" alt=""></div>
                <span><p class="list-title">{{ item.title }}</p>
                <p>{{ item.count }}</p></span>
              </li>
            </ul>
          </div>
        </div>
        <div id="recommend">
          <h2>推荐歌单</h2>
          <div class="recommend-content">
            <ul>
              <li v-for="(item, index) in recommend" :key="index" @touchend.stop="goSing(index)" @touchmove="move"><img v-bind:src="item.hasOwnProperty('picUrl') ? item.picUrl : null" alt="Please link to the Internet"><p>{{ item.name }}</p><span>{{ parseInt(item.playCount / 10000) + '万' }}</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../../router/event'
import wyData from '../WyGetData'
import BScroll from 'better-scroll'

export default {
  name: 'me',
  data () {
    return {
      meTab: [{'img': 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/music-me.png', 'name': '本地音乐(本地存储)'}, {'img': 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/playing.png', 'name': '最新播放'}, {'img': 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/fm-me.png', 'name': '我的电台'}],
      song: [{'picUrl': 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/heart.png', 'title': '我喜欢的音乐', 'count': 0}],
      recommend: [],
      offset: 0,
      down: false,
      updata: false,
      isMove: false,
      info: '下拉刷新'
    }
  },
  methods: {
    move: function () {
      this.isMove = true
    },
    goSing: function (index) {
      setTimeout(() => {
        if (!this.isMove) {
          bus.$emit('isSong', {view: true, id: this.recommend[index].id})
        } else {
          this.isMove = false
        }
      }, 0)
    },
    click: function (params) {
      if (this.$refs.listSong.style.height === '0px') {
        this.$refs.listSong.style.height = 5 + 'rem'
      } else {
        this.$refs.listSong.style.height = 0
      }
      this.scroll.refresh()
    },
    loadData: function () {
      this.$nextTick(() => {
        if (!this.scroll) {
          let dos = true
          this.scroll = new BScroll(this.$refs.wrapper, {
            click: true,
            probeType: 3,
            pullDownRefresh: {
              threshold: 58,
              stop: 78
            }
          })
          this.scroll.on('pullingDown', () => {
            console.log('刷新')
            this.offsetUp = 0
            this.down = true
            this.info = '正在获取新的内容...'
            this.offset += 9
            this.recommend.splice(0, this.recommend.length)
            wyData.reCommendListSong(this.recommend, 9, this.offset)
            console.log(this.offset)
            let t = setInterval(() => {
              if (this.recommend.length === 9 || this.recommend.length === 3) {
                clearInterval(t)
                this.info = '刷新完成'
                this.scroll.finishPullDown()
                this.down = false
                this.updata = true
                dos = false
                this.$nextTick(() => {
                  this.scroll.refresh()
                })
              }
            }, 100)
          })
          this.scroll.on('scroll', (pos) => {
            if (pos.y >= 0) {
              this.$refs.wrapperInfo.style.top = pos.y + 'px'
            }
            if (pos.y === 0) dos = true
            if (pos.y >= 54) {
              if (!this.down && !this.updata) {
                this.info = '释放立即刷新'
              }
              this.$refs.wrapperInfo.style.top = 54 + 'px'
            } else if (pos.y === 0 || pos.y < 54) {
              if (dos) this.info = '下拉刷新'
              this.updata = false
            }
          })
        } else {
          this.scroll.refresh()
        }
      })
    }
  },
  created () {
    this.loadData()
  },
  mounted: function () {
    // bus.$emit('me', false)
    this.recommend.splice(0, this.recommend.length)
    wyData.reCommendListSong(this.recommend, 9, 0)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@black: #333;
@gray: #6b6b6b;
.me {
  position: relative;
  padding-top: 2.4rem;
  height: 88%;
  padding-bottom: 57px;
  color: @black;
  overflow-x: hidden;
  background-color: #e2e2e2ba;
}
.me-top {
  background-color: white;
  li {
    width: 100%;
    height: 4rem;
    position: relative;
    i {
      font-style: normal;
      float: right;
      padding: 24px 32px 0 0;
    }
    p {
      position: absolute;
      right: 0;
      top: 0;
      width: 80%;
      height: 100%;
      line-height: 4rem;
      text-align: left;
      border-bottom: 1px solid #ccc;
      background: url('http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/right.png') no-repeat center right;
      background-size: 24px 24px;
    }
    img {
      position: absolute;
      left: 20px;
      top: 22px;
      width: 24px;
    }
  }
  li:last-child {
    p {
      border-bottom: none;
    }
  }
}
.wrapper {
  height: 100%;
  overflow-y: scroll;
  z-index: 1;
}
.me-bottom {
  .list-song {
    height: 5rem;
    transition: height .5s;
    overflow: hidden;
    background-color: white;
    li {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      width: 100%;
      height: 5rem;
      padding-left: 4px;
      span {
        width: 76%;
        padding-left: 1rem;
        text-align: left;
        p:last-child {
          color: @gray;
        }
      }
      div {
        width: 14%;
        height: 2.8rem;
        background-color: @black;
        img {
          width: 70%;
          padding-top: 4px;
        }
      }
    }
  }
}
#me-bottom-title {
  text-align: left;
  height: 2rem;
  line-height: 2rem;
  text-indent: 2rem;
  color: @gray;
  font-size: .8rem;
  i {
    font-style: normal;
  }
}
#recommend {
  padding: 6px;
  margin-top: 4px;
  background-color: white;
  h2 {
    font-size: 1.1rem;
    letter-spacing: 1px;
    span {
      font-weight: 100;
      font-size: 1rem;
    }
  }
  .recommend-content ul {
    display: flex;
    align-items: flex-start;
    justify-content: space-around;
    flex-wrap: wrap;
    li {
      position: relative;
      width: 33%;
      list-style-type: none;
      img {
        width: 100%;
        margin-top: 12px;
      }
      p {
        text-align: left;
        font-size: .8rem;
        overflow:hidden;
        text-overflow:ellipsis;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2;
      }
      span {
        position: absolute;
        right: 6px;
        top: 10px;
        color: white;
        font-size: .8rem;
      }
    }
  }
}
@red: #C20C0C;
.wrapper-info {
  position: absolute;
  left: 50%;
  top: -2rem;
  margin-left: -71px;
  width: 142px;
  height: 32px;
  line-height: 32px;
  background-color: @red;
  border-radius: 6px;
  text-align: center;
  color: white;
  font-size: .9rem;
}
</style>
