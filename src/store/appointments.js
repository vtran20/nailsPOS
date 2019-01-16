import C from '../constants'
import { combineReducers } from 'redux'
import produce from "immer"

export const byId = (state = {}, action) => {
  switch (action.type) {
    case C.CUSTOMER_APPOINTMENT_ADD:
      return produce(state, draft => {
        draft[action.payload.id]= action.payload
        return draft
      })
    case C.CUSTOMER_APPOINTMENT_UPDATE:
      return produce(state, draft => {  
        draft[action.payload.id]= action.payload
        return draft
      })
    case C.CUSTOMER_APPOINTMENT_REMOVE:
      return produce(state, draft => {
        delete draft[action.payload] 
        return draft
      })
    default:
      return state
  }
}

export const allIds = (state = [], action) => {
  let existing
  switch (action.type) {
    case C.CUSTOMER_APPOINTMENT_ADD:
      existing = state.find(x => x === action.payload.id)
      if (existing) {
        return state
      } else {
        return [...state, action.payload.id]
      }
    case C.CUSTOMER_APPOINTMENT_REMOVE:
      return state.filter(id => id !== action.payload)

    default:
      return state
  }
}

export const fetching = (state = false, action) => {
  switch (action.type) {
    case C.CUSTOMER_APPOINTMENT_FETCHING:
      return action.payload
    default:
      return state
  }
}

export default combineReducers({
    byId,
    allIds,
    fetching
})
