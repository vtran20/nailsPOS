import fetch from 'isomorphic-fetch'
import { addCustomer } from './customers'
import { addService } from './services'
import { addEmployee } from './employees'
import { addCustomerService } from './customerServices'
import { addEmployeeService } from './employeeServices'
import { addStore, selectStoreId } from './stores'
import { handleErrors, urlAPI } from '../utils'
import Cookies from 'universal-cookie'
import C from '../constants'

const cookies = new Cookies()
export const initialData = storeId => (dispatch, getState) => {
  dispatch(resetGlobalData())
  dispatch(fetchGlobalBegin())
  fetch(urlAPI + '/initialData.json?storeId=' + storeId, {
    credentials: 'same-origin'
  })
    .then(handleErrors)
    .then(response => response.json())
    .then(result => {
      if (result.stores) result.stores.map(store => dispatch(addStore(store)))
      if (result.services)
        result.services.map(service => dispatch(addService(service)))
      if (result.customers)
        result.customers.map(customer => dispatch(addCustomer(customer)))
      if (result.employees)
        result.employees.map(employee => dispatch(addEmployee(employee)))
      if (result.customerServices)
        result.customerServices.map(customerSrevice =>
          dispatch(addCustomerService(customerSrevice))
        )
      if (result.employeeServices)
        result.employeeServices.map(employeeSrevice =>
          dispatch(addEmployeeService(employeeSrevice))
        )
      dispatch(fetchGlobalComplete())
      //select store
      if (storeId) {
        dispatch(selectStoreId(storeId))
        const expiryDate = new Date(Date.now() + 31556952000)
        cookies.set('STORE_ID_COOKIE', storeId, {
          expires: expiryDate
        })
      } else {
        if (getState().stores.allIds && getState().stores.allIds.length === 1) {
          const defaultStoreId = getState().stores.allIds[0]
          dispatch(selectStoreId(defaultStoreId))
          const expiryDate = new Date(Date.now() + 31556952000)
          cookies.set('STORE_ID_COOKIE', defaultStoreId, {
            expires: expiryDate
          })
        }
      }
    })
    .catch(error => dispatch(fetchGlobalError(error)))
}

export const addGlobalError = message => {
  return {
    type: C.GLOBAL_ERROR_ADD,
    payload: message
  }
}

export const removeGlobalError = index => {
  return {
    type: C.GLOBAL_ERROR_REMOVE,
    payload: index
  }
}
export const clearGlobalError = () => {
  return {
    type: C.GLOBAL_ERROR_CLEAR
  }
}

export const fetchGlobalBegin = () => {
  return {
    type: C.GLOBAL_FETCHING,
    payload: true
  }
}

export const fetchGlobalComplete = () => {
  return {
    type: C.GLOBAL_FETCHING,
    payload: false
  }
}

export const fetchGlobalError = error => {
  return {
    type: C.GLOBAL_ERROR_ADD,
    payload: error
  }
}

export const resetGlobalData = () => {
  return {
    type: C.RESET_DATA
  }
}

export const changePOSScreen = data => {
  return {
    type: C.POS_SCREEN_ADD,
    payload: data
  }
}
export const updatePOSScreen = data => {
  return {
    type: C.POS_SCREEN_UPDATE,
    payload: data
  }
}

export const resetPOSScreen = () => {
  return {
    type: C.POS_SCREEN_CLEAR
  }
}

export const selectStore = storeId => {
  return {
    type: C.CURRENT_STORE,
    payload: storeId
  }
}

export const selectCustomer = data => (dispatch) => {
  dispatch(resetPOSScreen())
  dispatch(changePOSScreen(data))
}

export const selectAddCustomer = data => (dispatch) => {
  dispatch(resetPOSScreen())
  dispatch(changePOSScreen(data))
}
