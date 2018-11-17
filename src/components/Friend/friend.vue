<template>
  <div class="friend">
    <div class="noLonging" v-show="!isLongIn">
      <h1>登录后将显示朋友圈动态</h1>
      <h3 v-tap="{methods:long}">登录</h3>
    </div>
    <div class="friend-content" v-show="isLongIn">
      <ul>
        <li v-for="(item, index) in friendData" :key="index" class="xiq">
          <div class="userPic">
            <img v-bind:src="item.userPicUrl" alt="用户头像">
            <div class="pcw">
              <p><em>{{ item.name }}</em>{{ item.type }}</p>
              <p class="date">{{ (new Date(item.eventTime)).getMonth() + 1 + '月' + (new Date(item.eventTime)).getDate() + '日' }}</p>
            </div>
          </div>
          <div class="userDetails">
            <div class="pDe" v-html="(item.json)['s']"></div>
            <img v-bind:src="item.json['i']" alt="" class="pq">
            <div class="oDc" v-bind:class="item.json['i'] === null ? 'oqc': null">
              <img v-bind:src="item.json['i']" alt="">
              <p>{{ item.json['name'] }}</p>
              <p>{{ item.json['aname'] }}</p>
            </div>
            <div class="iCe">
              <ul>
                <li>
                  <a href="javascript:void(0)"><img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/good.png" alt="">{{ item.json['likedCount'] }}</a>
                </li>
                <li>
                  <a href="javascript:void(0)"><img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/forWard.png" alt="">{{ item.json['commentCount'] }}</a>
                </li>
                <li>
                  <a href="javascript:void(0)"><img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/dyComment.png" alt="">{{ item.json['shareCount'] }}</a>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import wyData from '../WyGetData'

export default {
  name: 'friend',
  data () {
    return {
      isLongIn: false,
      userData: [],
      userDataDetail: [],
      friendData: []
    }
  },
  watch: {
    userDataDetail: {
      handler (curVal, oldVal) {
        this.isLongIn = true
        wyData.friend(this.friendData, 10, 0)
      },
      deep: false
    },
    friendData: {
      handler (curVal, oldVal) {
        // console.log(oldVal)
      },
      deep: false
    }
  },
  methods: {
    long: function () {
      this.$router.push({path: '/user'})
    }
  },
  mounted: function () {
    wyData.longIn('18574850529', 'wwbtf1314Lyx', this.userData, this.userDataDetail)
    // wyData.friend(this.friends)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
em {
  font-size: 16px;
  font-style: normal;
  color: #5555b9;
  margin: 0 12px 0 0;
}
</style>
<style lang="less" scoped>
@red: #C20C0C;
@black: #333;
@blue: #5555b9;
@b: white;
.friend {
  position: relative;
  padding-top: 3rem;
  height: 100%;
  color: @black;
  overflow-x: hidden;
  .noLonging {
    h1 {
      font-size: 1.2rem;
    }
    @h: 2rem;
    h3 {
      width: 24%;
      margin: .6rem auto;
      height: @h;
      line-height: @h;
      color: @b;
      background-color: @red;
      border-radius: .4rem;
      font-size: .9rem;
    }
  }
}
ul {
  padding: 0 .4rem;
}
em {
  margin-right: 16px;
  font-style: normal;
  color: @blue;
}
li {
  list-style-type: none;
  .userPic {
    display: flex;
    img {
      width: 38px;
      height: 38px;
      border-radius: 50%;
    }
    .pcw {
      flex: .8;
      text-align: left;
      font-size: .9rem;
      margin-left: 24px;
      p {
        color: #656565;
        padding-top: .2rem;
      }
      .date {
        font-size: .8rem;
      }
    }
  }
}
.xiq {
  border-bottom: 1px solid #ccc;
  margin-top: .6rem;
}
.oqc {
  height: 0;
}
.userDetails {
  padding: 0.8rem 0 0 3.8rem;
  text-align: left;
  .pq {
    width: 60%;
    margin: .4rem 0;
  }
  .oDc {
    position: relative;
    background-color: #efefef;
    img {
      width: 2.4rem;
    }
    p {
      position: absolute;
      left: 2.8rem;
      top: 0.2rem;
    }
    p:nth-child(2) {
      top: 1.5rem;
      color: #656565;
      font-size: .7rem;
    }
  }
  .iCe {
    margin: .6rem 0;
    ul {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      li {
        margin-left: 4rem;
      }
      li:nth-child(1) {
        margin-left: 0;
      }
      a {
        text-decoration:none;
        color: #656565;
        font-size: .8rem;
        text-indent: 1rem;
      }
    }
  }
}
</style>
