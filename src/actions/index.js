import fetch from 'isomorphic-fetch'
import { addCustomer, fetchCustomerBegin, fetchCustomerComplete } from './customers'
import { addService, addServiceGroup } from './services'
import { addEmployee } from './employees'
import { addCustomerCheckout, updateCustomerCheckout, updateCurrentCheckout, clearCurrentCheckout } from './payments'
import { addCustomerService } from './customerServices'
import { addEmployeeService } from './employeeServices'
import { addAppointment } from './appointments'
import { addStore, selectStoreId } from './stores'
import { handleErrors, handleErrorMessages, urlAPI, getStartEndCurrentDate, getHeader, CREDENTIALS } from '../utils'
import Cookies from 'universal-cookie'
import C from '../constants'
import { getServiceCost, getCurrentStoreId, getSecureCookie } from '../selectors'
import moment from 'moment'

const cookies = new Cookies()

export const login = (loginForm) => (dispatch, getState) => {
  if (loginForm) {
    dispatch(fetchCustomerBegin())
    fetch(urlAPI + `/login.json?storeId=${getCurrentStoreId(getState())}`, {
      method: 'POST',
      body: JSON.stringify(loginForm),
      headers: getHeader('POST'),      
      credentials: CREDENTIALS //enable cookie
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(result => {
        handleErrorMessages(result.messages)
        dispatch(fetchCustomerComplete())
        if (result.isLoggedIn && result.isLoggedIn === 'Y') {
          if (result.USER_SESSION_SECURE_COOKIE) {
            let maxAge  = -1
            if (loginForm.rememberMe) {
              maxAge  = new Date(Date.now() + 30*24*60*60)
            }
            dispatch(isLoggedIn(true))
          }
        }
      })
      .catch(error => {
        dispatch(fetchCustomerComplete())
        dispatch(createErrorLog(error.message))
      })
  }
}

export const logout = () => (dispatch) => {
    fetch(urlAPI + `/logout.json`, {
      method: 'GET',
      headers: getHeader('GET'),
      credentials: CREDENTIALS //enable cookie
    })
      .then(handleErrors)
      .then(response => {
        dispatch(isLoggedIn(false))
        dispatch(resetGlobalData())
        cookies.remove('USER_SESSION_SECURE_COOKIE');
      })
      .catch(error => {
        dispatch(createErrorLog(error.message))
      })

}

export const selectStore = storeId => (dispatch, getState) => {
  const storeIdParam = parseInt(storeId)
  const storeIdState = parseInt(getState().stores.currentStoreId)
  if (storeIdParam && (storeIdParam !== storeIdState)) {
    dispatch(initialData(storeId))
  }
}
export const initialData = storeId => (dispatch, getState) => {
  const loginStatus = getState().isLoggedIn
  dispatch(resetGlobalData())
  dispatch(fetchGlobalBegin())
  dispatch(isLoggedIn(loginStatus))
  fetch(urlAPI + `/initialData.json?storeId=${storeId}&${getStartEndCurrentDate()}`, {
    method: 'GET',
    headers: getHeader('GET'),
    credentials: CREDENTIALS //enable cookie
  })
    .then(handleErrors)
    .then(response => response.json())
    .then(result => {
      handleErrorMessages(result)
      if (result.stores) result.stores.map(store => dispatch(addStore(store)))
      if (result.serviceGroups)
        result.serviceGroups.map(group => dispatch(addServiceGroup(group)))
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
        const maxAge  = new Date(Date.now() + 30*24*60*60)
        cookies.set('STORE_ID_COOKIE', storeId, {
          maxAge : maxAge 
        })
      } else {
        if (getState().stores.allIds && getState().stores.allIds.length === 1) {
          const defaultStoreId = getState().stores.allIds[0]
          dispatch(selectStoreId(defaultStoreId))
          const maxAge  = new Date(Date.now() + 30*24*60*60)
          cookies.set('STORE_ID_COOKIE', defaultStoreId, {
            maxAge : maxAge 
          })
        } else if (getState().stores.allIds && getState().stores.allIds.length > 1) {
          dispatch(updatePOSScreen({ selectStoreDialog: true}))
        }
      }
      //update the load time
      dispatch(updateMoment(new moment().format()))
    })
    .catch(error => dispatch(createErrorLog(error.message)))
}

export const reloadData = () => (dispatch, getState) => {
  const storeId = parseInt(getState().stores.currentStoreId)
  const currentDay = new moment(getState().moment);
  const nextDay = new moment();
  const diff = currentDay.diff(nextDay, 'days')
  if (diff < 0) {
    //initial refresh data again next day
    initialData(storeId)
  } else {
    dispatch(fetchCustomerBegin())
    const startDate = getState().moment
    const endDate = moment().endOf('day').format()
    fetch(urlAPI + `/reload.json?storeId=${storeId}&startDate=${startDate}&endDate=${endDate}`, {
      method: 'GET',
      headers: getHeader('GET'),
      credentials: CREDENTIALS
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(result => {
        handleErrorMessages(result)
        if (result.customers)
          result.customers.map(customer => dispatch(addCustomer(customer)))
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
        dispatch(fetchCustomerComplete())
        //update the load time
        dispatch(updateMoment(new moment().format()))
      })
      .catch(error => {
        dispatch(fetchCustomerComplete())
        dispatch(createErrorLog(error.message))
      })
  }
}

export const createErrorLog = (rootCause) => (dispatch, getState) => {
  if (rootCause && rootCause.indexOf("http") >= 0) {
    dispatch(addGlobalError('Internal System Error. Please try again later.'))
    let inputData = {}
    inputData['rootCause'] = rootCause
    inputData['data'] = getState()

    fetch(urlAPI + `/errorLog.json?storeId=${getCurrentStoreId(getState())}`, {
      method: 'POST',
      body: JSON.stringify(inputData),
      headers: getHeader('POST'),
      credentials: CREDENTIALS //enable cookie
    })    
  } else if (rootCause === 'NEED_LOGIN_AGAIN') {
    dispatch(logout())
    console.log (rootCause)
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
export const addGlobalMessages = messages => (dispatch) => {
  return messages
  ? messages.map (message => dispatch(addGlobalMessage(message)))
  : null
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
export const updateMoment = (moment) => {
  return {
    type: C.MOMENT_UPDATE,
    payload: moment
  }
}

export const isLoggedIn = (flag) => {
  return {
    type: C.LOGIN_UPDATE,
    payload: flag
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
