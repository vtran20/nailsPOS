import C from '../constants'
import fetch from 'isomorphic-fetch'
import {addCustomerService} from './customerServices'
import { handleErrors, urlAPI } from '../utils'

export const addService = service => {
  return {
    type: C.SERVICE_ADD,
    payload: service
  }
}

export const updateService = service => {
  return {
    type: C.SERVICE_UPDATE,
    payload: service
  }
}

export const removeService = serviceId => {
  return {
    type: C.SERVICE_REMOVE,
    payload: serviceId
  }
}

export const addServiceError = message => {
  return {
    type: C.SERVICE_ERROR_ADD,
    payload: message
  }
}

export const removeServiceError = index => {
  return {
    type: C.SERVICE_ERROR_REMOVE,
    payload: index
  }
}
export const clearServiceError = () => {
  return {
    type: C.SERVICE_ERROR_CLEAR
  }
}

export const fetchServiceBegin = () => {
  return {
    type: C.SERVICE_FETCHING,
    payload: true
  }
}

export const fetchServiceError = error => {
  return {
    type: C.SERVICE_ERROR_ADD,
    payload: error
  }
}


export const addServiceToCustomer = serviceId => (dispatch, getState) => {
  if (
    getState().posScreen && 
    getState().posScreen.customerId &&
    getState().posScreen.screen === 'CUSTOMER_DETAIL'
  ) {
    const customerId = getState().posScreen.customerId

    fetch(
      urlAPI + `/services/${serviceId}/addServiceToCustomer/${customerId}.json?storeId=1`,
      {
        method: 'POST',
        body: { customerId: customerId, serviceId: serviceId },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then(handleErrors)
      .then(response => response.json())
      .then(customerService => 
          dispatch(addCustomerService(customerService))
      )
      .catch(error => {
        dispatch(addServiceError(error))
      })
  }
}
