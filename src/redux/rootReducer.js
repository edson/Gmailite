import { combineReducers } from 'redux'
import { routeReducer as router } from 'react-router-redux'
import gmail from './modules/gmail'

export default combineReducers({
  gmail,
  router
})
