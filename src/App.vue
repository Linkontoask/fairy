<template>
  <div id="app">
    <div class="Main" v-show="!isSong && !isPlay">
      <div class="top-control">
        <input type="text" ref="search" placeholder="🔍 音乐" v-show="isTop" @focus.stop="showSearch" v-on:input="edit()">
        <h2 v-show="!isTop">{{ infomation }}</h2>
        <span @touchend="goSongShow" ref="go">{{ ifa }}</span>
      </div>
      <div class="bar-bottom">
        <ul>
          <li v-for="(item, index) in data" :key="index" :class="index === select ? 'active-li' : 'active-null-li'" @touchend="clicks(index)">
            <img v-bind:src="item.src">
            <p>{{ item.name }}</p>
          </li>
        </ul>
      </div>
    </div>
    <Song v-show="isSong && !isPlay"></Song>
    <Play v-show="!isSong && isPlay"></Play>
    <router-view v-show="!isSong && !isPlay" />
  </div>
</template>

<script>
import bus from './router/event'
// import wyData from './components/WyGetData'
import Song from './components/Song/song'
import Play from './components/play'

export default {
  name: 'App',
  data () {
    return {
      data: [{'src': 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/music-bar.png', 'name': '发现'}, {'src': 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/video-bar.png', 'name': '视频'}, {'src': 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/me-bar.png', 'name': '我的'}, {'src': 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/friend-bar.png', 'name': '朋友'}],
      select: 0,
      isTop: true,
      isSong: false,
      isPlay: false,
      ifa: '',
      infomation: 'Test'
    }
  },
  components: {
    'Song': Song,
    'Play': Play
  },
  methods: {
    edit: function () {
      if (this.$refs.search.value === '' || this.$refs.search.value === ' ') {
        return
      }
      bus.$emit('search', this.$refs.search.value)
    },
    showSearch: function () {
      this.$router.push({path: '/search'})
      this.ifa = '取消'
      this.$refs.search.style.textAlign = 'left'
      this.$refs.go.style.background = 'none'
    },
    goSongShow: function () {
      // 进入歌曲播放界面
      if (this.ifa === '取消') {
        this.$router.push({path: '/'})
        this.ifa = ''
        this.$refs.search.style.textAlign = 'center'
        this.$refs.go.style.background = 'url("http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/music.png") no-repeat center'
      } else {
        bus.$emit('play', {view: true, main: true})
      }
    },
    clicks: function (index) {
      this.select = index
      switch (this.select) {
        case 0 : this.$router.push({path: '/'}); this.isTop = true; break
        case 1 : this.$router.push({path: '/videoMusic'}); this.isTop = true; break
        case 2 : this.$router.push({path: '/me'}); this.infomation = '我的音乐'; this.isTop = false; break
        case 3 : this.$router.push({path: '/friend'}); this.infomation = '朋友'; this.isTop = false; break
      }
      // console.log(index)
    },
    checkHash: function () {
      let url = window.location.href
      let hash = ['', 'videoMusic', 'me', 'friend', 'user']
      hash.forEach((item, index) => {
        if (url.replace(/^.*#\//g, '') === item) {
          // console.log(index)
          this.select = index
        }
      })
    }
  },
  mounted: function () {
    this.checkHash()
    bus.$on('isSong', (e) => {
      this.isSong = e.view
      bus.$emit('id', e)
    })
    bus.$on('play', (e) => {
      this.isSong = e.isSong
      this.isPlay = e.view
    })
  },
  updated: function () {
  }
}
</script>

<style>
html, body {
  width: 100%;
  height: 100%;
}
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'FangSong', 'Avenir', Helvetica, Arial, sans-serif;
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
<style lang="less" scoped>
::-webkit-input-placeholder {
    color: #d089899c;
}
:-moz-placeholder {
    color: #d089899c;
}
::-moz-placeholder {
    color: #d089899c;
}
:-ms-input-placeholder {
    color: #d089899c;
}
@red: #C20C0C;
.Main {
  position: relative;
  width: 100%;
  z-index: 100;
}
.bar-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 7.4%;
  background-color: #212121;
  z-index: 1000;
  ul {
    padding: 4px 2rem;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  li {
    list-style-type: none;
    color: white;
  }
  p {
    font-size: .9rem;
    margin-top: -4px;
  }
  img {
    margin-top: -4px;
  }
}
.top-control {
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 5.9%;
  background-color: @red;
  h2 {
    width: 100%;
    text-align: center;
    color: white;
    font-size: 1rem;
    font-weight: normal;
  }
  input {
    display: block;
    margin: 0 auto;
    width: 70%;
    height: 1.4rem;
    line-height: 1.4rem;
    outline: none;
    font-size: 1rem;
    color: #333;
    text-align: center;
    text-indent: 12px;
    border: none;
    border-radius: 12px;
  }
  span {
    position: absolute;
    right: 12px;
    top: 6px;
    width: 2rem;
    height: 2rem;
    background: url('http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/music.png') no-repeat center;
    color: white;
    text-decoration: underline;
    line-height: 2rem;
    background-size: 24px 24px;
  }
}

.active-li {
  opacity: 1;
}
.active-null-li {
  opacity: .4;
}
</style>
