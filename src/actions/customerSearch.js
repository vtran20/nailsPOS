import fetch from 'isomorphic-fetch'
import { createErrorLog } from './index'
import {handleErrors, handleErrorMessages, urlAPI, getHeader} from '../utils'
import { getCurrentStoreId } from '../selectors'


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

export const searchCustomers = (value, type) => (dispatch, getState) => {
  dispatch(customerSearchFetching(true))

  fetch(urlAPI + `/searchNailCustomer?${type}=${value}&storeId=${getCurrentStoreId(getState())}`, {
    method: 'GET',
    headers: getHeader('GET')
  })
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
