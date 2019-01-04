import C from '../constants'
import { combineReducers } from 'redux'
import produce from "immer"

export const byId = (state = {}, action) => 
  produce(state, draft => {
    let existing
    switch (action.type) {
      case C.CUSTOMER_CHECKOUT_ADD:
        // existing = draft[action.payload.customerId] ? true : false
        // if (existing) {
        //   return draft
        // } else {
        //   return {
        //     ...draft,
        //     [action.payload.customerId]: action.payload
        //   }
        // }
      case C.CUSTOMER_CHECKOUT_UPDATE:
        draft[action.payload.customerId]= action.payload
        // existing = draft[action.payload.customerId] ? true : false
        // if (!existing) {
        //   return draft
        // } else {
        //   return {
        //     ...draft,
        //     [action.payload.customerId]: action.payload
        //   }
        // }      
      case C.CUSTOMER_CHECKOUT_REMOVE:
        delete draft[action.payload] 
      default:
        return draft
    }
})

export const currentCheckout = (state = {}, action) => 
  produce(state, draft => {
  switch (action.type) {
    case C.CURRENT_CHECKOUT_UPDATE:
      Object.assign(draft, action.payload)
      return  draft
    case C.CURRENT_CHECKOUT_CLEAR:
      return {}
    default:
      return draft
  }
})

export const totalPrice = (state = 0, action) => {
  switch (action.type) {
    case C.TOTAL_PRICE:
      return action.payload
    case C.CHECKOUT_CLEAR:
      return 0
    default:
      return state
  }
}

export const tax = (state = 0, action) => {
  switch (action.type) {
    case C.TAX_PRICE:
      return action.payload
    case C.CHECKOUT_CLEAR:
      return 0
    default:
      return state
  }
}

export const tip = (state = 0, action) => {
  switch (action.type) {
    case C.TIP_PRICE:
      return action.payload
    case C.CHECKOUT_CLEAR:
      return 0
    default:
      return state
  }
}

export const credit = (state = false, action) => {
  switch (action.type) {
    case C.CREDIT_PAYMENT:
      return action.payload
    default:
      return state
  }
}

export const cash = (state = false, action) => {
  switch (action.type) {
    case C.CASH_PAYMENT:
      return action.payload
    default:
      return state
  }
}

export const check = (state = false, action) => {
  switch (action.type) {
    case C.CHECK_PAYMENT:
      return action.payload
    default:
      return state
  }
}

export const giftcard = (state = false, action) => {
  switch (action.type) {
    case C.GIFTCARD_PAYMENT:
      return action.payload
    default:
      return state
  }
}

export default combineReducers({
    byId,
    currentCheckout
    //  : combineReducers({
    //   totalPrice,
    //   tax,
    //   tip,
    //   credit,
    //   cash,
    //   check,
    //   giftcard
    // })
})

// baseState = {}
// expect(baseState.length).toBe(2)
// expect(nextState.length).toBe(3)