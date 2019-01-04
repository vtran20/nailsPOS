import C from '../constants'
import fetch from 'isomorphic-fetch'
import { handleErrors, urlAPI } from '../utils'
import { removeEmployeeServiceFromEmployee } from './employees'
import { removeEmployeeService } from './employeeServices'
import { addGlobalError } from './index'

export const addCustomerService = customerService => {
  return {
    type: C.CUSTOMER_SERVICE_ADD,
    payload: customerService
  }
}

export const updateCustomerService = customerService => {
  return {
    type: C.CUSTOMER_SERVICE_UPDATE,
    payload: customerService
  }
}

export const removeCustomerService = customerServiceId => {
  return {
    type: C.CUSTOMER_SERVICE_REMOVE,
    payload: customerServiceId
  }
}

export const fetchCustomerServiceBegin = () => {
  return {
    type: C.CUSTOMER_SERVICE_FETCHING,
    payload: true
  }
}

export const removeCustomerServiceFromCustomer = customerService => {
  return {
    type: C.CUSTOMER_SERVICE_REMOVE,
    payload: customerService
  }
}

export const removeEmployeeServiceFromCustomerService = employeeService => {
  return {
    type: C.EMPLOYEE_SERVICE_REMOVE,
    payload: employeeService
  }
}

//Delete mean delete from database and remove from store as well
export const deleteCustomerService = customerService => (
  dispatch,
  getState
) => {
  fetch(
    urlAPI +
      `/customers/${customerService.customerId}/customerServices/${
        customerService.id
      }.json`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
    .then(handleErrors)
    .then(response => {
      if (customerService.employeeServices) {
        customerService.employeeServices.map(employeeServiceId => {
          dispatch(
            removeEmployeeServiceFromEmployee({
              ...getState().employeeServices.byId[employeeServiceId]
            })
          )
          dispatch(
            removeEmployeeServiceFromCustomerService({
              ...getState().employeeServices.byId[employeeServiceId]
            })
          )
          dispatch(removeEmployeeService(employeeServiceId))
        })
      }
      dispatch(removeCustomerService(customerService.id))
      dispatch(removeCustomerServiceFromCustomer(customerService))
    })
    .catch(error => {
      dispatch(addGlobalError(error.message))
    })
}
