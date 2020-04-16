import { combineReducers } from 'redux-immutable'
import {reducer as recommendReducer} from '../application/Recommend/store/index.js'

export default combineReducers({
  recommend: recommendReducer
})