import React from 'react'
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

function Player (props) {
  return (
    <div>Player</div>
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