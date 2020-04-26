import React, { useRef, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { PlayListWrapper, ScrollWrapper, ListHeader, ListContent } from './style.js'
import { changeShowPlayList, changeCurrentIndex, changePlayMode, changePlayList, deleteSong } from '../store/actionCreators.js'
import { prefixStyle, getName } from '../../../api/utils.js'
import { playMode } from '../../../api/config.js'
import Scroll from '../../../baseUI/scroll/index.js'

function PlayList (props) {
  const playListRef = useRef()
  const listWrapperRef = useRef()
  const [isShow, setIsShow] = useState(false)
  const {
    showPlayList,
    currentIndex,
    currentSong: immutableCurrentSong,
    playList: immutablePlayList,
    sequencePlayList: immutableSequencePlayList,
    mode
  } = props
  const {
    togglePlayListDispatch,
    changeCurrentIndexDispatch,
    changeModeDispatch,
    changePlayListDispatch,
    deleteSongDispatch
  } = props

  const currentSong = immutableCurrentSong.toJS()
  const playList = immutablePlayList.toJS()
  const sequencePlayList = immutableSequencePlayList.toJS()

  const transform = prefixStyle("transform")
  // 标识当前播放的歌曲
  const getCurrentIcon = (itemId) => {
    // 判断是否为当前正在播放的歌曲
    const current = currentSong.id === itemId
    const className = current ? "icon-play" : ''
    const content = current ? "&#xe6e3;" : ''
    return (
      <i className={`current iconfont ${className}`} dangerouslySetInnerHTML={{ __html: content }}></i>
    )
  }
  // 选择播放模式
  const getPlayMode = () => {
    let content, text
    if (mode === playMode.sequence) {
      content = "&#xe625;"
      text = "顺序播放"
    } else if (mode === playMode.loop) {
      content = '&#xe653;'
      text = "单曲循环"
    } else if (mode === playMode.random) {
      content = "&#xe61b;"
      text = "随机播放"
    }
    return (
      <div>
        <i className="iconfont"
          onClick={e => changeMode(e)}
          dangerouslySetInnerHTML={{ __html: content }}></i>
        <span className="text" onClick={e => changeMode(e)}>{text}</span>
      </div>
    )
  }
  const changeMode = (e) => {
    e.stopPropagation()
    let newMode = (mode + 1) % 3
  }
  // 进入列表
  const onEnterCB = useCallback(() => {
    // 显示列表
    setIsShow(true)
    // 最开始是隐藏在下边
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`
  }, [transform])
  // 正在显示列表
  const onEnteringCB = useCallback(() => {
    // 显示列表
    listWrapperRef.current.style["transition"] = `all 0.3s`
    listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`
  }, [transform])
  // 正在退出列表
  const onExitingCB = useCallback(() => {
    // 开启退出动画
    listWrapperRef.current.style["transition"] = `all 0.3s`
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`
  }, [transform])
  // 退出列表
  const onExitedCB = useCallback(() => {
    setIsShow(false)
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`
  }, [transform])

  // 展示列表
  const handleShowPlayList = (e, show) => {
    e.stopPropagation()
    togglePlayListDispatch(show)
  }
  // 实现点击切歌功能
  const handleChangeCurrentIndex = (e, index) => {
    e.stopPropagation()
    // if (currentIndex === index) return
    changeCurrentIndexDispatch(index)
  }
  // 删除当前选中的歌曲
  const handleDeleteSong = (e, song) => {
    e.stopPropagation()
    deleteSongDispatch(song)
  }

  return (
    <CSSTransition
      in={showPlayList}
      timeout={300}
      classNames="list-fade"
      onEnter={onEnterCB}
      onEntering={onEnteringCB}
      onExiting={onExitingCB}
      onExited={onExitedCB}
    >
      <PlayListWrapper
        ref={playListRef}
        style={isShow === true ? { display: "block" } : { display: "none" }}
        onClick={(e) => handleShowPlayList(e, false)}
      >
        <div className="list_wrapper" ref={listWrapperRef} onClick={e => e.stopPropagation()}>
          <ListHeader>
            <h1 className="title">
              {getPlayMode()}
              <span className="iconfont clear" onClick={() => { }}>&#xe63d;</span>
            </h1>
          </ListHeader>
          <ScrollWrapper>
            <Scroll>
              <ListContent>
                {
                  playList.map((item, index) => {
                    return (
                      <li
                        className="item"
                        key={item.id}
                        onClick={(e) => handleChangeCurrentIndex(e, index)}
                      >
                        {getCurrentIcon(item.id)}
                        <span className="text">{item.name} - {getName(item.ar)}</span>
                        <span className="like">
                          <i className="iconfont">&#xe601;</i>
                        </span>
                        <span className="delete" onClick={e => handleDeleteSong(e, item)}>
                          <i className="iconfont">&#xe63d;</i>
                        </span>
                      </li>
                    )
                  })
                }
              </ListContent>
            </Scroll>
          </ScrollWrapper>
        </div>
      </PlayListWrapper>
    </CSSTransition>
  )
}

const mapStateToProps = state => ({
  showPlayList: state.getIn(["player", 'showPlayList']),
  currentIndex: state.getIn(["player", 'currentIndex']),
  currentSong: state.getIn(["player", 'currentSong']),
  playList: state.getIn(["player", 'playList']),
  sequencePlayList: state.getIn(["player", 'sequencePlayList']),
  mode: state.getIn(["player", 'mode'])
})
const mapDispatchToProps = dispatch => {
  return {
    togglePlayListDispatch (data) {
      dispatch(changeShowPlayList(data))
    },
    // 切换当前选中的歌曲
    changeCurrentIndexDispatch (data) {
      dispatch(changeCurrentIndex(data))
    },
    // 修改当前的播放模式
    changeModeDispatch (data) {
      dispatch(changePlayMode(data))
    },
    // 修改当前的歌曲列表
    changePlayListDispatch (data) {
      dispatch(changePlayList(data))
    },
    // 删除选中的歌曲
    deleteSongDispatch(data) {
      dispatch(deleteSong(data))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(PlayList))