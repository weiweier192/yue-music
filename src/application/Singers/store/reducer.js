import { fromJS } from 'immutable'
import * as actionTypes from './actionTypes'
// 1. 声明初始化state
const defaultState = fromJS({
  singerList: [],
  isLoading: true,
  pullUploading: false,
  pullDownLoading: false,
  pageCount: 0
})

// 3. 定义reducer函数
// 由于存放的是immutable数据结构，
// 所以必须用set方法来设置新状态，同时取状态用get方法
export default(state=defaultState, action) => {
  switch(action.type) {
    case actionTypes.CHANGE_SINGER_LIST:
      return state.set('singerList', action.data)
    case actionTypes.CHANGE_PAGE_COUNT:
      return state.set('pageCount', action.data)
    case actionTypes.IS_LOADING:
      return state.set('isLoading', action.data)
    case actionTypes.CHANGE_PULLDOWN_LOADING:
      return state.set('pullDownLoading', action.data)
    case actionTypes.CHANGE_PULLUP_LOADING:
      return state.set('pullUpLoading', action.data)
    default:
      return state
  }
}