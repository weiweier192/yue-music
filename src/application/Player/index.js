import React, { useState, useRef, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import {
  changeCurrentIndex,
  changeCurrentSong,
  changeFullScreen,
  changePlayList,
  changePlayMode,
  changePlayingState,
  changeShowPlayList
} from './store/actionCreators.js'
import MiniPlayer from './miniPlayer/index.js'
import NormalPlayer from './normalPlayer/index.js'
import { getSongUrl, isEmptyObject } from '../../api/utils.js'

function Player (props) {
  // 目前播放时间
  const [currentTime, setCurrentTime] = useState(0)
  // 歌曲总长
  const [duration, setDuration] = useState(0)
  // 记录当前的歌曲，以便下一次渲染时比对是否为一首歌
  const [preSong, setPreSong] = useState({})

  const audioRef = useRef()

  // 歌曲播放进度
  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration
  const { fullScreen, playing, currentIndex, currentSong: immutableCurrentSong } = props
  const { toggleFullScreenDispatch, togglePlayingDispatch, changeCurrentIndexDispatch, changeCurrentDispatch } = props

  let currentSong = immutableCurrentSong.toJS()
  // 注意 audio标签在播放的过程中会不断地触发onTimeUpdate事件，
  // 在此需要更新currentTime变量
  const updateTime = useCallback(e => {
    setCurrentTime(e.target.currentTime)
  })

  let playList = [
    {
      ftype: 0,
      djId: 0,
      a: null,
      cd: '01',
      crbt: null,
      no: 1,
      st: 0,
      rt: '',
      cf: '',
      alia: [
        '手游《梦幻花园》苏州园林版推广曲'
      ],
      rtUrls: [],
      fee: 0,
      s_id: 0,
      copyright: 0,
      h: {
        br: 320000,
        fid: 0,
        size: 9400365,
        vd: -45814
      },
      mv: 0,
      al: {
        id: 84991301,
        name: '拾梦纪',
        picUrl: 'http://p1.music.126.net/M19SOoRMkcHmJvmGflXjXQ==/109951164627180052.jpg',
        tns: [],
        pic_str: '109951164627180052',
        pic: 109951164627180050
      },
      name: '拾梦纪',
      l: {
        br: 128000,
        fid: 0,
        size: 3760173,
        vd: -41672
      },
      rtype: 0,
      m: {
        br: 192000,
        fid: 0,
        size: 5640237,
        vd: -43277
      },
      cp: 1416668,
      mark: 0,
      rtUrl: null,
      mst: 9,
      dt: 234947,
      ar: [
        {
          id: 12084589,
          name: '妖扬',
          tns: [],
          alias: []
        },
        {
          id: 12578371,
          name: '金天',
          tns: [],
          alias: []
        }
      ],
      pop: 5,
      pst: 0,
      t: 0,
      v: 3,
      id: 1416767593,
      publishTime: 0,
      rurl: null
    }
  ]

  // 先mock一份currentIndex
  useEffect(() => {
    // 默认播放第一个
    changeCurrentIndexDispatch(0)
  }, [])
  useEffect(() => {
    if (!playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      playList[currentIndex].id === preSong.id) return
    let current = playList[currentIndex]
    changeCurrentDispatch(current) // 赋值currentSong
    setPreSong(current)
    audioRef.current.src = getSongUrl(current.id)
    setTimeout(() => {
      audioRef.current.play()
    })
    togglePlayingDispatch(true) // 播放状态
    setCurrentTime(0) // 从头开始播放
    setDuration((current.dt / 1000) | 0) // 时长 234
  }, [playList, currentIndex])

  useEffect(() => {
    playing ? audioRef.current.play() : audioRef.current.pause()
  }, [playing])

  // const currentSong = {
  //   al: { picUrl: "https://p1.music.126.net/JL_id1CFwNJpzgrXwemh4Q==/109351164172892390.jpg" },
  //   name: "木偶人",
  //   ar: [{ name: "薛之谦" }]
  // }

  const clickPlaying = useCallback((e, state) => {
    e.stopPropagation()
    togglePlayingDispatch(state)
  })

  const onProgressChange = useCallback(curPercent => {
    const newTime = curPercent * duration
    setCurrentTime(newTime)
    audioRef.current.currentTime = newTime
    if (!playing) {
      togglePlayingDispatch(true)
    }
  })

  // 上下曲切换
  // 1.一首歌循环
  const handleLoop = () => {
    audioRef.current.currentTime = 0
    togglePlayingDispatch(true)
    // audioRef.current.play()
  }
  // 2.上一首
  const handlePrev = useCallback(() => {
    // 播放列表只有一首歌
    if (playList.length === 1) {
      handleLoop()
      return
    }
    let index = currentIndex - 1
    if (index < 0) index = playList.length - 1
    if (!playing) togglePlayingDispatch(true)
    changeCurrentIndexDispatch(index)
  }, [playing])
  // 3.下一首
  const handleNext = useCallback(() => {
    // 播放列表只有一首歌
    if (playList.length === 1) {
      handleLoop()
      return
    }
    let index = currentIndex + 1
    if (index >= playList.length) index = 0
    if (!playing) togglePlayingDispatch(true)
    changeCurrentIndexDispatch(index)
  }, [playing])
  return (
    <div>
      {isEmptyObject(currentSong) ?
        null
        :
        <MiniPlayer
          percent={percent}
          playing={playing}
          fullScreen={fullScreen}
          song={currentSong}
          toggleFullScreen={toggleFullScreenDispatch}
          clickPlaying={clickPlaying}
        ></MiniPlayer>
      }
      {isEmptyObject(currentSong) ?
        null
        :
        <NormalPlayer
          percent={percent}
          playing={playing}
          duration={duration}
          currentTime={currentTime}
          fullScreen={fullScreen}
          song={currentSong}
          toggleFullScreen={toggleFullScreenDispatch}
          clickPlaying={clickPlaying}
          onProgressChange={onProgressChange}
          handlePrev={handlePrev}
          handleNext={handleNext}
        ></NormalPlayer>
      }
      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
      ></audio>
    </div>
  )
}

const mapStateToProps = state => ({
  fullScreen: state.getIn(["player", "fullScreen"]),
  playing: state.getIn(["player", "playing"]),
  currentSong: state.getIn(["player", 'currentSong']),
  showPlayList: state.getIn(["player", "showPlayList"]),
  mode: state.getIn(["player", "mode"]),
  currentIndex: state.getIn(["player", "currentIndex"]),
  playList: state.getIn(["player", "playList"]),
  sequencePlayList: state.getIn(["player", "sequencePlayList"])
})
const mapDispatchToProps = dispatch => {
  return {
    togglePlayingDispatch (data) {
      dispatch(changePlayingState(data))
    },
    toggleFullScreenDispatch (data) {
      dispatch(changeFullScreen(data))
    },
    togglePlayListDispatch (data) {
      dispatch(changeShowPlayList(data))
    },
    changeCurrentIndexDispatch (index) {
      dispatch(changeCurrentIndex(index))
    },
    changeCurrentDispatch (data) {
      dispatch(changeCurrentSong(data))
    },
    changeModeDispatch (data) {
      dispatch(changePlayMode(data))
    },
    changePlayListDispatch (data) {
      dispatch(changePlayList(data))
    }
  }
}

// 传值的时候先传state再传dispatch
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player))