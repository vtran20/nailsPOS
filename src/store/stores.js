import C from '../constants'
import { combineReducers } from 'redux'

export const byId = (state = {}, action) => {
  let existing
  switch (action.type) {
    case C.STORE_ADD:
      existing = state[action.payload.id] ? true : false
      if (existing) {
        return state
      } else {
        return {
          ...state,
          [action.payload.id]: action.payload
        }
      }
    case C.STORE_UPDATE:
      existing = state[action.payload.id] ? true : false
      if (!existing) {
        return state
      } else {
        return {
          ...state,
          [action.payload.id]: state[action.payload.id],
          [action.payload.id]: action.payload
        }
      }

    default:
      return state
  }
}

export const allIds = (state = [], action) => {
  let existing
  switch (action.type) {
    case C.STORE_ADD:
      existing = state.find(x => x === action.payload.id)
      if (existing) {
        return state
      } else {
        return [...state, action.payload.id]
      }
    case C.STORE_REMOVE:
      return state.filter(id => id !== action.payload)

    default:
      return state
  }
}

export const currentStoreId = (state = null, action) => {
  switch (action.type) {
    case C.STORE_SELECTING:
      return action.payload
    default:
      return state
  }
}
export const fetching = (state = false, action) => {
  switch (action.type) {
    case C.STORE_FETCHING:
      return action.payload
    case C.STORE_ADD:
      return false
    case C.STORE_UPDATE:
      return false
    case C.STORE_REMOVE:
      return false
    case C.STORE_ERROR_ADD:
      return false
    default:
      return state
  }
}
export const errors = (state = [], action) => {
  switch (action.type) {
    case C.STORE_ERROR_ADD:
      return [...state, action.payload]
    case C.STORE_ERROR_REMOVE:
      return state.filter((message, i) => i !== action.payload)
    case C.STORE_ERROR_CLEAR:
      return []
    default:
      return state
  }
}

export default combineReducers({
  byId,
  allIds,
  fetching,
  errors,
  currentStoreId
})
