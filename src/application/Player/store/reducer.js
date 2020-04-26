import * as actionTypes from './actionTypes.js'
import { fromJS } from 'immutable'
import { playMode } from '../../../api/config.js'
import { findIndex } from '../../../api/utils.js'

const defaultState = fromJS({
  fullScreen: false, // 播放器是否全屏
  playing: false, // 当前歌曲是否播放
  sequencePlayList: [], // 顺序列表
  playList: [],
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前歌曲在播放列表的索引
  showPlayList: false, // 是否展示播放列表
  currentSong: {}
})

const handleDeleteSong = (state, song) => {
  // 深拷贝
  const playList = JSON.parse(JSON.stringify(state.get('playList').toJS()))
  const sequencePlayList = JSON.parse(JSON.stringify(state.get('sequencePlayList').toJS()))
  let currentIndex = state.get("currentIndex")
  // 找对应歌曲在播放列表中的索引
  const fpIndex = findIndex(song, playList)
  // 在播放列表中将其删除
  playList.splice(fpIndex, 1)
  // 如果删除的歌曲在当前播放歌曲前面，那currentIndex--，让单前歌曲正常播放
  if (fpIndex < currentIndex) currentIndex--
  // 在sequenceList中直接删除歌曲即可
  const fsIndex = findIndex(song, sequencePlayList)
  sequencePlayList.splice(fsIndex, 1)
  return state.merge({
    "playList": fromJS(playList),
    'sequencePlayList': fromJS(sequencePlayList),
    'currentIndex': fromJS(currentIndex)
  })
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_SONG:
      return state.set('currentSong', action.data)
    case actionTypes.SET_FULL_SCREEN:
      return state.set('fullScreen', action.data)
    case actionTypes.SET_PLAYING_STATE:
      return state.set('playing', action.data)
    case actionTypes.SET_SEQUENCE_PLAYLIST:
      return state.set('sequencePlayList', action.data)
    case actionTypes.SET_PLAYLIST:
      return state.set('playList', action.data)
    case actionTypes.SET_PLAY_MODE:
      return state.set('mode', action.data)
    case actionTypes.SET_CURRENT_INDEX:
      return state.set('currentIndex', action.data)
    case actionTypes.SET_SHOW_PLAYLIST:
      return state.set('showPlayList', action.data)
    case actionTypes.DELETE_SONG:
      return handleDeleteSong(state, action.data)
    default:
      return state
  }
}