import C from '../constants'
import { combineReducers } from 'redux'

export const fetching = (state = false, action) => {
  switch (action.type) {
    case C.CUSTOMER_SEARCH_FETCHING:
      return action.payload
    case C.CUSTOMER_SEARCH_CHANGING:
      return false

    default:
      return state
  }
}

export const customerResults = (state = [], action) => {
  switch (action.type) {
    case C.CUSTOMER_SEARCH_CLEAR:
      return []
    case C.CUSTOMER_SEARCH_CHANGING:
      return action.payload
    default:
      return state
  }
}

export const notFound = (state = false, action) => {
  switch (action.type) {
    case C.CUSTOMER_SEARCH_CLEAR:
      return false
    case C.CUSTOMER_SEARCH_CHANGING:
      if (action.payload && action.payload.length > 0) {
        return false
      } else {
        return true
      }

    default:
      return state
  }
}

export default combineReducers({
  fetching,
  notFound,
  customerResults
})
