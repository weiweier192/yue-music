import { CHANGE_CURRENT_ALBUM, CHANGE_ENTER_LOADING } from './actionTypes.js'
import { getAlbumDetailRequest } from '../../../api/request.js'
import { fromJS } from 'immutable'

const changeCurrentAlbum = data => ({
  type: CHANGE_CURRENT_ALBUM,
  data: fromJS(data)
})

export const changeEnterLoading = data => ({
  type: CHANGE_ENTER_LOADING,
  data
})

export const getAlbumList = id => {
  return dispatch => {
    getAlbumDetailRequest(id).then(res => {
      let data = res.playlist
      dispatch(changeCurrentAlbum(data))
      dispatch(changeEnterLoading(false))
    }).catch(err => {
      console.log('getAlbumList', err)
    })
  }
}