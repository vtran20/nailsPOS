import fetch from 'isomorphic-fetch'
import { addCustomer } from './customers'
import { addService } from './services'
import { addEmployee } from './employees'
import { addCustomerCheckout, updateCustomerCheckout, updateCurrentCheckout, clearCurrentCheckout } from './payments'
import { addCustomerService } from './customerServices'
import { addEmployeeService } from './employeeServices'
import { addAppointment } from './appointments'
import { addStore, selectStoreId } from './stores'
import { handleErrors, handleErrorMessages, urlAPI } from '../utils'
import Cookies from 'universal-cookie'
import C from '../constants'
import { getServiceCost } from '../selectors'

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
      handleErrorMessages(result)
      if (result.stores) result.stores.map(store => dispatch(addStore(store)))
      if (result.services)
        result.services.map(service => dispatch(addService(service)))
      if (result.customers)
        result.customers.map(customer => dispatch(addCustomer(customer)))
      if (result.employees)
        result.employees.map(employee => dispatch(addEmployee(employee)))
      if (result.appointments)
        result.appointments.map(appointment => dispatch(addAppointment(appointment)))
      if (result.customerServices)
        result.customerServices.map(customerSrevice =>
          dispatch(addCustomerService(customerSrevice))
        )
      if (result.employeeServices)
        result.employeeServices.map(employeeSrevice =>
          dispatch(addEmployeeService(employeeSrevice))
        )
      if (result.payments)
        result.payments.map(payment =>
          dispatch(addCustomerCheckout(payment))
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
    .catch(error => dispatch(createErrorLog(error.message)))
}

export const createErrorLog = (rootCause) => (dispatch, getState) => {
  if (rootCause && rootCause.indexOf("http") >= 0) {
    dispatch(addGlobalError('Internal System Error. Please try again later.'))
    let inputData = {}
    inputData['rootCause'] = rootCause
    inputData['data'] = getState()

    fetch(urlAPI + '/errorLog.json?storeId=1', {
      method: 'POST',
      body: JSON.stringify(inputData),
      headers: {
        'Content-Type': 'application/json'
      }
    })    
  } else {
    dispatch(addGlobalError(rootCause))
  }
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

export const addGlobalMessage = message => {
  return {
    type: C.GLOBAL_MESSAGE_ADD,
    payload: message
  }
}

export const removeGlobalMessage = index => {
  return {
    type: C.GLOBAL_MESSAGE_REMOVE,
    payload: index
  }
}
export const clearGlobalMessage = () => {
  return {
    type: C.GLOBAL_MESSAGE_CLEAR
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

export const removePOSDialog = data => {
  return {
    type: C.POS_SCREEN_REMOVE,
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

export const selectCustomer = data => (dispatch, getState) => {
  dispatch(resetPOSScreen())
  dispatch(changePOSScreen(data))
  //update currentCheckout
  const currentCheckout = getState().payments.currentCheckout
  const newCheckout = getState().payments.byId[data.customerId]
  //keep the any change from the current customer
  if (currentCheckout && currentCheckout.customerId) {
    dispatch(updateCustomerCheckout(currentCheckout))
  }
  //load a new or existing payment to currentCheckout
  dispatch(clearCurrentCheckout())
  if (newCheckout) {
      dispatch(updateCurrentCheckout(newCheckout))
  } else {
    const servicePrice = getServiceCost(getState())
    const totalPrice = servicePrice
    dispatch(updateCurrentCheckout({
      servicePrice: servicePrice,
      taxPrice: 0,
      tipPrice: 0,
      totalPrice: totalPrice,
      credit: 'N',
      cash: 'N',
      check: 'N',
      giftcard: 'N',
      customerId: data.customerId
    }))    
  }
}

export const selectAddCustomer = data => (dispatch) => {
  dispatch(resetPOSScreen())
  dispatch(changePOSScreen(data))
}
export const handleOpenDialog = data => (dispatch, getState) => {
  dispatch(updatePOSScreen(data))
}
