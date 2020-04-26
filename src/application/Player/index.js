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
import { getSongUrl, isEmptyObject, shuffle, findIndex } from '../../api/utils.js'
import Toast from '../../baseUI/Toast/index.js'
import { playMode } from '../../api/config.js'
import PlayList from './play-list/index.js'

function Player (props) {
  // 目前播放时间
  const [currentTime, setCurrentTime] = useState(0)
  // 歌曲总长
  const [duration, setDuration] = useState(0)
  // 记录当前的歌曲，以便下一次渲染时比对是否为一首歌
  const [preSong, setPreSong] = useState({})
  const [modeText, setModeText] = useState('')
  const toastRef = useRef()
  const audioRef = useRef()
  // 当前的歌曲是否加载完成
  const currentSongReady = useRef(true)

  const { fullScreen, playing, currentIndex, currentSong: immutableCurrentSong,
    mode, sequencePlayList: immutableSequencePlayList, playList: immutablePlayList
  } = props
  const {
    toggleFullScreenDispatch,
    togglePlayingDispatch,
    changeCurrentIndexDispatch,
    changeCurrentDispatch,
    changePlayListDispatch, // 改变playList
    changeModeDispatch, // 改变模式
    toggleShowPlayListDispatch
  } = props

  // 歌曲播放进度
  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration
  const currentSong = immutableCurrentSong.toJS()
  const playList = immutablePlayList.toJS()
  const sequencePlayList = immutableSequencePlayList.toJS()

  // 注意 audio标签在播放的过程中会不断地触发onTimeUpdate事件，
  // 在此需要更新currentTime变量
  const updateTime = useCallback(e => {
    setCurrentTime(e.target.currentTime)
  })

  // 改变播放模式
  const changeMode = useCallback(() => {
    let newMode = (mode + 1) % 3
    if (newMode === 0) {
      // 顺序播放
      changePlayListDispatch(sequencePlayList)
      let index = findIndex(currentSong, sequencePlayList)
      changeCurrentIndexDispatch(index)
      setModeText("顺序循环")
    } else if (newMode === 1) {
      // 单曲循环
      changePlayListDispatch(sequencePlayList)
      setModeText("单曲循环")
    } else if (newMode === 2) {
      // 随机播放
      let newList = shuffle(sequencePlayList)
      let index = findIndex(currentSong, newList)
      changePlayListDispatch(newList)
      changeCurrentIndexDispatch(index)
      setModeText("随机播放")
    }
    changeModeDispatch(newMode)
    // Toast提示
    toastRef.current.show()
  })

  // 完善控制歌曲播放的逻辑
  // 先mock一份currentIndex
  // useEffect(() => {
  //   // 默认播放第一个
  //   changeCurrentIndexDispatch(0)
  // }, [])
  useEffect(() => {
    if (!playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      playList[currentIndex].id === preSong.id ||
      !currentSongReady.current
    ) return
    let current = playList[currentIndex]
    changeCurrentDispatch(current) // 赋值currentSong
    setPreSong(current)
    currentSongReady.current = false // 表示当前歌曲资源正在加载，不能切歌
    audioRef.current.src = getSongUrl(current.id)
    setTimeout(() => {
      // .play() 返回一个promise
      audioRef.current.play().then(() => {
        currentSongReady.current = true // 表示当前歌曲加载完成，可以播放
      }).catch(() => {
        handleError()
      })
    })
    togglePlayingDispatch(true) // 播放状态
    setCurrentTime(0) // 从头开始播放
    setDuration((current.dt / 1000) | 0) // 时长 234
  }, [playList, currentIndex])

  // 播放和暂停，通过监听playing变量来实现
  useEffect(() => {
    playing ? audioRef.current.play() : audioRef.current.pause()
  }, [playing])

  // 通过点击播放|暂停按钮，来改变 playing
  const clickPlaying = useCallback((e, state) => {
    // 它可以阻止把事件分派到其它节点
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
  // 1.单曲循环
  const handleLoop = () => {
    audioRef.current.currentTime = 0
    togglePlayingDispatch(true)
    audioRef.current.play()
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
  }, [playList, playing, currentIndex, togglePlayingDispatch, changeCurrentIndexDispatch])
  // 3.下一首
  const handleNext = useCallback(() => {
    // 播放列表只有一首歌
    if (playList.length === 1) {
      handleLoop()
      return
    }
    let index = currentIndex + 1
    if (index === playList.length) index = 0
    if (!playing) togglePlayingDispatch(true)
    changeCurrentIndexDispatch(index)
  }, [playList, playing, currentIndex, togglePlayingDispatch, changeCurrentIndexDispatch])

  // 当前歌曲播放完成后的处理
  const handleEnd = () => {
    if (mode === playMode.loop) {
      handleLoop()
    } else {
      handleNext()
    }
  }
  // 处理当前歌曲加载异常
  const handleError = () => {
    currentSongReady.current = true
    alert("获取歌曲资源出错")
  }

  return (
    <div className="player">
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
          toggleShowPlayList={toggleShowPlayListDispatch}
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
          mode={mode}
          changeMode={changeMode}
          toggleShowPlayList={toggleShowPlayListDispatch}
        ></NormalPlayer>
      }
      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
        onEnded={handleEnd}
        onError={handleError}
      ></audio>
      <PlayList></PlayList>
      <Toast ref={toastRef} text={modeText}></Toast>
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
    toggleShowPlayListDispatch (data) {
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