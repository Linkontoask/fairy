<template>
  <div class="defaultPage">
    <div class="scrollbar">
      <div class="scrollbar-content">
        <div class="scrollbar-list" v-for="(item, index) in ['发现音乐', '主播电台']" :key="index" v-bind:class="indexPage===index?'select-page':'select-normal-page'" v-tap="{methods:click , index : index}">{{ item }}</div>
      </div>
      <div class="swiper-scrollbar"></div>
    </div>
    <div class="swiper-container" id="swiper-pages">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <FindMusic></FindMusic>
        </div>
        <div class="swiper-slide">
          <AnchorFm></AnchorFm>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FindMusic from './findMusic'
import AnchorFm from './anchorFm'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'

export default {
  name: 'defaultPage',
  data () {
    return {
      indexPage: 0,
      mySwiper: null
    }
  },
  components: {
    'FindMusic': FindMusic,
    'AnchorFm': AnchorFm
  },
  methods: {
    click: function (params) {
      this.mySwiper.slideTo(params.index, 300, true)
    }
  },
  mounted: function () {
    /* eslint-disable no-new */
    let that = this
    that.mySwiper = new Swiper('#swiper-pages', {
      autoplay: false,
      loop: false,
      scrollbar: {
        el: '.swiper-scrollbar'
      },
      on: {
        slideChangeTransitionEnd: function () {
          that.indexPage = this.activeIndex
        }
      }
    })
    that.mySwiper.scrollbar.$el.css('height', '4px')
    // that.mySwiper.scrollbar.$el.css('background', '#fff')
    that.mySwiper.scrollbar.$dragEl.css('background', '#fff')
  },
  updated: function () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@width: 100%;
@red: #C20C0C;
@black: 333;
.defaultPage {
  position: relative;
  width: 100%;
  height: 88%;
  margin: 3rem 0;
  padding-top: 39px;
  background-color: #f5f5f5;
}
.scrollbar {
  position: fixed;
  left: 0;
  top: 2.4rem;
  width: @width;
  padding:8px 0 0 0;
  z-index: 100;
  color: white;
  background: #C20C0C;
  .scrollbar-content {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .scrollbar-list {
    width: 50%;
    height: 100%;
    margin: 0 1.4rem;
    padding-bottom: 8px;
  }
}
.swiper-container {
  margin: -0.5rem auto;
}
#swiper-container-find {
    width: @width;
    .swiper-wrapper {
        width: @width;
        height: 100%;
    }
    .swiper-slide {
        width: @width;
        height: 100%;
    }
}

.select-page {
  font-weight: bold;
}
.select-normal-page {
  font-weight: normal;
}
</style>
