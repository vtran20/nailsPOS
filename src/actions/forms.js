import C from '../constants'
import { handleErrors, handleErrorMessages, urlAPI, getCurrentDateTime, getHeader } from '../utils'
import { addCustomer } from './customers'
import { addAppointment } from './appointments'
import { clearCurrentCheckout } from './payments'
import { addEmployeeService } from './employeeServices'
import { addCustomerService, updateCustomerService } from './customerServices'
import { clearCustomerSearchs } from './customerSearch'
import {resetPOSScreen, changePOSScreen, createErrorLog} from './index'
import { getCurrentStoreId } from '../selectors'
import moment from 'moment'

export const addCustomerForm = customer => {
  return {
    type: C.FORM_CUSTOMER_ADD,
    payload: customer
  }
}

export const updateCustomerForm = customer => {
  return {
    type: C.FORM_CUSTOMER_UPDATE,
    payload: customer
  }
}

export const addCustomerServiceForm = services => {
  return {
    type: C.FORM_CUSTOMER_SERVICE_ADD,
    payload: services
  }
}

export const clearCustomerForm = () => {
  return {
    type: C.FORM_CUSTOMER_CLEAR
  }
}

export const clearAllForm = () => {
  return {
    type: C.FORM_ALL_CLEAR
  }
}

export const createNewCustomerServiceForCheckIn = () => (
  dispatch,
  getState
) => {
  fetch(urlAPI + `/customers/customerServices.json?storeId=${getCurrentStoreId(getState())}&currentDate=${getCurrentDateTime()}`, {
    method: 'POST',
    body: JSON.stringify(getState().forms['customerForm']),
    headers: getHeader('POST'),
      credentials: 'include'
  })
    .then(handleErrors)
    .then(response => response.json())
    .then(data => {
      handleErrorMessages(data)
      dispatch(clearCurrentCheckout())
      dispatch(addCustomer(data.customer))
      data.customerServices.map(customerService =>
        dispatch(addCustomerService(customerService))
      )
      //reset the screen
      dispatch(resetPOSScreen())
      //set the new customer id and ready for display this one.
      dispatch(changePOSScreen({screen: 'CUSTOMER_DETAIL', customerId: data.customer? data.customer.id: null}))

      //Update appointment status if any
      // dispatch(
      //   updateCustomerAppointment({
      //     id: getState().forms['customerForm'].customerAppointmentId,
      //     status: 'CHECKED_IN'
      //   })
      // )
      dispatch(clearCustomerForm())
    })
    .catch(error => {
      dispatch(createErrorLog(error.message))
    })
}

export const checkInAppointmentCustomer = customer => (dispatch, getState) => {
  fetch(urlAPI + `/customers/customerServices.json?appointment=Y&storeId=${getCurrentStoreId(getState())}&currentDate=${getCurrentDateTime()}`, {
    method: 'POST',
    body: JSON.stringify(customer),
    headers: getHeader('POST'),
      credentials: 'include'
  })
    .then(handleErrors)
    .then(response => response.json())
    .then(data => {
      handleErrorMessages(data)
      data.customerServices.map(customerService =>
        dispatch(updateCustomerService(customerService))
      )
    })
    .catch(error => {
      dispatch(createErrorLog(error.message))
    })
}

export const makeAppointment = serviceIds => (dispatch, getState) => {
  dispatch(updateCustomerForm({services: serviceIds}))
  fetch(urlAPI + `/customers/makeAppointment.json?storeId=${getCurrentStoreId(getState())}`, {
    method: 'POST',
    body: JSON.stringify(getState().forms['customerForm']),
    headers: getHeader('POST'),
      credentials: 'include'
  })
    .then(handleErrors)
    .then(response => response.json())
    .then(data => {

      handleErrorMessages(data.messages? data.messages : null)

      if (data.customer) {
        dispatch(addCustomer(data.customer))
      }
      if (data.customerServices) {
        data.customerServices.map(customerService =>
          dispatch(addCustomerService(customerService))
        )
      }
      if (data.appointment) {
        dispatch(addAppointment(data.appointment))
      }
      
      if (data.employeeServices)
        data.employeeServices.map(employeeSrevice =>
          dispatch(addEmployeeService(employeeSrevice))
      )

      //reset the screen
      // dispatch(resetPOSScreen())
      //set the new customer id and ready for display this one.
      // dispatch(changePOSScreen({screen: 'CUSTOMER_DETAIL', customerId: data.customer? data.customer.id: null}))

      //Update appointment status if any
      // dispatch(
      //   updateCustomerAppointment({
      //     id: getState().forms['customerForm'].customerAppointmentId,
      //     status: 'CHECKED_IN'
      //   })
      // )
      dispatch(clearCustomerForm())
      dispatch(clearCustomerSearchs())
    })
    .catch(error => {
      dispatch(createErrorLog(error.message))
    })

}
