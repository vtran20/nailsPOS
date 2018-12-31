import C from '../constants'
import { combineReducers } from 'redux'
import produce from "immer"

export const byId = (state = {}, action) => 
  produce(state, draft => {
  let existing
  switch (action.type) {
    case C.EMPLOYEE_SERVICE_ADD:
      // existing = draft[action.payload.id] ? true : false
      // if (existing) {
      //   return draft
      // } else {
      //   return {
      //     ...draft,
      //     [action.payload.id]: action.payload
      //   }
      // }
    case C.EMPLOYEE_SERVICE_UPDATE:
      // existing = draft[action.payload.id] ? true : false
        draft[action.payload.id]= action.payload
      // }
    case C.EMPLOYEE_SERVICE_REMOVE:
        delete draft[action.payload] 
    default:
      // return draft
  }
})

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
