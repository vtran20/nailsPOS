import C from '../constants'
import { combineReducers } from 'redux'

export const byId = (state = {}, action) => {
  let existing
  switch (action.type) {
    case C.SERVICE_ADD:
      existing = state[action.payload.id] ? true : false
      if (existing) {
        return state
      } else {
        return {
          ...state,
          [action.payload.id]: action.payload
        }
      }
    case C.SERVICE_UPDATE:
      existing = state[action.payload.id] ? true : false
      if (!existing) {
        return state
      } else {
        return {
          ...state,
          [action.payload.id]: {...state[action.payload.id]},
          [action.payload.id]: action.payload
        }
      }
    case C.SERVICE_REMOVE:
      return Object.keys(state).reduce(
        (result, key) =>
          key === action.payload ? result : { ...result, [key]: state[key] },
        {}
      )

    default:
      return state
  }
}

export const allIds = (state = [], action) => {
  let existing
  switch (action.type) {
    case C.SERVICE_ADD:
      existing = state.find(x => x === action.payload.id)
      if (existing) {
        return state
      } else {
        return [...state, action.payload.id]
      }
    case C.SERVICE_REMOVE:
      return state.filter(id => id !== action.payload)

    default:
      return state
  }
}

export const fetching = (state = false, action) => {
  switch (action.type) {
    case C.SERVICE_FETCHING:
      return action.payload
    case C.SERVICE_ADD:
      return false
    case C.SERVICE_UPDATE:
      return false
    case C.SERVICE_REMOVE:
      return false
    case C.SERVICE_ERROR_ADD:
      return false
    default:
      return state
  }
}
export const errors = (state = [], action) => {
  switch (action.type) {
    case C.SERVICE_ERROR_ADD:
      return [...state, action.payload]
    case C.SERVICE_ERROR_REMOVE:
      return state.filter((message, i) => i !== action.payload)
    case C.SERVICE_ERROR_CLEAR:
      return []
    default:
      return state
  }
}

export default combineReducers({
  byId,
  allIds,
  fetching,
  errors
})
