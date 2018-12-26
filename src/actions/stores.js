import C from '../constants'
import fetch from 'isomorphic-fetch'

export const addStore = store => {
  return {
    type: C.STORE_ADD,
    payload: store
  }
}

export const updateStore = store => {
  return {
    type: C.STORE_UPDATE,
    payload: store
  }
}

export const removeStore = storeId => {
  return {
    type: C.STORE_REMOVE,
    payload: storeId
  }
}

export const addStoreError = error => {
  return {
    type: C.STORE_ERROR_ADD,
    payload: error
  }
}

export const removeStoreError = index => {
  return {
    type: C.STORE_ERROR_REMOVE,
    payload: index
  }
}

export const clearStoreError = () => {
  return {
    type: C.STORE_ERROR_CLEAR
  }
}

export const fetchStoreBegin = () => {
  return {
    type: C.STORE_FETCHING,
    payload: true
  }
}

export const fetchStoreError = error => {
  return {
    type: C.STORE_ERROR_ADD,
    payload: error
  }
}

export const selectStoreId = id => {
  return {
    type: C.STORE_SELECTING,
    payload: id
  }
}
