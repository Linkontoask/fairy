<template>
  <div class="play">
    <div class="play-top">
      <img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/back.png" alt="返回" @touchstart="back">
      <h1>{{ blurPicUrl != null ? blurPicUrl.name : '歌曲' }}</h1>
    </div>
    <audio v-bind:src="id" autoplay="autoplay" id="audio" ref="audio"></audio>
    <div class="oq" @touchend="tab" @touchmove="move">
      <div class="pcr" ref="pcr" id="pcr" v-show="!state.isLycShow">
        <img v-bind:src="blurPicUrl != null ? blurPicUrl.img : null" alt="" ref="blurPicUrl">
      </div>
      <div class="lyc" ref="lyc" id="lyc" v-show="state.isLycShow">
        <ul>
          <li v-for="(item, index) in lycs" :key="index">{{ item }}</li>
        </ul>
      </div>
      <div class="line-control" id="line">
        <span @touchend.stop="currentPlay"></span>
        <hr>
        <a href="" title="" ref="time"></a>
      </div>
    </div>
    <div class="song-control">
      <div class="audio-control control">
        <img src="../assets/volume.png" alt="">
        <span id="audioVolume"><div></div><p @touchmove="audioMove" id="audioVolumeP"></p><hr></span>
      </div>
      <div class="current-control control">
        <em ref="currtimeInfo">00:00</em>
        <span id="audioCurrent"><div></div><p @touchstart="audioDn" @touchmove="audioProgrss"  @touchend="audioUp" id="audioCurrentP"></p><hr></span>
        <em ref="complete">00:00</em>
      </div>
    </div>
    <div class="song-control-s control">
      <!-- http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/loop.png -->
      <!-- http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/random.png -->
      <img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/listLoop.png" alt="" class="iuy" @touchend.stop="setState">
      <img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/prev.png" alt="" class="ioq" @touchend.stop="prev">
      <img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/pause.png" alt="" class="ioq" @touchend="playPause">
      <img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/prev.png" alt="" class="ioq" @touchend.stop="next">
      <img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/list.png" alt="" class="iuy" @touchend.stop="openListSong">
    </div>
    <div class="list-song-container">
      <ul>
        <li v-for="(item, index) in listSong" :key="index" @touchmove="playListMove" @touchend.stop="playList(index)">
          <em>{{ item.name }} - </em>
          <em>{{ item.artists + (item.alias.length !==0 ? item.alias[0] : '') }}</em>
        </li>
      </ul>
    </div>
    <div id="prop" @touchend.stop="shutDown"></div>
    <p id="info-mation">{{ info }}</p>
    <img v-bind:src="blurPicUrl != null ? blurPicUrl.img : null" alt="" class="oi">
  </div>
</template>

<script>
import wyData from './WyGetData'
import bus from '../router/event'
import $ from 'jquery'

export default {
  name: 'play',
  data () {
    return {
      id: '',
      listSong: [],
      tq: 0,
      lyc: [],
      blurPicUrl: null,
      isSong: false,
      lycs: [],
      oldLyc: '',
      time: [],
      t: null,
      t1: null,
      times: 0,
      h: 50,
      info: '列表循环',
      o: 1,
      q: true,
      currentIndex: 0,
      isMove: false,
      state: {}
    }
  },
  watch: {
    lyc: {
      handler (curVal, oldVal) {
        if (curVal.length !== 0) {
          // 歌词变动重置变量
          if (this.oldLyc !== curVal[0]) {
            this.init()
          }
          this.lycSegmentation(oldVal[0])
          this.oldLyc = curVal[0]
        }
      },
      deep: false
    }
  },
  methods: {
    init: function () {
      console.log('play.vue 56 line => 清除所有变量,定时器')
      this.state.index = 0 // 当前播放歌词
      this.state.index1 = 0 // 当前选中歌词
      this.state.isLycShow = false
      $('#pcr').fadeIn(500)
      $('#lyc').fadeOut(500)
      $('.audio-control').animate({'top': -44}, 500)
      $('#lyc ul').animate({scrollTop: 0}, 200)
      $('#audioCurrent div').width(0)
      $('#audioCurrentP').css('left', '-0.5rem')
      this.isMove = false
      this.currentIndex = 0
      this.times = 0
      this.state.index = 0
      this.currtime()
      this.go(1)
    },
    prev: function () {
      if (this.listSong.length === 0) {
        alert('播放列表没有歌曲了哦')
        return
      }
      this.tq <= 0 ? this.tq = this.listSong.length - 1 : this.tq--
      let index = this.tq
      bus.$emit('play', {view: true, isSongGo: true, id: this.listSong[index].id, d: {img: this.listSong[index].blurPicUrl, name: this.listSong[index].name + this.listSong[index].alias}})
    },
    next: function () {
      if (this.listSong.length === 0) {
        alert('播放列表没有歌曲了哦')
        return
      }
      this.tq >= this.listSong.length - 1 ? this.tq = 0 : this.tq++
      let index = this.tq
      bus.$emit('play', {view: true, isSongGo: true, id: this.listSong[index].id, d: {img: this.listSong[index].blurPicUrl, name: this.listSong[index].name + this.listSong[index].alias}})
    },
    playListMove: function () {
      this.state.listMove = true
    },
    playList: function (index) {
      setTimeout(() => {
        if (!this.state.listMove) {
          $('#prop').fadeOut(500)
          $('.list-song-container').slideUp(500)
          bus.$emit('play', {view: true, isSongGo: true, id: this.listSong[index].id, d: {img: this.listSong[index].blurPicUrl, name: this.listSong[index].name + this.listSong[index].alias}})
        } else {
          this.state.listMove = false
        }
      }, 0)
    },
    openListSong: function () {
      $('#prop').fadeIn(500)
      $('.list-song-container').slideDown(500)
    },
    shutDown: function () {
      $('#prop').fadeOut(500)
      $('.list-song-container').slideUp(500)
    },
    setState: function () {
      // 更改播放模式 , 单曲循环 列表循环 随机播放
      this.o >= 2 ? this.o = 0 : this.o++
      switch (this.o) {
        case 0: this.info = '单曲循环'; $('.iuy').eq(0).attr('src', 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/loop.png'); break
        case 1: this.info = '列表循环'; $('.iuy').eq(0).attr('src', 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/listLoop.png'); break
        case 2: this.info = '随机播放'; $('.iuy').eq(0).attr('src', 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/random.png'); break
      }
      if (this.q) {
        $('#info-mation').animate({'opacity': 0.7}, 500)
        this.q = false
        setTimeout(() => {
          this.q = true
          $('#info-mation').animate({'opacity': 0}, 500)
        }, 500)
      }
      if (this.state.isLycShow) {
        $('#lyc').css('display', 'block')
        this.state.isLycShow = false
      }
      console.log(this.state.isLycShow)
    },
    playPause: function () {
      if (this.$refs.audio.paused) {
        this.$refs.audio.play()
      } else {
        this.$refs.audio.pause()
      }
    },
    audioMove: function (event) {
      // 移动音量控件
      let x = ~~event.changedTouches[0].clientX
      if (x >= (this.objL | 0) && x <= ((this.objL | 0) + this.w)) {
        $('#audioVolume div').width(x - this.objL | 0)
        this.objP.css('left', x - this.objL | 0)
        // 设置音量
        this.$refs.audio.volume = ((x - this.objL | 0) / this.w).toFixed(2)
        // console.log('set')
      } else {
        // console.log(x, this.w)
      }
    },
    audioDn: function () {
      // 进度控件按下
      console.log('dn')
      clearInterval(this.t1)
      console.log('play.vue 118 line 清除歌曲进度定时器')
      this.$refs.audio.pause()
    },
    audioUp: function () {
      // 进度控件抬起
      console.log('up')
      if (!this.duration) {
        alert('不要下机吧操作')
        return
      }
      this.$refs.audio.play()
    },
    setAudioProgress: function (index) {
    },
    audioProgrss: function (event) {
      let x = ~~event.changedTouches[0].clientX
      if (x >= (this.w1L | 0) && x <= ((this.w1L | 0) + this.w1)) {
        $('#audioCurrent div').width(x - this.w1L | 0)
        this.w1P.css('left', x - this.w1L | 0)
        let a = ((x - this.w1L | 0) / this.w1).toFixed(2) * this.duration | 0
        this.setInfo(a, this.$refs.currtimeInfo)
        this.$refs.audio.currentTime = a
        // console.log(((x - this.w1L | 0) / this.w1).toFixed(2))
      } else {
        // console.log('hidden')
      }
    },
    setInfo: function (index, obj) {
      let timeStr = ''
      if (index < 60) {
        index < 10 ? timeStr = `00:0${index}` : timeStr = `00:${index}`
      } else {
        let a = ~~(index / 60)
        let s = index - a * 60
        if (s < 10) {
          s = `0${s}`
        }
        timeStr = `0${a}:${s}`
      }
      if (obj === this.$refs.currtimeInfo) {
        $('#audioCurrent div').width(index * this.w1 / this.duration)
        this.w1P.css('left', index * this.w1 / this.duration)
      }
      obj.innerText = timeStr
    },
    currentPlay: function () {
      this.times = this.time[this.currentIndex]
      this.$refs.audio.currentTime = this.time[this.currentIndex]
      this.go()
      this.$refs.audio.play()
      $('#lyc li').eq(this.currentIndex).css('opacity', '1')
    },
    move: function () {
      if (!this.state.lyc) {
        return
      }
      // 防止歌词图片界面出现跳转器
      if (this.$refs.pcr.style.display === 'none') {
        $('#line').css('opacity', '1')
      }
      clearInterval(this.t)
      if (!this.isMove) console.log('play.vue 82 line 清除歌词滚动定时器')
      this.isMove = true
      let top = $('#lyc ul').scrollTop()
      let lyc = $('#lyc li')
      for (var i = 0; i < this.lycs.length; i++) {
        if (top > i * this.h && top <= (i + 1) * this.h) {
          // console.log(i)
          this.currentIndex = i + 1
          this.currentTime(i)
          if (this.state.index !== this.state.index1) {
            lyc.eq(this.state.index1).css('opacity', '0.4')
            lyc.eq(this.currentIndex).css('opacity', '0.6')
          }
          this.state.index1 = this.currentIndex
        }
      }
      // console.log($('#lyc ul').scrollTop())
    },
    tab: function () {
      if (this.isMove && this.state.lyc) {
        let len = this.lycs.length
        let top = $('#lyc ul').scrollTop()
        for (var i = 0; i < len; i++) {
          if (top >= i * this.h && top <= (i + 1) * this.h) {
            // console.log(i)
            setTimeout(() => {
              $('#line').css('opacity', '0')
            }, 1000)
            $('#lyc ul').animate({scrollTop: (i + 1) * this.h}, 200)
            this.go(1)
            break
          }
        }
        // console.log($('#lyc ul').scrollTop())
      }
      setTimeout(() => {
        if (!this.isMove) {
          if (this.state.isLycShow) {
            $('#pcr').fadeIn(500)
            $('#lyc').fadeOut(500)
            $('.audio-control').animate({'top': -44}, 500)
            this.state.isLycShow = false
          } else {
            $('#pcr').fadeOut(500)
            $('#lyc').fadeIn(500)
            $('.audio-control').animate({'top': 0}, 500)
            this.state.isLycShow = true
          }
        } else {
          this.isMove = false
        }
      }, 0)
    },
    back: function () {
      // isSong true=是从歌单进去 false=不是从歌单进去
      this.isSong ? bus.$emit('play', {view: false, isSong: true, id: null}) : bus.$emit('play', {view: false, isSong: false, id: null})
      clearInterval(this.t)
      this.isMove = false
      console.log('play.vue 137 line 清除歌词滚动定时器')
    },
    // 滚动时间处理
    currentTime: function (index) {
      let timeStr = ''
      if (this.time[index] < 60) {
        timeStr = '00:' + this.time[index]
      } else {
        let a = ~~(this.time[index] / 60)
        let s = this.time[index] - a * 60
        if (s < 10) {
          s = `0${s}`
        }
        timeStr = `0${a}:${s}`
      }
      this.$refs.time.innerText = timeStr
    },
    // 歌词处理
    lycSegmentation: function (lyc) {
      if (lyc === null) {
        this.lycs.push(lyc)
        this.time = 0
        return
      }
      // 防止eval报错
      function evil (fn) {
        var Fn = Function
        return new Fn('return ' + fn)()
      }
      // 分割
      function patch (re, s) {
        re = evil('/' + re + '/ig')
        try {
          return s.match(re).length
        } catch (e) {
          return 0
        }
      }
      function extract (array) {
        var nt = []
        for (var i = 0; i < array.length; i++) {
          if (array[i] === '' || array[i] === '\n' || array[i].indexOf('\n') >= 0) {
            continue
          } else {
            nt.push(array[i])
          }
        }
        return nt
      }
      let array = lyc.split(/\[[\s\S]+?\]/)
      let arrayTime = lyc.split(/[A-Za-z].+?\n|[\u4e00-\u9fa5].+?\n/)
      let newTimems = []
      let eS = []
      for (let i = 0; i < arrayTime.length; i++) {
        if (patch(']', arrayTime[i]) === 0) {
          arrayTime.splice(i, 1)
        } else {
          eS[i] = extract(arrayTime[i].split(/\[([\s\S]+?)\]/))
          for (var j = 0; j < eS[i].length; j++) {
            if (eS[i][j] === ' ') {
              eS[i].splice(j, 1)
            }
          }
        }
      }
      array.splice(0, 1)
      for (let i = 0; i < eS.length; i++) {
        if (typeof eS[i] === 'undefined') {
          eS[i] = ['0:0:0']
        }
      }
      let ESS = []
      for (let i in eS) {
        ESS.push(eS[i])
      }
      try {
        for (let i = 0; i < ESS.length; i++) {
          let sc = ESS[i][0].split(':')
          let time = parseInt(sc[0]) * 60 + parseInt(sc[1])
          newTimems.push(parseInt(time))
        }
      } catch (e) {
        console.log('出现服务器返回歌词问题')
        newTimems = []
      }
      for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] === `\n` || array[i] === '\r\n' || array[i] === '') {
          array.splice(i, 1)
        }
      }
      // 歌词 array
      // 歌词时间 newTimems
      this.lycs = array
      this.time = newTimems
      // console.log(this.lycs)
      // console.log(this.time)
      if (this.lycs.length !== 0 && this.time.length !== 0) {
        this.state.lyc = true
        this.$refs.audio.play()
      } else {
        this.lycs.push('无歌词 / 歌词处理失败')
        this.state.lyc = false
        console.log('play.vue 231 line 歌词处理失败')
      }
    },
    go: function (i) {
      this.$nextTick(() => {
        if (i !== 1) {
          console.log('play.vue 422 line 不允许启动歌词定时器')
          return
        }
        this.tCurrent()
      })
    },
    tCurrent: function () {
      console.log('play.vue 231 line 开始滚动')
      let lycP = document.querySelectorAll('.lyc li')
      let scrollTop = $('.lyc ul')
      if (this.t) {
        clearInterval(this.t)
        this.t = null
      }
      this.t = setInterval(() => {
        if (this.$refs.audio && this.$refs.audio.paused) {
          clearInterval(this.t)
        }
        if (this.times === this.time[this.time.length - 1]) {
          clearInterval(this.t)
        } else {
          this.lycScoll(this.times, lycP, scrollTop)
        }
      }, 1000)
      // console.log(this.t)
    },
    t1Current: function () {
      this.t1 = setInterval(() => {
        if (this.$refs.audio.paused) clearInterval(this.t1)
        if (!this.$refs.audio.currentTime) console.log('play.vue 251 line 歌曲时间当前帧出现错误')
        else this.times = ~~this.$refs.audio.currentTime
        this.setInfo(this.times, this.$refs.currtimeInfo)
        // console.log('当前进度: ', this.times)
      }, 1000)
    },
    currtime: function () {
      // if (!this.$refs.audio.oncanplaythrough) console.log('play.vue 243 line 歌曲加载失败')
      try {
        this.$refs.audio.oncanplaythrough = () => {
          console.log('play.vue 246 line 歌曲加载完成')
          this.duration = ~~this.$refs.audio.duration
          this.setInfo(this.duration, this.$refs.complete) // 设置歌曲时长
          if (this.t1) {
            // 解决事件加载带来的重复执行
            clearInterval(this.t1)
          }
          this.t1Current()
        }
      } catch (e) {
        console.log('歌曲加载失败')
      }
    },
    lycScoll: function (times, lycP, scrollTop) {
      console.log('滚动中')
      for (var i = 0; i < this.time.length; i++) {
        if (this.time[i] === times) {
          scrollTop.animate({scrollTop: (i) * this.h}, 500)
          try {
            lycP[this.state.index].style.opacity = 0.4
            lycP[i].style.opacity = 1
            this.state.index = i
          } catch (e) {}
          break
        }
      }
    },
    audioState: function () {
      if (this.state.isOne) return
      console.log(this.state.isOne)
      this.$refs.audio.addEventListener('play', () => {
        console.log('play.vue 401 line 歌曲播放')
        this.$refs.blurPicUrl.style.animationPlayState = 'running'
        this.t1Current()
        this.tCurrent()
        $('.ioq').eq(1).attr('src', 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/pause.png')
      })
      this.$refs.audio.addEventListener('pause', () => {
        console.log('play.vue 404 line 歌曲暂停')
        clearInterval(this.t)
        clearInterval(this.t1)
        this.state.pauesd = true
        this.$refs.blurPicUrl.style.animationPlayState = 'paused'
        $('.ioq').eq(1).attr('src', 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/play.png')
      })
      this.$refs.audio.addEventListener('ended', () => {
        console.log('play.vue 404 line 歌曲播放完成')
        if (this.o === 0) {
          this.$refs.audio.play()
        } else if (this.o === 1) {
          this.tq >= this.listSong.length - 1 ? this.tq = 0 : this.tq++
          let index = this.tq
          bus.$emit('play', {view: true, isSongGo: true, id: this.listSong[index].id, d: {img: this.listSong[index].blurPicUrl, name: this.listSong[index].name + this.listSong[index].alias}})
        } else {
          this.tq = ~~(Math.random() * this.listSong.length - 1)
          let index = this.tq
          bus.$emit('play', {view: true, isSongGo: true, id: this.listSong[index].id, d: {img: this.listSong[index].blurPicUrl, name: this.listSong[index].name + this.listSong[index].alias}})
        }
      })
      this.state.isOne = true
    }
  },
  mounted: function () {
    bus.$on('play', (e) => {
      console.log(e)
      if (e.main) {
        this.tCurrent()
      }
      if (e.id) {
        // console.log(global.listSong)
        this.listSong.splice(0, this.listSong.length)
        if (typeof (global.listSong) !== 'undefined') {
          for (var i = 0; i < global.listSong.length; i++) {
            this.listSong.push(global.listSong[i])
            if (e.id === global.listSong[i].id) {
              this.tq = i
            }
          }
        }
        this.$nextTick(() => {
          $('.list-song-container li').each((index) => {
            $('.list-song-container li').eq(index).css('color', '#000')
          })
          $('.list-song-container li').eq(this.tq).css('color', 'red')
        })
        this.lyc.splice(0, this.lyc.length)
        this.state.isLycShow = false
        this.id = `http://music.163.com/song/media/outer/url?id=${e.id}.mp3`
        this.blurPicUrl = e.d
        wyData.SongLyc(e.id, this.lyc)
        this.h = $('body').height() * 0.7 * 0.1
        this.$nextTick(() => {
          this.currtime()
          this.audioState()
          this.w = $('#audioVolume').width()
          this.objL = $('#audioVolume').offset().left
          this.objP = $('#audioVolumeP')
          this.w1 = $('#audioCurrent').width()
          this.w1L = $('#audioCurrent').offset().left
          this.w1P = $('#audioCurrentP')
        })
      }
      // 判断是否从歌单进入,返回至歌单界面
      e.isSongGo ? this.isSong = true : this.isSong = false
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.play {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  z-index: 999;
  overflow: auto;
}
.play-top {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #333;
  z-index: 2;
  img {
    width: 32px;
    z-index: 2;
  }
  h1 {
    position: absolute;
    left: 0;
    font-size: 1rem;
    width: 100%;
    color: white;
    font-weight: 100;
  }
}
.oi {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  filter: blur(34px);
  opacity: .6;
  z-index: 1;
}
@keyframes rotat {
  100% {
    transform: rotate(360deg);
  }
}
.oq {
  position: relative;
  width: 100%;
  height: 70%;
  margin-top: 2rem;
  z-index: 999;
  .pcr {
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    margin-top: -152px;
    height: 304px;
    background: url(http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/songImg.png) no-repeat center;
    z-index: 2;
    img {
      width: 58%;
      margin: 0 auto;
      border-radius: 50%;
      z-index: 2;
      animation: rotat 24s linear infinite;
    }
  }
  .lyc {
    display: none;
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    color: white;
    font-size: 1rem;
    ul {
      height: 100%;
      overflow: auto;
      z-index: 2;
      li {
        display: flex;
        align-items: center;
        justify-content: space-around;
        text-align: center;
        height: 10%;
        overflow: hidden;
        opacity: .4;
      }
      li:nth-child(1) {
        margin-top: 55%;
      }
      li:last-child {
        margin-bottom: 55%;
      }
    }
  }
  .line-control {
    display: flex;
    position: absolute;
    left: 0;
    top: 50%;
    width: 94%;
    height: 16px;
    margin-top: -10px;
    padding: 0 .6rem;
    align-items: center;
    justify-content: space-between;
    opacity: 0;
    transition: all 1s;
    span {
      border-top: 6px solid transparent;
      border-left: 10px solid #9a9a9a;
      border-bottom: 6px solid transparent;
    }
    hr {
      width: 80%;
      height: 1px;
      background-color: #ccc;
      border: none;
    }
    a {
      color: #ccc;
      font-size: .9rem;
    }
  }
}
.song-control {
  position: absolute;
  left: 50%;
  top: 2.4rem;
  margin-left: -45%;
  width: 90%;
  height: 80%;
  z-index: 998;
  overflow: hidden;
  img {
    width: 1.4rem;
  }
  span {
    position: relative;
    display: block;
    width: 80%;
    margin-left: 1rem;
    div {
      position: absolute;
      width: 100%;
      height: 2px;
      background-color: red;
    }
    p {
      position: absolute;
      left: 100% - 0.3rem;
      top: -0.4rem;
      width: 0.8rem;
      height: 0.8rem;
      border-radius: 50%;
      background-color: white;
    }
    hr {
      width: 100%;
      height: 2px;
      background-color: #ccc;
      border: none;
    }
  }
  .audio-control {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    box-shadow: 0px 8px 12px 0px #02020259;
  }
  .current-control {
    position: absolute;
    left: 0;
    bottom: 1.4rem;
    width: 100%;
    justify-content: space-between;
    em {
      font-style: normal;
      color: white;
    }
    span {
      margin: 0;
      width: 66%;
    }
    p {
      top: -0.5rem;
      left: -0.5rem;
      width: 1rem;
      height: 1rem;
    }
    div {
      width: 0;
    }
  }
}
#info-mation {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -3rem;
  margin-top: -1rem;
  width: 6rem;
  height: 2rem;
  text-align: center;
  line-height: 2rem;
  color: white;
  font-size: 1rem;
  background-color: #000;
  border-radius: 4px;
  opacity: 0;
  z-index: 1000;
}
.control {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.song-control-s {
  position: absolute;
  left: 0;
  bottom: 1.6rem;
  width: 100%;
  justify-content: space-around;
  z-index: 999;
  img {
  }
  img:nth-child(2) {
    transform: rotate(180deg);
  }
  .ioq {
    width: 42px;
  }
  .iuy {
    width: 24px;
  }
}
#prop {
  display: none;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: .6;
  z-index: 1000;
}
.list-song-container {
  display: none;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 97%;
  height: 64%;
  background-color: white;
  border-radius: 1rem 1rem 0 0;
  text-align: left;
  z-index: 1001;
  overflow: auto;
  padding: .6rem 0.4rem;
  li {
    border-bottom: 1px solid #ccc;
    height: 3rem;
    line-height: 3rem;
    em {
      font-style: normal;
    }
    em:nth-child(1) {
      font-weight: bold;
    }
    em:nth-child(2) {
      color: #888;
    }
  }
}
</style>
