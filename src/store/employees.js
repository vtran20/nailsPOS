import C from '../constants'
import { combineReducers } from 'redux'

export const byId = (state = {}, action) => {
  let existing
  switch (action.type) {
    case C.EMPLOYEE_ADD:
      existing = state[action.payload.id] ? true : false
      if (existing) {
        return state
      } else {
        return {
          ...state,
          [action.payload.id]: action.payload
        }
      }
    case C.EMPLOYEE_UPDATE:
      existing = state[action.payload.id] ? true : false
      if (!existing) {
        return state
      } else {
        return {
          ...state,
          [action.payload.id]: {...state[action.payload.id]},
          [action.payload.id]: {...action.payload, employeeServices: state[action.payload.id].employeeServices}
        }
      }
    case C.EMPLOYEE_REMOVE:
      return Object.keys(state).reduce(
        (result, key) =>
          key === action.payload ? result : { ...result, [key]: state[key] },
        {}
      )

    case C.EMPLOYEE_SERVICE_ADD:
      const havingEmployeeId = action.payload.employeeId ? true : false
      if (!havingEmployeeId) {
        return state
      } else {
        existing = state[action.payload.employeeId] ? true : false
        if (existing) {
          return {
            ...state,
            [action.payload.employeeId]: {
              ...state[action.payload.employeeId],
              employeeServices: state[action.payload.employeeId]
                .employeeServices
                ? [
                    ...state[action.payload.employeeId].employeeServices,
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
    case C.EMPLOYEE_SERVICE_REMOVE:
      const employee = action.payload.employeeId
        ? state[action.payload.employeeId]
        : null
      if (employee) {
        return employee.employeeServices
          ? {
              ...state,
              [action.payload.employeeId]: {
                ...state[action.payload.employeeId],
                employeeServices: state[action.payload.employeeId]
                  .employeeServices
                  ? [
                      ...state[
                        action.payload.employeeId
                      ].employeeServices.filter(id => id !== action.payload.id)
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
    case C.EMPLOYEE_ADD:
      existing = state.find(x => x === action.payload.id)
      if (existing) {
        return state
      } else {
        return [...state, action.payload.id]
      }
    case C.EMPLOYEE_REMOVE:
      return state.filter(id => id !== action.payload)

    default:
      return state
  }
}

export const fetching = (state = false, action) => {
  switch (action.type) {
    case C.EMPLOYEE_FETCHING:
      return action.payload
    case C.EMPLOYEE_ADD:
      return false
    case C.EMPLOYEE_UPDATE:
      return false
    case C.EMPLOYEE_REMOVE:
      return false
    case C.EMPLOYEE_ERROR_ADD:
      return false
    default:
      return state
  }
}
export const errors = (state = [], action) => {
  switch (action.type) {
    case C.EMPLOYEE_ERROR_ADD:
      return [...state, action.payload]
    case C.EMPLOYEE_ERROR_REMOVE:
      return state.filter((message, i) => i !== action.payload)
    case C.EMPLOYEE_ERROR_CLEAR:
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
