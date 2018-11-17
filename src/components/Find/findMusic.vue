<template>
  <div class="Find">
    <div @touchmove="move">
      <div class="swiper-container" id="swiper-container-find">
          <div class="swiper-wrapper">
              <div class="swiper-slide" v-for="(item, index) in img" :key="index">
                <img v-bind:src="item.img">
              </div>
          </div>
          <div class="swiper-pagination swiper-pagination-white"></div>
      </div>
      <div id="content">
        <div class="content-bar">
          <div v-for="(item, index) in contentBar" :key="index" @touchend.stop="daySongList(index)"><img v-bind:src="item.src"><p>{{ item.name }}</p></div>
        </div>
      </div>
      <div id="recommend">
        <h2>推荐歌单 <span>></span></h2>
        <div class="recommend-content">
          <ul>
            <li v-for="(item, index) in recommend" :key="index" @touchend.stop="jump(index)"><img v-bind:src="item.hasOwnProperty('picUrl') ? item.picUrl : null" alt="Please link to the Internet"><p>{{ item.name }}</p><span>{{ parseInt(item.playCount / 10000) + '万' }}</span></li>
          </ul>
        </div>
      </div>
      <div id="recommend">
        <h2>最新音乐 <span>></span></h2>
        <div class="recommend-content">
          <ul>
            <li v-for="(item, index) in latestMusics" :key="index"><img v-bind:src="item.hasOwnProperty('picUrl') ? item.picUrl : null" alt="Please link to the Internet" @touchend="play(index)"><p>{{ item.name }}</p></li>
          </ul>
        </div>
      </div>
      <div id="recommend">
        <h2>热门电台节目推荐 <span>></span></h2>
        <div class="recommend-content">
          <ul>
            <li v-for="(item, index) in radioStations" :key="index"><img v-bind:src="item.hasOwnProperty('picUrl') ? item.picUrl : null" alt="Please link to the Internet"><p>{{ item.name }}</p></li>
          </ul>
        </div>
      </div>
      <div class="random-recommend">
        <ul>
          <li v-for="(item, index) in plateOnShelfs" :key="index"><img v-bind:src="item.hasOwnProperty('picUrl') ? item.picUrl : null" alt="">
            <div class="re-main">
            <div class="re-main-top">
              <span>{{ item.type }}</span>
              <h3>{{ item.name }}</h3>
            </div>
            <p>{{ item.company }}</p>
            <div class="authom">
              <a href="" title=""><img v-bind:src="item.artistsPicUrl" alt=""></a>
              <i>{{ item.artistsName }}</i>
            </div>
          </div></li>
        </ul>
      </div>
      <div class="recommend-mv">
        <div class="mv-img" v-for="(item, index) in mvData" :key="index">
          <img v-bind:src="item.picUrl" alt="">
          <img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/play-mv.png" alt="">
          <p>{{item.copywriter }}</p>
          <span>{{(item.duration / 1000 / 60).toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../../router/event'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
import wyData from '../WyGetData'

export default {
  name: 'Find',
  data () {
    return {
      img: [{'img': 'http://p3.music.126.net/s25q2x5QyqsAzilCurD-2w==/7973658325212564.jpg'}, {'img': 'http://p4.music.126.net/V9-MXz6b2MNhEKjutoDWIg==/7937374441542745.jpg'}, {'img': 'http://p4.music.126.net/CTU5B9R9y3XyYBZXJUXzTg==/2897213141428023.jpg'}],
      contentBar: [{'src': 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/personalFm.png', 'name': '私人FM'}, {'src': 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/calendar.png', 'name': '每日推荐'}, {'src': 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/playList.png', 'name': '歌单'}, {'src': 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/RankingList.png', 'name': '排行榜'}],
      recommend: [],
      latestMusics: [],
      radioStations: [],
      plateOnShelfs: [],
      mvData: [],
      isMove: false
    }
  },
  methods: {
    daySongList: function (index) {
      // setTimeout(() => {
      //   if (!this.isMove) {
      //     if (index === 1) {
      //       console.log(index)
      //       bus.$emit('isSong', {view: true, user: true})
      //     }
      //   } else {
      //     this.isMove = false
      //   }
      // }, 0)
    },
    jump: function (index) {
      setTimeout(() => {
        if (!this.isMove) {
          bus.$emit('isSong', {view: true, id: this.recommend[index].id})
        } else {
          this.isMove = false
        }
      }, 0)
    },
    play: function (index) {
      setTimeout(() => {
        if (!this.isMove) {
          bus.$emit('play', {view: true, id: this.latestMusics[index].id, d: {img: this.latestMusics[index].picUrl, name: this.latestMusics[index].name}})
        } else {
          this.isMove = false
        }
      }, 0)
    },
    move: function () {
      this.isMove = true
    }
  },
  mounted: function () {
    /* eslint-disable no-new */
    wyData.longIn1('18574850529', 'wwbtf1314Lyx')
    new Swiper('#swiper-container-find', {
      pagination: {
        el: '.swiper-pagination'
      },
      paginationClickable: true,
      loop: true,
      speed: 600,
      autoplay: {
        delay: 3000,
        stopOnLastSlide: false,
        disableOnInteraction: false
      }
    })
    // 推荐歌单
    this.recommend.splice(0, this.recommend.length)
    this.latestMusics.splice(0, this.latestMusics.length)
    this.radioStations.splice(0, this.radioStations.length)
    this.plateOnShelfs.splice(0, this.plateOnShelfs.length)
    this.mvData.splice(0, this.mvData.length)
    wyData.reCommendListSong(this.recommend, 9, 0)
    wyData.latestMusic(this.latestMusics)
    wyData.radioStation(this.radioStations)
    wyData.plateOnShelf(this.plateOnShelfs, 0, 6)
    wyData.recommendedMV(this.mvData)
  },
  updated: function () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@black: #333;
@line-color: #bbbbbb73;
.Find {
  position: relative;
}
#swiper-container-find {
    width: 100%;
    .swiper-wrapper {
        width: 100%;
        height: 100%;
    }
    .swiper-slide {
        width: 100%;
        height: 100%;
        img {
            width: 100%;
            height: 100%;
        }
    }
}
#content {
  text-align: center;
  margin-top: -4px;
  padding: .8rem 1.4rem;
  border-bottom: .5px solid #bbbbbb73;
  font-size: .9rem;
  background-color: white;
  .content-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 4rem;
    img {
      width: 24px;
    }
  }
}
#recommend {
  padding: 6px;
  margin-top: .6rem;
  background-color: white;
  h2 {
    font-size: 1.1rem;
    text-align: left;
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
.random-recommend {
  width: 100%;
  margin-top: 12px;
  li {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    list-style-type: none;
    width: 100%;
    height: 160px;
    margin-top: 6px;
    background-color: white;
    img {
      width: 32%;
      margin-left: 12px;
    }
    p {
      margin-top: 12px;
      text-align: left;
      font-size: .9rem;
      color: #afafaf;
    }
    .authom {
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 100%;
      border-top: .5px solid #f1f1f1;
      margin-top: 34px;
      padding: 4px;
      text-align: left;
      font-size: .9rem;
      a {
        display: block;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        overflow: hidden;
        float: left;
      }
      img {
        width: 100%;
        margin-left: 0;
      }
      i {
        font-style: normal;
        float: left;
        margin-top: 8px;
        padding-left: 1rem;
      }
    }
    .re-main {
      width: 62%;
      height: 120px;
      padding-left: 12px;
      position: relative;
      .re-main-top {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        h3 {
          font-size: 1.1rem;
          padding-left: 12px;
          text-align: left;
          width: 80%;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
      }
      span {
        height: 12px;
        line-height: 14px;
        border: 1px solid red;
        padding: 2px;
        color: red;
        font-size: .4rem;
      }
    }
  }
  li:nth-child(1) {
    margin-top: 0;
  }
}
.recommend-mv {
  position: relative;
  width: 100%;
  background-color: white;
  padding: 4px;
  margin-top: 12px;
  .mv-img {
    display: flex;
    align-items: center;
    position: relative;
    margin-top: 6px;
    width: 100%;
    height: 200px;
    img:nth-child(1) {
      position: absolute;
      left: 4px;
      top: 0;
      width: 96%;
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
      color: white;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      z-index: 2;
    }
    span {
      position: absolute;
      width: 62px;
      text-align: right;
      right: 18px;
      bottom: 0;
      z-index: 2;
      color: white;
      background: url('http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/duration.png') no-repeat 0px 0px;
      background-size: 24px 18px;
    }
  }
}
</style>
