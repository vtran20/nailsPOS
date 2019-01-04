// https://medium.freecodecamp.org/optimising-the-state-shape-of-your-react-app-with-redux-3a280e6ef436

import C from '../constants'
import customers from './customers'
import services from './services'
import employees from './employees'
import customerServices from './customerServices'
import employeeServices from './employeeServices'
import stores from './stores'
import forms from './forms'
import customerSearch from './customerSearch'
import payments from './payments'
import produce from "immer"

import { combineReducers } from 'redux'

export const posScreen = (state = null, action) => {
  switch (action.type) {
    case C.POS_SCREEN_ADD:
      return action.payload
    case C.POS_SCREEN_UPDATE:
      return { ...state, ...action.payload }
    case C.POS_SCREEN_REMOVE:
      return produce(state, draft => {
        delete draft[action.payload] 
       })
    case C.POS_SCREEN_CLEAR:
      return null
    default:
      return state
  }
}

// export const storeInfo = (state = null, action) => {
//   switch (action.type) {
//     case C.ADD_STORE:
//       return action.payload
//     case C.UPDATE_STORE:
//       return Object.assign({}, state, action.payload)
//     default:
//       return state
//   }
// }

export const fetching = (state = false, action) => {
  switch (action.type) {
    case C.GLOBAL_FETCHING:
      return action.payload
    case C.GLOBAL_ERROR_ADD:
      return false
    default:
      return state
  }
}

export const errors = (state = [], action) => {
  switch (action.type) {
    case C.GLOBAL_ERROR_ADD:
      return [...state, action.payload]
    case C.GLOBAL_ERROR_REMOVE:
      return state.filter((message, i) => i !== action.payload)
    case C.GLOBAL_ERROR_CLEAR:
      return []
    default:
      return state
  }
}

export const messages = (state = [], action) => {
  switch (action.type) {
    case C.GLOBAL_MESSAGE_ADD:
      return [...state, action.payload]
    case C.GLOBAL_MESSAGE_REMOVE:
      return state.filter((message, i) => i !== action.payload)
    case C.GLOBAL_MESSAGE_CLEAR:
      return []
    default:
      return state
  }
}

//https://stackoverflow.com/questions/35622588/how-to-reset-the-state-of-a-redux-store
const reducer = combineReducers({
  stores,
  customers,
  customerServices,
  employees,
  services,
  employeeServices,
  fetching,
  errors,
  messages,
  customerSearch,
  forms,
  posScreen,
  payments
})

export const appReducer = (state, action) => {
  if (action.type === 'RESET_DATA') {
    state = undefined
  }

  return reducer(state, action)
}
