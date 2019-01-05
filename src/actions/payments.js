import C from '../constants'

import {changePOSScreen, addGlobalError, addGlobalMessage} from './index'
import {updateCustomer} from './customers'
import { handleErrors, urlAPI, getServiceCost } from '../utils'

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
  dispatch(changePOSScreen(screen))
}

export const updateTipPay = data => (dispatch, getState) => {
  //update tip employeeService
  const customerId = getState().posScreen.customerId
  const currentCustomer = getState().customers.byId[customerId]
  //Validate and make sure select services before checkout
  if (!getState().customers.byId[customerId].customerServices) {
    dispatch(addGlobalError('Please select services'))
    return;
  }
  //Validate each customer service need have at least 1 employee
  let assignedEmployee = true
  getState().customers.byId[customerId].customerServices.map (csId => {
    const customerService = getState().customerServices.byId[csId]
    if (!customerService.employeeServices) {
      assignedEmployee = false;
    }
  })
  if (!assignedEmployee) {
    dispatch(addGlobalError('please make sure all services have been assigned to employees'))
    return;
  }

  //Update currentCheckout
  let  temp = getState().payments.currentCheckout
  const totalPrice = (data.tipPrice? data.tipPrice : 0) + temp.servicePrice
  const currentCheckout = Object.assign ({}, temp, data, {totalPrice: totalPrice})
  dispatch(updateCurrentCheckout(currentCheckout))

}

export const updateCurrentPaymentMethod = data => (dispatch, getState) => {
  let  temp = getState().payments.currentCheckout
  const currentCheckout = Object.assign ({}, temp, data)
  dispatch(updateCurrentCheckout(currentCheckout))
}

export const calculateCurrentPrices = () => (dispatch, getState) => {

  const servicePrice = getServiceCost(
    getState().customers.byId[getState().posScreen.customerId], 
    getState().customerServices.byId, 
    getState().employeeServices.byId
  )
  let  temp = getState().payments.currentCheckout
  const totalPrice = (temp.tipPrice? temp.tipPrice : 0) + servicePrice
  const currentCheckout = Object.assign ({}, temp, {servicePrice: servicePrice, totalPrice: totalPrice})
  dispatch(updateCurrentCheckout(currentCheckout))
}

export const completePayment = () => (dispatch, getState) => {
  const customerId = getState().posScreen.customerId
  const currentCustomer = getState().customers.byId[customerId]
  const currentCheckout = getState().payment.currentCheckout
  //Validdate data before submit payment
  //Validate payment method
  if (currentCheckout.credit === 'N' && currentCheckout.cash === 'N' && currentCheckout.check === 'N' && currentCheckout.giftcard === 'N') {
    dispatch(addGlobalError('Please select a payment method'))
    return;
  }

  //Validate and make sure select services before checkout
  if (!getState().customers.byId[customerId].customerServices) {
    dispatch(addGlobalError('Please select services'))
    return;
  }
  //Validate each customer service need have at least 1 employee
  let assignedEmployee = true
  getState().customers.byId[customerId].customerServices.map (csId => {
    const customerService = getState().customerServices.byId[csId]
    if (!customerService.employeeServices) {
      assignedEmployee = false;
    }
  })
  if (!assignedEmployee) {
    dispatch(addGlobalError('please make sure all services have been assigned to employees'))
    return;
  }

  //Process data
  let inputData = {}
  inputData['currentCheckout'] = currentCheckout
  inputData['customer'] = currentCustomer
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
