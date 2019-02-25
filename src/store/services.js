import C from '../constants'
import { combineReducers } from 'redux'
import produce from "immer"

export const byId = (state = {}, action) => {
  let existing
  switch (action.type) {
    case C.SERVICE_ADD:
      return produce(state, draft => {
        draft[action.payload.id]= action.payload
        return draft
      })
    case C.SERVICE_UPDATE:
      return produce(state, draft => {
        draft[action.payload.id]= action.payload
        return draft
      })
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

export const groupById = (state = {}, action) => {
  let existing
  switch (action.type) {
    case C.SERVICE_GROUP_ADD:
      return produce(state, draft => {
        draft[action.payload.id]= action.payload
        return draft
      })
    case C.SERVICE_GROUP_UPDATE:
      return produce(state, draft => {
        draft[action.payload.id]= action.payload
        return draft
      })
    case C.SERVICE_GROUP_REMOVE:
      return Object.keys(state).reduce(
        (result, key) =>
          key === action.payload ? result : { ...result, [key]: state[key] },
        {}
      )
    case C.SERVICE_ADD:
      const havingGroupId = action.payload.groupId ? true : false
      if (!havingGroupId) {
        return state
      } else {
        existing = state[action.payload.groupId] ? true : false
        if (existing) {
          return {
            ...state,
            [action.payload.groupId]: {
              ...state[action.payload.groupId],
              services: state[action.payload.groupId]
                .services
                ? [
                    ...state[action.payload.groupId].services,
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
    case C.SERVICE_GROUP_CHANGE:
      const havingOldGroupId = action.payload.oldGroupId ? true : false
      if (!havingOldGroupId) {
        return state
      } else {
        existing = state[action.payload.groupId] ? true : false
        const oldExisting = state[action.payload.oldGroupId] ? true : false
        if (existing && oldExisting) {
          return produce(state, draft => {
            //remove service id in the old group
            draft[action.payload.oldGroupId].services = state[action.payload.oldGroupId].services? state[action.payload.oldGroupId].services.filter(id => id !== action.payload.id) : []
            //add service id in the current group
            let services;
            if (state[action.payload.groupId].services) {
              if (state[action.payload.groupId].services.find(x => x === action.payload.id)) {
                services = state[action.payload.groupId].services
              } else {
                services = [...state[action.payload.groupId].services, action.payload.id]
              }
            } else {
              services = [action.payload.id]
            }
            draft[action.payload.groupId].services = services
            return draft
          })
        }
      }
    case C.SERVICE_REMOVE:
      return produce(state, draft => {
        Object.keys(state).map(groupId => {
          //remove service id in the current group
          draft[groupId].services = state[groupId].services? state[groupId].services.filter(id => id !== action.payload) : []
      })
        return draft
      })
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

export const groupAllIds = (state = [], action) => {
  let existing
  switch (action.type) {
    case C.SERVICE_GROUP_ADD:
      existing = state.find(x => x === action.payload.id)
      if (existing) {
        return state
      } else {
        return [...state, action.payload.id]
      }
    case C.SERVICE_GROUP_REMOVE:
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
    case C.SERVICE_GROUP_ADD:
      return false
    case C.SERVICE_UPDATE:
    case C.SERVICE_GROUP_UPDATE:
      return false
    case C.SERVICE_REMOVE:
    case C.SERVICE_GROUP_REMOVE:
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

export const edit = (state = {}, action) => {
  switch (action.type) {
    case C.SERVICE_EDIT:
    case C.SERVICE_GROUP_EDIT:
      return produce(state, draft => {       
        draft = {...action.payload}
        return draft
      })
    case C.SERVICE_EDIT_CLEAR:
      return {}
    default:
      return state
  }
}

export default combineReducers({
  byId,
  allIds,
  groupById,
  groupAllIds,
  fetching,
  errors,
  edit  
})
