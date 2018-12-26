import C from '../constants'
import { combineReducers } from 'redux'

export const byId = (state = {}, action) => {
  let existing
  switch (action.type) {
    case C.CUSTOMER_ADD:
      existing = state[action.payload.id] ? true : false
      if (existing) {
        return state
      } else {
        return {
          ...state,
          [action.payload.id]: action.payload
        }
      }
    case C.CUSTOMER_UPDATE:
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
    case C.CUSTOMER_REMOVE:
      return Object.keys(state).reduce(
        (result, key) =>
          key === action.payload ? result : { ...result, [key]: state[key] },
        {}
      )

    case C.CUSTOMER_SERVICE_ADD:
      const havingCustomerId = action.payload.customerId ? true : false
      if (!havingCustomerId) {
        return state
      } else {
        existing = state[action.payload.customerId] ? true : false
        if (existing) {
          return {
            ...state,
            [action.payload.customerId]: {
              ...state[action.payload.customerId],
              customerServices: state[action.payload.customerId]
                .customerServices
                ? [
                    ...state[action.payload.customerId].customerServices,
                    action.payload.id
                  ]
                : [action.payload.id]
            }
          }
        } else {
          //TODO: checking if this situation really happen
          return state
        }
      }
    case C.CUSTOMER_SERVICE_REMOVE:
      const customer = action.payload.customerId
        ? state[action.payload.customerId]
        : null
      if (customer) {
        return customer.customerServices
          ? {
              ...state,
              [action.payload.customerId]: {
                ...state[action.payload.customerId],
                customerServices: state[action.payload.customerId]
                  .customerServices
                  ? [
                      ...state[
                        action.payload.customerId
                      ].customerServices.filter(id => id !== action.payload.id)
                    ]
                  : []
              }
            }
          : state
      } else {
        return state
      }

    default:
      return state
  }
}

export const allIds = (state = [], action) => {
  let existing
  switch (action.type) {
    case C.CUSTOMER_ADD:
      existing = state.find(x => x === action.payload.id)
      if (existing) {
        return state
      } else {
        return [...state, action.payload.id]
      }
    case C.CUSTOMER_REMOVE:
      return state.filter(id => id !== action.payload)

    default:
      return state
  }
}

export const fetching = (state = false, action) => {
  switch (action.type) {
    case C.CUSTOMER_FETCHING:
      return action.payload
    case C.CUSTOMER_ADD:
      return false
    case C.CUSTOMER_UPDATE:
      return false
    case C.CUSTOMER_REMOVE:
      return false
    case C.CUSTOMER_ERROR_ADD:
      return false
    default:
      return state
  }
}
export const errors = (state = [], action) => {
  switch (action.type) {
    case C.CUSTOMER_ERROR_ADD:
      return [...state, action.payload]
    case C.CUSTOMER_ERROR_REMOVE:
      return state.filter((message, i) => i !== action.payload)
    case C.CUSTOMER_ERROR_CLEAR:
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
