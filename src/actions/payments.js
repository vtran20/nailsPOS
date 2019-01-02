import C from '../constants'

import {resetPOSScreen, changePOSScreen, addGlobalError, addGlobalMessage} from './index'
import {updateCustomer} from './customers'
import { handleErrors, urlAPI, getServiceCost, dollars2Cents } from '../utils'

export const addCustomerCheckout = data => {
  return {
    type: C.CUSTOMER_CHECKOUT_ADD,
    payload: data
  }
}

export const updateCustomerCheckout = data => {
  return {
    type: C.CUSTOMER_CHECKOUT_UPDATE,
    payload: data
  }
}

export const removeCustomerCheckout = customerId => {
  return {
    type: C.CUSTOMER_CHECKOUT_REMOVE,
    payload: customerId
  }
}

export const updateCurrentCheckout = data => {
  return {
    type: C.CURRENT_CHECKOUT_UPDATE,
    payload: data
  }
}

export const clearCurrentCheckout = () => {
  return {
    type: C.CURRENT_CHECKOUT_CLEAR
  }
}

export const selectCredit = data => {
  return {
    type: C.CREDIT_PAYMENT,
    payload: data
  }
}

export const selectCash = data => {
  return {
    type: C.CASH_PAYMENT,
    payload: data
  }
}

export const selectCheck = data => {
  return {
    type: C.CHECK_PAYMENT,
    payload: data
  }
}

export const selectGiftCard = data => {
  return {
    type: C.GIFTCARD_PAYMENT,
    payload: data
  }
}


export const handlePayment = screen => (dispatch, getState) => {
  const servicePrice = getServiceCost(getState().customers.byId[getState().posScreen.customerId], getState().customerServices.byId, getState().employeeServices.byId)
  dispatch(changePOSScreen(screen))
  dispatch(updateCurrentCheckout({
    servicePrice: servicePrice,
    taxPrice: 0,
    tipPrice: 0,
    totalPrice: servicePrice,
    credit: false,
    cash: false,
    check: false,
    giftcard: false
  }))
}

export const updateTipPay = data => (dispatch, getState) => {
  let  temp = getState().payments.currentCheckout
  const totalPrice = (data.tipPrice? data.tipPrice : 0) + temp.servicePrice
  const currentCheckout = Object.assign ({}, temp, data, {totalPrice: totalPrice})
  dispatch(updateCurrentCheckout(currentCheckout))
}

export const completePayment = () => (dispatch, getState) => {
  const currentCheckout = getState().payments['currentCheckout']
  if (!currentCheckout.credit && !currentCheckout.cash && !currentCheckout.check && !currentCheckout.giftcard) {
    dispatch(addGlobalError('Please select a payment method'))
    return;
  }

  const customerId = getState().posScreen.customerId
  let inputData = {}
  inputData['currentCheckout'] = currentCheckout
  inputData['customer'] = getState().customers.byId[customerId]
  inputData['customerServices'] = []
  inputData['employeeServices'] = []
  getState().customers.byId[customerId].customerServices.map (csId => {
    const customerService = getState().customerServices.byId[csId]
    inputData['customerServices'].push(customerService)
    if (customerService.employeeServices) {
      customerService.employeeServices.map (esId => {
        inputData['employeeServices'].push(getState().employeeServices.byId[esId])
      })
    } else {
      dispatch(addGlobalError('Missing assign employee to services'))
    }
  })

  fetch(urlAPI + `/customers/${getState().posScreen.customerId}/checkout.json?storeId=1`, {
    method: 'POST',
    body: JSON.stringify(inputData),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(handleErrors)
    .then(response => response.json())
    .then(outputData => {
      dispatch(addCustomerCheckout(outputData.payment))
      dispatch(updateCustomer(outputData.customer))
    })
    .catch(error => {
      dispatch(addGlobalError(error.message))
    })

    dispatch(addGlobalMessage('Payment was completed. Thank you!'))
}
