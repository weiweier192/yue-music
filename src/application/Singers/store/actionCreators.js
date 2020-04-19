import { getHotSingerListRequest, getSingerListRequest } from '../../../api/request.js'
import {
  CHANGE_SINGER_LIST,
  CHANGE_PAGE_COUNT,
  IS_LOADING,
  CHANGE_PULLUP_LOADING,
  CHANGE_PULLDOWN_LOADING,
  CHANGE_ALPHA,
  CHANGE_CATEGORY
} from './actionTypes.js'

import {fromJS} from 'immutable'

const changeSingerList = data => ({
  type: CHANGE_SINGER_LIST,
  data: fromJS(data)
})

export const changePageCount = data => ({
  type: CHANGE_PAGE_COUNT,
  data
})

export const changeIsLoading = data => ({
  type: IS_LOADING,
  data
})

export const changePullUpLoading = data => ({
  type: CHANGE_PULLUP_LOADING,
  data
})

export const changePullDownLoading = data => ({
  type: CHANGE_PULLDOWN_LOADING,
  data
})

// 第一次加载热门歌手
export const getHotSingerList = () => {
  return (dispatch) => {
    getHotSingerListRequest(0).then(res => {
      const data = res.artists
      dispatch(changeSingerList(data))
      dispatch(changePullDownLoading(false))
      dispatch(changeIsLoading(false))
    }).catch((err) => {
      console.log('getHotSingerList', err)
    })
  }
}
// 加载更多热门歌手
export const refreshMoreHotSingerList = () => {
  return (dispatch, getState) => {
    const pageCount = getState().getIn(['singers', 'pageCount'])
    const singerList = getState().getIn(['singers', 'singerList']).toJS()
    getHotSingerListRequest(pageCount).then(res => {
      const data = [...singerList, ...res.artists]
      dispatch(changeSingerList(data))
      dispatch(changePullUpLoading(false))
    }).catch(err => {
      console.log('refreshMoreHotSingerList', err)
    })
  }
}

// 第一次加载对应类别的歌手
export const getSingerList = (category, alpha) => {
  return (dispatch, getState) => {
    getSingerListRequest(category, alpha, 0).then(res => {
      const data = res.artists
      dispatch(changeSingerList(data))
      dispatch(changeIsLoading(false))
      dispatch(changePullDownLoading(false))
    }).catch(err => {
      console.log('getSingerList', err)
    })
  }
}
// 加载更多歌手
export const refreshMoreSingerList = (category, alpha) => {
  return (dispatch, getState) => {
    const pageCount = getState().getIn(['singers', 'pageCount'])
    const singerList = getState().getIn(['singers', 'singerList']).toJS()
    getSingerListRequest(category, alpha, pageCount).then(res => {
      const data = [...singerList, ...res.artists]
      dispatch(changeSingerList(data))
      dispatch(CHANGE_PULLDOWN_LOADING(false))
    }).catch(err => {
      console.log('refreshMoreSingerList', err)
    })

  }
}