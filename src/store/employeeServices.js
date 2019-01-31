import C from '../constants'
import { combineReducers } from 'redux'
import produce from "immer"

export const byId = (state = {}, action) => {
  switch (action.type) {
    case C.EMPLOYEE_SERVICE_ADD:
      if (!state[action.payload.id]) {
        return produce(state, draft => {
          draft[action.payload.id]= action.payload
          return draft
        })
      } else {
        return state
      }
    case C.EMPLOYEE_SERVICE_UPDATE:
      return produce(state, draft => {
        draft[action.payload.id] = {...action.payload}
      })
    case C.EMPLOYEE_SERVICE_REMOVE:
      return produce(state, draft => {
        delete draft[action.payload.id] 
      })
    default:
      return state
  }
}

export const allIds = (state = [], action) => {
  let existing
  switch (action.type) {
    case C.EMPLOYEE_SERVICE_ADD:
      existing = state.find(x => x === action.payload.id)
      if (existing) {
        return state
      } else {
        return [...state, action.payload.id]
      }
    case C.EMPLOYEE_SERVICE_REMOVE:
      return state.filter(id => id !== action.payload)
    default:
      return state
  }
}

export const fetching = (state = false, action) => {
  switch (action.type) {
    case C.EMPLOYEE_SERVICE_FETCHING:
      return action.payload
    case C.EMPLOYEE_SERVICE_ADD:
      return false
    case C.EMPLOYEE_SERVICE_UPDATE:
      return false
    case C.EMPLOYEE_SERVICE_REMOVE:
      return false
    case C.EMPLOYEE_SERVICE_ERROR_ADD:
      return false
    default:
      return state
  }
}
export const errors = (state = [], action) => {
  switch (action.type) {
    case C.EMPLOYEE_SERVICE_ERROR_ADD:
      return [...state, action.payload]
    case C.EMPLOYEE_SERVICE_ERROR_REMOVE:
      return state.filter((message, i) => i !== action.payload)
    case C.EMPLOYEE_SERVICE_ERROR_CLEAR:
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
