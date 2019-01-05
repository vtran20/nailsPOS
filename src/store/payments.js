import C from '../constants'
import { combineReducers } from 'redux'
import produce from "immer"

export const byId = (state = {}, action) => {
  switch (action.type) {
    case C.CUSTOMER_CHECKOUT_ADD:
      return produce(state, draft => {
        draft[action.payload.customerId]= action.payload
        return draft
      })
    case C.CUSTOMER_CHECKOUT_UPDATE:
      return produce(state, draft => {  
        draft[action.payload.customerId]= action.payload
        return draft
      })
    case C.CUSTOMER_CHECKOUT_REMOVE:
      return produce(state, draft => {
        delete draft[action.payload] 
        return draft
      })
    default:
      return state
  }
}

export const currentCheckout = (state = {}, action) => {
  switch (action.type) {
    case C.CURRENT_CHECKOUT_UPDATE:
      return produce(state, draft => {       
        draft = {...action.payload}
        return draft
      })
    case C.CURRENT_CHECKOUT_CLEAR:
      return {}
    default:
      return state
  }
}

export default combineReducers({
    byId,
    currentCheckout
})
