<template>
  <div class="hostFM">
    <div class="swiper-container" id="swiper-container-hostFM">
        <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(item, index) in img" :key="index">
              <img v-bind:src="item">
            </div>
        </div>
        <div class="swiper-pagination swiper-pagination-white"></div>
    </div>
    <div class="fm-tab">
      <ul>
        <li v-for="(item, index) in tab" :key="index">
          <img v-bind:src="item.img" alt="">
          <p>{{ item.name }}</p>
        </li>
      </ul>
    </div>
    <div id="recommend">
      <h2>电台个性推荐</h2>
      <div class="recommend-content">
        <ul>
          <li v-for="(item, index) in recommendFM" :key="index"><img v-bind:src="item.hasOwnProperty('picUrl') ? item.picUrl : null" alt="Please link to the Internet"><p>{{ item.name }}</p><span>{{ item.copywriter }}</span></li>
        </ul>
      </div>
    </div>
    <div id="recommend">
      <h2>推荐节目</h2>
      <div class="recommend-content">
        <ul>
          <li v-for="(item, index) in myShowss" :key="index"><img v-bind:src="item.hasOwnProperty('picUrl') ? item.picUrl : null" alt="Please link to the Internet"><p>{{ item.name }}</p><span>{{ item.copywriter }}</span></li>
        </ul>
      </div>
    </div>
    <div id="recommend">
      <h2>独家放送</h2>
      <div class="recommend-content Pored">
        <ul>
          <li v-for="(item, index) in myPoreds" :key="index"><img v-bind:src="item.hasOwnProperty('picUrl') ? item.picUrl : null" alt="Please link to the Internet"><p>{{ item.name }}</p><span>{{ item.copywriter }}</span></li>
        </ul>
      </div>
    </div>
    <div id="recommend" v-for="(item, index) in FMTabs" :key="index">
      <h2>{{item.name}}<span> ></span></h2>
      <div class="recommend-content">
        <ul>
          <li v-for="(item, i) in FMTabRecommends[index]" :key="i"><img v-bind:src="item.picUrl" alt="Please link to the Internet"><p>{{ item.name }}</p><span>{{ item.copywriter }}</span></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
import wyData from '../WyGetData'

export default {
  name: 'Find',
  data () {
    return {
      img: [],
      tab: [{'name': '电台分类', 'img': 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/class-fm.png'}, {'name': '推荐电台', 'img': 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/recommend-fm.png'}],
      recommendFM: [],
      myShowss: [],
      myPoreds: [],
      FMTabs: [],
      FMTabRecommends: []
    }
  },
  watch: {
    FMTabs: {
      handler (curVal, oldVal) {
        if (oldVal.length >= 6) {
          oldVal.forEach((item, index) => {
            this.FMTabRecommends.push([])
            wyData.FMTabRecommend(this.FMTabRecommends, 3, item.id, index)
          })
        }
      },
      deep: true
    },
    FMTabRecommends: {
      handler (curVal, oldVal) {
        // console.log(oldVal)
      },
      deep: true
    }
  },
  methods: {
  },
  mounted: function () {
    /* eslint-disable no-new */
    this.img.splice(0, this.img.length)
    this.recommendFM.splice(0, this.recommendFM.length)
    this.myShowss.splice(0, this.myShowss.length)
    this.myPoreds.splice(0, this.myPoreds.length)
    this.FMTabs.splice(0, this.FMTabs.length)
    wyData.getHomePageImg(this.img)
    wyData.myFm(this.recommendFM, 9)
    wyData.myShows(this.myShowss, 3)
    wyData.myPored(this.myPoreds, 3)
    wyData.FMTab(this.FMTabs, 10)
    let t = setInterval(() => {
      if (this.img.length >= 6) {
        clearInterval(t)
        new Swiper('#swiper-container-hostFM', {
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
      }
    }, 100)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@red: #C20C0C;
.hostFM {
  position: relative;
}
#swiper-container-hostFM {
    width: 100%;
    background: white url('http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/top-bg.png') no-repeat;
    background-size: 100% 104px;
    .swiper-wrapper {
      margin-top: 1rem;
        width: 100%;
        height: 100%;
    }
    .swiper-slide {
        width: 100%;
        height: 100%;
        img {
            width: 96%;
            height: 96%;
        }
    }
}
.fm-tab {
  width: 100%;
  background-color: white;
  padding-top: 1.2rem;
  padding-bottom: 1.2rem;
  ul {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    li {
      list-style-type: none;
      img {
        width: 24px;
        float: left;
      }
      p {
        text-decoration: underline;
        float: left;
        margin-left: 12px;
      }
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
        height: 119.781px;
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
        left: 2px;
        top: 110px;
        width: 98%;
        color: white;
        text-align: left;
        font-size: .8rem;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
  }
  .Pored {
    ul li {
      width: 100%;
      img {
        height: auto;
      }
      span {
        top: 124px;
      }
    }
  }
}
</style>
