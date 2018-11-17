<template>
  <div class="song">
    <div class="song-top">
      <img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicMobile/back.png" alt="返回" @touchend="back">
      <h1>歌单</h1>
    </div>
    <div class="song-de">
      <img v-bind:src="songDe.length != 0 ? songDe[0].img : null" alt="" class="oi">
      <img v-bind:src="songDe.length != 0 ? songDe[0].img : null" alt="" class="iq">
      <div class="song-de-r">
        <div>{{ songDe.length != 0 ? songDe[0].name : null }}</div>
        <div>
          <img v-bind:src="songDe.length != 0 ? songDe[0].userImg : null" alt="">
          <em>{{ songDe.length != 0 ? songDe[0].userName : null }}</em>
        </div>
      </div>
    </div>
    <div class="song-li">
      <ul>
        <li v-for="(item, index) in songLi" :key="index" @touchend="go(index)" @touchmove="moveing">
          <p>{{ item.name }}<em>{{ item.alias.length != 0 ? item.alias : null}}</em></p>
          <em class="qd">{{ item.artists }}</em>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import wyData from '../WyGetData'
import bus from '../../router/event'

export default {
  name: 'song',
  data () {
    return {
      songDe: [],
      songLi: [],
      user: [],
      move: false
    }
  },
  watch: {
    songLi: {
      handler (curVal, oldVal) {
        // console.log(oldVal)
        global.listSong = oldVal
      },
      deep: false
    }
  },
  methods: {
    back: function () {
      console.log('exit')
      bus.$emit('isSong', {view: false, id: null})
    },
    go: function (index) {
      // isSong true=是从歌单进去 false=不是从歌单进去
      setTimeout(() => {
        if (!this.move) {
          bus.$emit('play', {view: true, isSongGo: true, id: this.songLi[index].id, d: {img: this.songLi[index].blurPicUrl, name: this.songLi[index].name + this.songLi[index].alias}})
        } else {
          this.move = false
        }
      }, 100)
    },
    moveing: function () {
      this.move = true
    }
  },
  mounted: function () {
    bus.$on('id', (e) => {
      if (e.id) {
        this.songDe.splice(0, this.songDe.length)
        this.songLi.splice(0, this.songLi.length)
        wyData.ListSongDetail(e.id, this.songLi, this.songDe)
        console.log('id')
      } else if (e.user) {
        wyData.dayRecommendSong(this.user)
        console.log('user')
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.song {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  z-index: 999;
  overflow: auto;
}
.song-top {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: #C20C0C;
  z-index: 3;
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
.song-de {
  position: relative;
  display: flex;
  justify-content: flex-start;
  margin-top: 2rem;
  width: 100%;
  height: 12rem;
  color: white;
  z-index: 1;
  overflow: hidden;
  .oi {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    filter: blur(74px);
    z-index: 1;
  }
  .iq {
    width: 146px;
    height: 146px;
    margin: 1.7rem 0 0 2rem;
    z-index: 2;
  }
  .song-de-r {
    width: 100%;
    padding: .6rem;
    z-index: 2;
    div {
      display: flex;
      align-items: center;
      margin-top: 2rem;
      text-align: left;
      img {
        width: 2rem;
        border-radius: 50%;
        margin-right: .6rem;
      }
      em {
        font-style: normal;
        font-size: .8rem;
        color: #ccc;
      }
    }
  }
}
.song-li {
  text-align: left;
  background: white;
  z-index: 2;
  border-radius: 1rem 1rem 0 0;
  li {
    list-style-type: decimal;
    color: #333;
    width: 88%;
    margin-left: 2.6rem;
    height: 56px;
    border-top: 1px solid #ccc;
    p {
      padding-top: .7rem;
      font-weight: bold;
      width: 100%;
      height: 1.2rem;
      overflow: hidden;
    }
    em {
      font-weight: 100;
      font-style: normal;
      color: #5a4f4f;
    }
    .qd {
      margin-top: .2rem;
      font-size: .8rem;
      color: #924747;
    }
  }
  li:nth-child(1) {
    border-top: none;
  }
}
</style>
