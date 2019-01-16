import C from '../constants'
import fetch from 'isomorphic-fetch'
import { handleErrors, handleMessages, urlAPI } from '../utils'
import {
  clearCustomerSearchs
} from './customerSearch'
import { selectCustomer, addGlobalError } from './index'

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

export const fetchCustomerBegin = () => {
  return {
    type: C.CUSTOMER_FETCHING,
    payload: true
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
      handleMessages(data)
      dispatch({
        type: C.SEARCH_CUSTOMER,
        payload: data
      })
    })
    .catch(error => {
      dispatch(addGlobalError(error.message))
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
      handleMessages(data)
      dispatch(addCustomer(data))
    })
    .catch(error => {
      dispatch(addGlobalError(error.message))
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
      handleMessages(data)
      dispatch(addCustomer(data))
    })
    .catch(error => {
      dispatch(addGlobalError(error.message))
    })
}

export const checkInCustomerAtPOS = customerId => dispatch => {
  fetch(urlAPI + `/customers/${customerId}/checkIn.json?storeId=1`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(handleErrors)
    .then(response => response.json())
    .then(data => {
      handleMessages(data)
      dispatch(addCustomer(data))
      dispatch(clearCustomerSearchs())
      dispatch(selectCustomer({ screen: 'CUSTOMER_DETAIL', customerId: data.id }))

    })
    .catch(error => {
      dispatch(addGlobalError(error.message))
    })
}


export const updateCustomerDB = customer => dispatch => {
  fetch(urlAPI + `/customers/${customer.id}.json?storeId=1`, {
    method: 'PUT',
    body: JSON.stringify(customer),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(handleErrors)
    .then(response => response.json())
    .then(data => {
      handleMessages(data)
      dispatch(updateCustomer(data))
    })
    .catch(error => {
      dispatch(addGlobalError(error.message))
    })
}
