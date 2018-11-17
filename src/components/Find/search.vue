<template>
  <div id="search" @touchmove="move">
    <div class="result-suggest">
      <ul>
        <li class="blue" v-show="keyword === '' ? false : true" @touchend.stop="go1">搜索" {{ keyword }} "</li>
        <li v-for="(item, index) in suggest" :key="index" @touchend.stop="go(index)"> {{ item.name }} - <em>{{ item.album }}</em></li>
        <li v-for="(item, index) in result" :key="index" @touchend.stop="play(index)"> {{ item.name }} - <em>{{ item.auname }}</em> </li>
      </ul>
    </div>
  </div>
</template>

<script>
import wyData from '../WyGetData'
import bus from '../../router/event'

export default {
  name: 'search',
  data () {
    return {
      suggest: [],
      keyword: '',
      isMove: false,
      blurPicUrl: [],
      index: 0,
      isSearch: true,
      result: []
    }
  },
  watch: {
    result: {
      handler (curVal, oldVal) {
      },
      deep: false
    },
    suggest: {
      handler (curVal, oldVal) {
        this.isSearch = true
      },
      deep: false
    },
    blurPicUrl: {
      handler (curVal, oldVal) {
        bus.$emit('play', {view: true, id: this.result[this.index].id, d: {img: this.blurPicUrl[0], name: this.result[this.index].name + this.result[this.index].auname}})
      },
      deep: false
    }
  },
  methods: {
    play: function (index) {
      setTimeout(() => {
        if (!this.isMove) {
          this.index = index
          this.blurPicUrl.splice(0, this.blurPicUrl.length)
          wyData.getAublmContent(this.result[index].auId, this.blurPicUrl)
        } else {
          this.isMove = false
        }
      }, 0)
    },
    move: function () {
      this.isMove = true
    },
    go1: function () {
      this.suggest.splice(0, this.suggest.length)
      wyData.getSearch(this.keyword, 1, 20, this.result)
    },
    go: function (index) {
      bus.$emit('play', {view: true, id: this.suggest[index].id, d: {img: this.suggest[index].picUrl, name: this.suggest[index].name}})
    }
  },
  mounted: function () {
    bus.$on('search', (e) => {
      if (this.isSearch) {
        setTimeout(() => {
          this.keyword = e
          this.suggest.splice(0, this.suggest.length)
          this.result.splice(0, this.result.length)
          wyData.getSuggest(e, 1, 10, this.suggest)
          this.isSearch = false
        }, 1000)
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@red: #C20C0C;
@blue: #5b5bf5;
@blueDeep: #4343bf;
#search {
  position: relative;
  padding-top: 2.4rem;
  padding-bottom: 57px;
  color: #333;
  overflow-x: hidden;
}
.blue {
  color: @blueDeep;
}
.result-suggest {
  padding: 1rem;
  color: #333;
  text-align: left;
  li {
    list-style-type: none;
    height: 2.6rem;
    width: 100%;
    overflow: hidden;
    line-height: 2.6rem;
    border-bottom: 1px solid #ccc;
    em {
      color: @blue;
      font-style: normal;
    }
  }
}
</style>
