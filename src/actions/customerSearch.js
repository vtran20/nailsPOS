import fetch from 'isomorphic-fetch'
import { addGlobalError, createErrorLog } from './index'
import { handleErrors, handleErrorMessages, urlAPI } from '../utils'

import C from '../constants'

export const changeCustomerSearchResults = results => ({
  type: C.CUSTOMER_SEARCH_CHANGING,
  payload: results
})

export const customerSearchFetching = value => ({
  type: C.CUSTOMER_SEARCH_FETCHING,
  payload: value
})

export const clearCustomerSearchs = () => ({
  type: C.CUSTOMER_SEARCH_CLEAR
})

export const searchCustomers = (value, type) => dispatch => {
  dispatch(customerSearchFetching(true))

  fetch(urlAPI + '/searchNailCustomer.json?' + type + '=' + value)
    .then(handleErrors)
    .then(response => response.json())
    .then(results => {
      handleErrorMessages(results)
      dispatch(changeCustomerSearchResults(results))
    })
    .catch(error => {
      dispatch(createErrorLog(error.message))
      dispatch(customerSearchFetching(false))
    })
}
