import C from '../constants'
import { combineReducers } from 'redux'

export const customerForm = (state = null, action) => {
  switch (action.type) {
    case C.FORM_CUSTOMER_ADD:
      return action.payload
    case C.FORM_CUSTOMER_UPDATE:
      return Object.assign({}, state, action.payload)
    case C.FORM_CUSTOMER_SERVICE_ADD:
      // const keys = Object.keys(action.payload)
      //action.payload : {1: true, 2:false}
      const values = action.payload
        ? Object.keys(action.payload).filter(key => action.payload[key])
        : []
      return { ...state, services: values }
    case C.FORM_CUSTOMER_CLEAR:
      return null
    case C.FORM_ALL_CLEAR:
      return null
    default:
      return state
  }
}

export const fetching = (state = false, action) => {
  switch (action.type) {
    case C.FORM_FETCHING:
      return false

    case C.FORM_CUSTOMER_ADD:
      return false
    case C.FORM_CUSTOMER_UPDATE:
      return false
    case C.FORM_CUSTOMER_CLEAR:
      return false

    case C.FORM_CUSTOMER_SERVICE_ADD:
      return false

    case C.FORM_ERROR_ADD:
      return false
    case C.FORM_ALL_CLEAR:
      return false
    default:
      return state
  }
}
export const errors = (state = [], action) => {
  switch (action.type) {
    case C.FORM_ERROR_ADD:
      return [...state, action.payload]
    case C.FORM_ERROR_REMOVE:
      return state.filter((message, i) => i !== action.payload)
    case C.FORM_ERROR_CLEAR:
      return []
    default:
      return state
  }
}
export default combineReducers({
  customerForm,
  fetching,
  errors
})

// customerForm : {
// id: 1,
// customerServices:[2,4,5]  ,
// services:[3,5,6]
// }
