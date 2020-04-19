import { combineReducers } from 'redux-immutable'
import { reducer as recommendReducer } from '../application/Recommend/store/index.js'

// 首先，需要将Singers下的reducer注册到全局store，
// 在src目录下的store/reducer.js中
import { reducer as singersReducer } from '../application/Singers/store/index.js'

export default combineReducers({
  recommend: recommendReducer,
  singers: singersReducer
})