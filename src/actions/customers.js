import C from '../constants'
import fetch from 'isomorphic-fetch'
import { handleErrors, urlAPI } from '../utils'

export const addCustomer = customer => {
  return {
    type: C.CUSTOMER_ADD,
    payload: customer
  }
}

export const updateCustomer = customer => {
  return {
    type: C.CUSTOMER_UPDATE,
    payload: customer
  }
}

export const removeCustomer = customerId => {
  return {
    type: C.CUSTOMER_REMOVE,
    payload: customerId
  }
}

export const addCustomerError = message => {
  return {
    type: C.CUSTOMER_ERROR_ADD,
    payload: message
  }
}

export const removeCustomerError = index => {
  return {
    type: C.CUSTOMER_ERROR_REMOVE,
    payload: index
  }
}

export const clearCustomerError = () => {
  return {
    type: C.CUSTOMER_ERROR_CLEAR
  }
}

export const fetchCustomerBegin = () => {
  return {
    type: C.CUSTOMER_FETCHING,
    payload: true
  }
}

export const fetchCustomerError = error => {
  return {
    type: C.CUSTOMER_ERROR_ADD,
    payload: error
  }
}

export const searchCustomers = (phone, email) => dispatch => {
  let queryString = urlAPI + '/searchNailCustomer.json?'
  if (phone) {
    queryString = queryString + 'phone=' + phone + '&'
  }
  if (email) {
    queryString = queryString + 'email=' + email
  }

  fetch(queryString)
    .then(response => response.json())
    .then(data => {
      dispatch({
        type: C.SEARCH_CUSTOMER,
        payload: data
      })
    })
    .catch(error => {
      dispatch(addCustomerError(error))
    })
}

export const createCustomer = customer => dispatch => {
  fetch(urlAPI + '/customers.json?storeId=1', {
    method: 'POST',
    body: JSON.stringify(customer),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(handleErrors)
    .then(response => response.json())
    .then(data => {
      dispatch(addCustomer(data))
    })
    .catch(error => {
      dispatch(addCustomerError(error))
    })
}

export const addCustomerService = (customerId, services) => {
  return {
    type: C.ADD_CUSTOMER_SERVICE,
    payload: services
  }
}

export const updateCustomerService = services => {
  return {
    type: C.UPDATE_CUSTOMER_SERVICE,
    payload: services
  }
}

export const checkInCustomer = customerId => dispatch => {
  fetch(urlAPI + `/customers/${customerId}/checkIn.json?storeId=1`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(handleErrors)
    .then(response => response.json())
    .then(data => {
      dispatch(addCustomer(data))
    })
    .catch(error => {
      dispatch(addCustomerError(error))
    })
}

export const getServicePrice = () => (dispatch, getState) => {

  return 1000
}
