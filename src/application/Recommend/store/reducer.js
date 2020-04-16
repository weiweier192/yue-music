// 初始化state
import * as actionTypes from './actionTypes.js'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  bannerList: [],
  recommendList: [],
  isLoading: true
})
// 处理事件
export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_BANNER:
      return state.set('bannerList', action.data)
    case actionTypes.CHANGE_RECOMMEND_LIST:
      return state.set('recommendList', action.data)
    case actionTypes.IS_LOADING:
      return state.set('isLoading', action.data)
    default:
      return state
  }
}