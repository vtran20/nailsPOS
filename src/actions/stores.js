import C from '../constants'

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

export const fetchStoreBegin = () => {
  return {
    type: C.STORE_FETCHING,
    payload: true
  }
}

export const selectStoreId = id => {
  return {
    type: C.STORE_SELECTING,
    payload: id
  }
}
