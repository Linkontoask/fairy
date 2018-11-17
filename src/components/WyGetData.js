import Vue from 'vue'
// import bus from '../../router/eventBus'
export default {
  longIn: function (user, pass, data, dataDetail) {
    // 登录
    try {
      Vue.http.get('http://linkorg.club:8091/login/cellphone', {
        params: {
          'phone': user,
          'password': pass
        },
        xhrFields: {
          withCredentials: true
        }
        // -------------------------
      }).then((res) => {
        data.push(res.data)
        // console.log(res.data)
        // global.userData.splice(0, global.userData.length - 1)
        // global.userData.push(res.data)
        this.userDetail(res.data.profile.userId, dataDetail)
        // global.isLong = true
        // console.log(res)
      })
    } catch (e) {
      console.log(e)
    }
  },
  longIn1: function (user, pass) {
    // 登录
    Vue.http.get('http://linkorg.club:8091/login/cellphone', {
      params: {
        'phone': user,
        'password': pass
      },
      xhrFields: {
        withCredentials: true
      }
      // -------------------------
    }).then((res) => {
    })
  },
  userDetail: function (uid, dataDetail) {
    // 用户详情
    Vue.http.get('http://linkorg.club:8091/user/detail', {
      params: {
        'uid': uid
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res.data)
      // global.dataDetail.splice(0, global.userData.length - 1)
      dataDetail.push(res.data)
      // global.userDataDetail.push(res.data)
    })
  },
  getUserInfos: function (uid, p) {
    // 获取用户信息 , 歌单，收藏，mv, dj 数量
    Vue.http.get('http://linkorg.club:8091/user/playlist', {
      params: {
        'uid': uid
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res)
      for (let i = 0; i < res.data.playlist.length; i++) {
        if (i === 0) {
          p.push({
            'src': 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/heart.png',
            'name': res.data.playlist[i].name,
            'id': res.data.playlist[i].id,
            'isWy': true
          })
        } else {
          p.push({
            'src': 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/singlist.png',
            'name': res.data.playlist[i].name,
            'id': res.data.playlist[i].id,
            'isWy': true
          })
        }
      }
    })
  },
  updateLongIn: function () {
    // 刷新登录
    Vue.http.get('http://linkorg.club:8091/login/refresh', {
      params: {
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res)
    })
  },
  getPersonalFm: function (data) {
    // 获取个人FM
    Vue.http.get('http://linkorg.club:8091/personal_fm', {
      params: {
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      for (let i = 0; i < res.data.data.length; i++) {
        data.push({
          'author_name': res.data.data[i].artists[0].name,
          'song_name': res.data.data[i].name,
          'id': res.data.data[i].id,
          'src': 'http://music.163.com/song/media/outer/url?id=' + res.data.data[i].id + '.mp3',
          'isWy': true,
          'img': res.data.data[i].album.picUrl
        })
      }
      // console.log(res)
    })
  },
  getSuggest: function (key, type, limit, p) {
    // 获取个人FM
    Vue.http.get('http://linkorg.club:8091/search/suggest', {
      params: {
        'keywords': key,
        'type': type,
        'limit': limit
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res.data)
      if (res.data.result.songs.length !== 0) {
        res.data.result.songs.forEach((item) => {
          p.push({
            'name': item.name,
            'album': item.album.name,
            'picUrl': item.album.artist.img1v1Url,
            'id': item.id
          })
        })
      }
    })
  },
  getSearch: function (key, type, limit, result) {
    // 获取搜索结果
    Vue.http.get('http://linkorg.club:8091/search', {
      params: {
        'keywords': key,
        'type': type,
        'limit': limit
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      if (key === '') return
      // console.log(res.data.result)
      if (type === 1) {
        for (let i = 0; i < res.data.result.songs.length; i++) {
          result.push({
            'id': res.data.result.songs[i].id,
            'name': res.data.result.songs[i].name,
            'auname': res.data.result.songs[i].artists[0].name,
            'duration': res.data.result.songs[i].duration,
            'auId': res.data.result.songs[i].artists[0].id
          })
        }
        // console.log(res)
      } else if (type === 1000) {
        for (let i = 0; i < res.data.result.playlists.length; i++) {
          result.push({
            'id': res.data.result.playlists[i].id,
            'name': res.data.result.playlists[i].name
          })
        }
      } else if (type === 1004) {
        for (let i = 0; i < res.data.result.mvs.length; i++) {
          result.push({
            'name': res.data.result.mvs[i].name,
            'auname': res.data.result.mvs[i].artistName,
            'id': res.data.result.mvs[i].id
          })
        }
      } else if (type === 100) {
        result.push({
          'name': res.data.result.artists[0].name,
          'id': res.data.result.artists[0].id
        })
        // console.log(res)
      } else if (type === 1006) {
        for (let i = 0; i < res.data.result.songs.length; i++) {
          result.push({
            'name': res.data.result.songs[i].name,
            'auname': res.data.result.songs[i].artists[0].name,
            'auId': res.data.result.songs[i].artists[0].id,
            'duration': res.data.result.songs[i].duration,
            'id': res.data.result.songs[i].id
          })
        }
      }
    })
  },
  dayRecommendList: function () {
    // 获取每日推荐歌单
    Vue.http.get('http://linkorg.club:8091/recommend/resource', {
      params: {
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res)
    })
  },
  dayRecommendSong: function (p) {
    // 获取每日推荐歌曲
    Vue.http.get('/Node/recommend/songs', {
      params: {
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      console.log(res)
      for (let i = 0; i < res.data.recommend.length; i++) {
        p.push(res.data.recommend[i])
      }
    })
  },
  reCommendListSong: function (p, limit, offset) {
    // 获取用户推荐歌单 (需登录)
    Vue.http.get('http://linkorg.club:8091/personalized', {
      params: {
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res.data.result)
      for (let i = 0; i < res.data.result.length; i++) {
        if (i >= offset && i < offset + limit) {
          p.push({
            'name': res.data.result[i].name,
            'picUrl': res.data.result[i].picUrl,
            'id': res.data.result[i].id,
            'playCount': res.data.result[i].playCount
          })
        }
      }
      // console.log(p)
    })
  },
  latestMusic: function (p) {
    // 获取用户推荐音乐
    Vue.http.get('http://linkorg.club:8091/personalized/newsong', {
      params: {
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res.data.result)
      for (let i = 1; i < 10; i++) {
        p.push({
          'name': res.data.result[i].name,
          'picUrl': res.data.result[i].song.album.picUrl,
          'id': res.data.result[i].id
        })
      }
    })
  },
  recommendedMV: function (p) {
    // 获取用户推荐音乐
    Vue.http.get('http://linkorg.club:8091/personalized/mv', {
      params: {
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res.data.result)
      res.data.result.forEach((item) => {
        p.push({
          'name': item.name,
          'picUrl': item.picUrl,
          'playCount': item.playCount,
          'duration': item.duration,
          'id': item.id,
          'copywriter': item.copywriter
        })
      })
    })
  },
  radioStation: function (p) {
    // 获取用户推荐电台
    Vue.http.get('http://linkorg.club:8091/personalized/djprogram', {
      params: {
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res.data.result)
      for (let i = 0; i < res.data.result.length; i++) {
        p.push({
          'name': res.data.result[i].name,
          'picUrl': res.data.result[i].picUrl,
          'id': res.data.result[i].id
        })
      }
    })
  },
  SongsDetail: function (id) {
    // 获取歌曲详情
    Vue.http.get('http://linkorg.club:8091/song/detail', {
      params: {
        'ids': id
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res)
      // this.artDetail(res.data.songs[0].ar[0].id)
    })
  },
  Getartists: function (id, img) {
    // 获取歌手单曲
    Vue.http.get('http://linkorg.club:8091/artists', {
      params: {
        'id': id
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res)
      img.push(res.data.artist.img1v1Url)
    })
  },
  SongSrcDetail: function (id, p) {
    // 获取歌曲播放链接
    Vue.http.get('http://linkorg.club:8091/music/url', {
      params: {
        'id': id
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res)
      // p.push(res.data.data[0].url)
    })
  },
  SongLyc: function (id, p) {
    // 获取歌曲歌词
    Vue.http.get('http://linkorg.club:8091/lyric', {
      params: {
        'id': id
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res)
      try {
        p.push(res.data.lrc.lyric)
      } catch (e) {
        p.push('无歌词')
        console.log('无歌词')
      }
    })
  },
  ListSongDetail: function (id, p, d) {
    // 获取歌单详情
    Vue.http.get('http://linkorg.club:8091/playlist/detail', {
      params: {
        'id': id
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res.data)
      d.push({
        'img': res.data.result.coverImgUrl,
        'userImg': res.data.result.creator.avatarUrl,
        'description': res.data.result.description,
        'name': res.data.result.name,
        'tags': res.data.result.tags,
        'userName': res.data.result.creator.nickname,
        'createTime': res.data.result.createTime
      })
      let c = res.data.result.tracks
      for (let i = 0; i < c.length; i++) {
        p.push({
          'name': c[i].name,
          'alias': c[i].alias,
          'artists': c[i].artists[0].name,
          'id': c[i].id,
          'blurPicUrl': c[i].album.blurPicUrl
        })
      }
    })
  },
  getHomePageImg: function (d) {
    // 获取banner图
    Vue.http.get('http://linkorg.club:8091/banner', {
      params: {
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // d.push(res.data.banners)
      for (let i = 0; i < res.data.banners.length; i++) {
        d.push(res.data.banners[i].pic)
      }
      // console.log(res.data.banners)
    })
  },
  friend: function (d, limit, offset) {
    // 获取朋友圈动态
    Vue.http.get('http://www.linkorg.club:3001/fr', {
      params: {
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      console.log(res.data)
      if (res.data.code === 301) {
        alert('数据限制,以上数据为模拟数据')
      }
      res.data.event.forEach((item, index) => {
        if (/(18)|(19)|(21)|(22)/.test(item.type)) {
          switch (item.type) {
            case 18: pc('分享单曲', item); break
            case 19: pc('分享专辑', item); break
            case 22: pc('转发', item); break
          }
        }
      })
      function pc (char, item) {
        let c = JSON.parse(item['json'])
        let info = item.info
        let cq = ''
        let qc = c['msg'].split('#')
        for (var i = 0; i < qc.length; i++) {
          if (qc.length === 1) {
            cq = qc[0]
            break
          }
          if (i % 2 === 0) {
            if (i === qc.length - 1) {
              cq += qc[i]
            } else {
              cq += (qc[i] + '<em>#')
            }
          } else {
            cq += (qc[i] + '#</em>')
          }
        }
        let cqd = ''
        if (!c.hasOwnProperty('song')) {
          cqd = 'album'
        } else {
          cqd = 'song'
        }
        let json = {
          's': cq,
          'i': c.hasOwnProperty(cqd) ? cqd === 'song' ? c[cqd]['album'].blurPicUrl : c[cqd].blurPicUrl : null,
          'id': c.hasOwnProperty(cqd) ? c[cqd].id : null,
          'name': c.hasOwnProperty(cqd) ? c[cqd].artists[0].name : null,
          'aname': c.hasOwnProperty(cqd) ? c[cqd].name : null,
          'shareCount': info.shareCount,
          'commentCount': info.commentCount,
          'likedCount': info.likedCount,
          'liked': info.liked
        }
        d.push({
          'name': item['user'].nickname,
          'userPicUrl': item['user'].avatarUrl,
          'type': char,
          'json': json,
          'eventTime': item['eventTime']
        })
      }
      // type : 21=视频 18=单曲 22=转发 19=专辑
    })
  },
  getMv: function (data, limit, offset) {
    // 获取最新MV
    Vue.http.get('http://linkorg.club:8091/mv/first', {
      params: {
        'limit': limit,
        'offset': offset
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res.data.data)
      res.data.data.forEach((item) => {
        data.push({
          'name': item.name,
          'picUrl': item.cover,
          'duration': item.duration,
          'playCount': item.playCount,
          'id': item.id,
          'copywriter': item.briefDesc
        })
      })
    })
  },
  recommenMv: function (data, limit, offset) {
    // mv排行榜
    Vue.http.get('http://linkorg.club:8091/top/mv', {
      params: {
        'limit': limit,
        'offset': offset
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res.data.data)
      res.data.data.forEach((item) => {
        data.push({
          'name': item.name,
          'picUrl': item.cover,
          'duration': item.duration,
          'playCount': item.playCount,
          'id': item.id,
          'copywriter': item.briefDesc
        })
      })
    })
  },
  resemble: function (mvid, reLevant) {
    // mv相似
    Vue.http.get('http://linkorg.club:8091/simi/mv', {
      params: {
        'mvid': mvid
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res.data.mvs)
      for (let i = 0; i < res.data.mvs.length; i++) {
        reLevant.push(res.data.mvs[i])
      }
    })
  },
  commentMv: function (mvid, count, comment, hotComment) {
    // mv评论
    Vue.http.get('http://linkorg.club:8091/comment/mv', {
      params: {
        'limit': count,
        'id': mvid
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res.data)
      for (let i = 0; i < res.data.comments.length; i++) {
        comment.push(res.data.comments[i])
      }
      for (let i = 0; i < res.data.hotComments.length; i++) {
        hotComment.push(res.data.hotComments[i])
      }
    })
  },
  goodComment: function (id, cid, t, tpye) {
    // 评论点赞
    Vue.http.get('http://linkorg.club:8091/comment/like', {
      params: {
        'id': id,
        'cid': cid,
        't': t,
        'tpye': tpye
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res)
    })
  },
  playMv: function (id) {
    // 播放MV
    Vue.http.get('http://linkorg.club:8091/mv', {
      params: {
        'mvid': id
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // bus.$emit('setMv', res.data.data)
      // console.log(res.data.data)
    })
  },
  yunRec: function (data, p) {
    // 我的音乐云盘
    Vue.http.get('http://linkorg.club:8091/user/cloud', {
      params: {
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      p.push({
        'size': parseInt(res.data.size),
        'maxSize': parseInt(res.data.maxSize)
      })
      // console.log(p)
      for (let i = 0; i < res.data.data.length; i++) {
        data.push({
          'songName': res.data.data[i].songName,
          'artist': res.data.data[i].artist,
          'album': res.data.data[i].album,
          'songId': res.data.data[i].songId,
          'fileName': res.data.data[i].fileName.replace(/.+\./, ''),
          'fileSize': res.data.data[i].fileSize,
          'img': res.data.data[i].simpleSong.al.picUrl,
          'id': res.data.data[i].simpleSong.privilege.id,
          'addTime': res.data.data[i].addTime,
          'duration': res.data.data[i].simpleSong.dt,
          'isWy': true
        })
      }
      // console.log(res)
    })
  },
  myFm: function (data, limit) {
    // 用户电台
    Vue.http.get('http://linkorg.club:8091/dj/recommend', {
      params: {
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res)
      res.data.djRadios.forEach((item, index) => {
        if (index < limit) {
          data.push({
            'name': item.name,
            'copywriter': item.copywriter,
            'picUrl': item.picUrl,
            'id': item.id
          })
        }
      })
    })
  },
  FMTabRecommend: function (data, limit, type, i) {
    // 电台 - 分类推荐
    Vue.http.get('http://linkorg.club:8091/dj/recommend/type', {
      params: {
        'type': type
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res.data.djRadios)
      res.data.djRadios.forEach((item, index) => {
        if (index < limit) {
          data[i].push({
            'name': item.name,
            'picUrl': item.picUrl,
            'copywriter': item.rcmdtext,
            'id': item.id
          })
        }
      })
    })
  },
  myShows: function (data, limit) {
    // 推荐节目
    Vue.http.get('http://linkorg.club:8091/program/recommend', {
      params: {
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res.data.programs)
      res.data.programs.forEach((item, index) => {
        if (index < limit) {
          data.push({
            'name': item.name,
            'picUrl': item.coverUrl,
            'copywriter': item.reason,
            'id': item.id
          })
        }
      })
    })
  },
  myPored: function (data, limit) {
    // 独家放送
    Vue.http.get('http://linkorg.club:8091/personalized/privatecontent', {
      params: {
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res.data.result)
      res.data.result.forEach((item, index) => {
        if (index < limit) {
          data.push({
            'name': item.name,
            'picUrl': item.picUrl,
            'id': item.id,
            'copywriter': item.copywriter
          })
        }
      })
    })
  },
  FMTab: function (data, limit) {
    // 电台 - 分类
    Vue.http.get('http://linkorg.club:8091/dj/catelist', {
      params: {
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res.data.categories)
      res.data.categories.forEach((item, index) => {
        if (index < limit) {
          data.push({
            'id': item.id,
            'name': item.name
          })
        }
      })
    })
  },
  myFmProgram: function (rid, data, offset) {
    // 电台节目
    Vue.http.get('http://linkorg.club:8091/dj/program', {
      params: {
        'rid': rid,
        'limit': 50,
        'offset': offset
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      for (let i = 0; i < res.data.programs.length; i++) {
        data.push({
          'serialNum': res.data.programs[i].serialNum,
          'img': res.data.programs[i].coverUrl,
          'name': res.data.programs[i].name,
          'listenerCount': res.data.programs[i].listenerCount,
          'likedCount': res.data.programs[i].likedCount,
          'id': res.data.programs[i].mainSong.id,
          'createTime': res.data.programs[i].createTime,
          'dt': res.data.programs[i].duration
        })
      }
      console.log(res.data)
    })
  },
  myFmDetails: function (rid, data) {
    // 电台详情
    Vue.http.get('http://linkorg.club:8091/dj/detail', {
      params: {
        'rid': rid
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      data.push({
        'img': res.data.djRadio.picUrl,
        'name': res.data.djRadio.name,
        'auname': res.data.djRadio.dj.nickname,
        'auimg': res.data.djRadio.dj.avatarUrl,
        'desc': res.data.djRadio.desc,
        'category': res.data.djRadio.category
      })
      console.log(res)
    })
  },
  getSingerAublm: function (id, limit, data, hot) {
    // 获取歌手专辑
    Vue.http.get('http://linkorg.club:8091/artist/album', {
      params: {
        'id': id,
        'limit': limit
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      data.push({
        'name': res.data.artist.name,
        'alias': res.data.artist.alias[0],
        'musicSize': res.data.artist.musicSize,
        'albumSize': res.data.artist.albumSize,
        'picUrl': res.data.artist.picUrl
      })
      for (let i = 0; i < res.data.hotAlbums.length; i++) {
        hot.push({
          'id': res.data.hotAlbums[i].id,
          'picUrl': res.data.hotAlbums[i].picUrl,
          'name': res.data.hotAlbums[i].name,
          'dt': res.data.hotAlbums[i].publishTime
        })
      }
      // console.log(res)
    })
  },
  plateOnShelf: function (p, offset, limit) {
    // 新碟上架
    Vue.http.get('http://linkorg.club:8091/top/album', {
      params: {
        'offset': offset,
        'limit': limit
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      res.data.albums.forEach((item, index) => {
        p.push({
          'name': item.name,
          'type': item.type,
          'company': item.company,
          'picUrl': item.picUrl,
          'artistsName': item.artist.name,
          'artistsPicUrl': item.artist.picUrl
        })
      })
      // console.log(p)
    })
  },
  getAublmContent: function (id, data) {
    // 专辑内容
    Vue.http.get('http://linkorg.club:8091/album', {
      params: {
        'id': id
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      if (res.data.code !== 404) {
        data.push(res.data.album.picUrl)
      } else {
        data.push('http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg')
      }
    })
  },
  getSingerMv: function (id, data) {
    // 获取歌手MV
    Vue.http.get('http://linkorg.club:8091/artist/mv', {
      params: {
        'id': id,
        'limit': 32
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      for (let i = 0; i < res.data.mvs.length; i++) {
        data.push({
          'imgurl': res.data.mvs[i].imgurl,
          'name': res.data.mvs[i].name,
          'duration': res.data.mvs[i].duration / 1000,
          'playCount': res.data.mvs[i].playCount,
          'id': res.data.mvs[i].id
        })
      }
      console.log(res)
    })
  },
  getSingerDetils: function (id, data) {
    // 获取歌手具体详情
    Vue.http.get('http://linkorg.club:8091/artist/desc', {
      params: {
        'id': id
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      data.push({
        'briefDesc': res.data.briefDesc,
        'introduction': res.data.introduction
      })
      console.log(res)
    })
  },
  getSingerSimi: function (id, data) {
    // 获取相似歌手
    Vue.http.get('http://linkorg.club:8091/simi/artist', {
      params: {
        'id': id,
        'limit': 30
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      for (let i = 0; i < res.data.artists.length; i++) {
        data.push({
          'picUrl': res.data.artists[i].picUrl,
          'name': res.data.artists[i].name,
          'id': res.data.artists[i].id
        })
      }
      console.log(res)
    })
  },
  getSearchHot: function () {
    // 获取相似歌手
    Vue.http.get('http://linkorg.club:8091/search/hot', {
      params: {
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
    })
  }
}
