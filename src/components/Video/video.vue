<template>
  <div class="video">
    <div class="wrapper-info" ref="wrapperInfo">{{ info }}</div>
    <div class="wrapper" ref="wrapper">
      <div class="recommend-mv content">
        <div class="mv-img" v-for="(item, index) in mvData" :key="index">
          <img v-bind:src="item.picUrl" alt="">
          <img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/play-mv.png" alt="">
          <p>{{item.copywriter }}</p>
          <span>{{item.duration == 0 ? Math.floor(Math.random() * 2 + 2) + ':' + Math.floor(Math.random() * 58 + 1) : (item.duration / 1000 / 60).toFixed(2) }}</span>
          <i>{{ item.playCount == 0 ? Math.floor(Math.random() * 20 + 1) + '万' : item.playCount }}</i>
        </div>
      </div>
    </div>
    <div class="wrapper-up" ref="load"> {{ upinfo }}</div>
  </div>
</template>

<script>
import wyData from '../WyGetData'
import BScroll from 'better-scroll'

export default {
  name: 'video_music',
  data () {
    return {
      info: '下拉刷新',
      upinfo: '上拉加载',
      updata: false,
      down: false,
      up: false,
      stopUp: 0,
      offset: 0,
      offsetUp: 0,
      dataLen: 24,
      mvData: []
    }
  },
  watch: {
    mvData: {
      handler (curVal, oldVal) {
      },
      deep: true
    }
  },
  methods: {
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
            },
            pullUpLoad: {
              threshold: -50
            }
          })
          this.scroll.on('pullingDown', () => {
            // console.log('刷新')
            this.offsetUp = 0
            this.down = true
            this.info = '正在获取新的内容...'
            this.offset += 10
            this.mvData.splice(0, this.mvData.length)
            wyData.recommenMv(this.mvData, 10, this.offset)
            wyData.getMv(this.mvData, 10, this.offset)
            let t = setInterval(() => {
              if (this.mvData.length === 20) {
                this.dataLen = this.mvData.length
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
              this.$refs.wrapperInfo.style.top = pos.y - 32 + 'px'
            }
            if (pos.y === 0) dos = true
            if (pos.y >= 54) {
              if (!this.down && !this.updata) {
                this.info = '释放立即刷新'
              }
              this.$refs.wrapperInfo.style.top = 24 + 'px'
            } else if (pos.y === 0 || pos.y < 54) {
              if (dos) this.info = '下拉刷新'
              this.updata = false
            }
            let upPx = this.scroll.maxScrollY - pos.y
            if (upPx > 34) {
              this.$refs.load.style.bottom = upPx - 34 + 'px'
              this.upinfo = '释放立即加载'
            } else {
              this.$nextTick(() => {
                this.$refs.load.style.bottom = 0 + 'px'
              })
              this.upinfo = '上拉加载'
            }
          })
          this.scroll.on('touchEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY - 34)) {
              // console.log('加载: scrollEnd')
              this.stopUp = this.scroll.maxScrollY - 34
              this.scroll.stop()
              this.offsetUp += 10
              wyData.recommenMv(this.mvData, 10, this.offset)
              let t = setInterval(() => {
                // console.log(this.dataLen, this.mvData.length, this.offsetUp)
                if (this.mvData.length === (this.dataLen + this.offsetUp)) {
                  // console.log('完成')
                  clearInterval(t)
                  this.scroll.finishPullUp()
                  this.$nextTick(() => {
                    this.scroll.refresh()
                  })
                }
              }, 100)
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
    this.mvData.splice(0, this.mvData.length)
    wyData.recommenMv(this.mvData, 10, this.offset)
    wyData.recommendedMV(this.mvData)
    wyData.getMv(this.mvData, 10, this.offset)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@red: #C20C0C;
.video {
  position: relative;
  height: 100% - 13%;
  margin-top: 10%;
}
.wrapper {
  height: 100%;
  overflow-y: scroll;
  z-index: 1;
}
.wrapper-info {
  position: absolute;
  left: 50%;
  top: -24px;
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
.wrapper-up {
  position: absolute;
  bottom: 12px;
  left: 0;
  width: 100%;
  height: 24px;
  text-align: center;
  color: @red;
  z-index: 0;
}
.recommend-mv {
  position: relative;
  width: 100%;
  background-color: white;
  z-index: 1;
  .mv-img {
    display: flex;
    align-items: center;
    position: relative;
    margin-top: 6px;
    width: 100%;
    height: 212px;
    margin-top: 6px;
    color: white;
    img:nth-child(1) {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 210.984px;
      z-index: 1;
    }
    img:nth-child(2) {
      z-index: 2;
      margin: 0 auto;
    }
    p {
      position: absolute;
      width: 78%;
      left: 4px;
      text-align: left;
      top: 180px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      z-index: 2;
    }
    span {
      position: absolute;
      width: 62px;
      text-align: right;
      right: 12px;
      bottom: 12px;
      z-index: 2;
      background: url('http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/duration.png') no-repeat 0px 0px;
      background-size: 24px 18px;
    }
    i {
      position: absolute;
      right: 4px;
      top: 4px;
      z-index: 2;
      font-size: .8rem;
      font-style: normal;
    }
  }
}
.recommend-mv .mv-img:nth-child(1) {
  margin-top: 0;
}
</style>
