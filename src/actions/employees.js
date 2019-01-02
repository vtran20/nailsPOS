import C from '../constants'
import fetch from 'isomorphic-fetch'
import { handleErrors, urlAPI } from '../utils'
import { addEmployeeService } from './employeeServices'
import { addGlobalError } from './index'
export const addEmployee = employee => {
  return {
    type: C.EMPLOYEE_ADD,
    payload: employee
  }
}

export const updateEmployee = employee => {
  return {
    type: C.EMPLOYEE_UPDATE,
    payload: employee
  }
}

export const removeEmployee = employeeId => {
  return {
    type: C.EMPLOYEE_REMOVE,
    payload: employeeId
  }
}

export const fetchEmployeeBegin = () => {
  return {
    type: C.EMPLOYEE_FETCHING,
    payload: true
  }
}

export const removeEmployeeServiceFromEmployee = employeeService => {
  return {
    type: C.EMPLOYEE_SERVICE_REMOVE,
    payload: employeeService
  }
}

export const addEmployeeToCustomer = employeeId => (dispatch, getState) => {
  if (
    getState().posScreen && 
    getState().posScreen.customerId &&
    getState().posScreen.screen === 'CUSTOMER_DETAIL'
  ) {
    const customerId = getState().posScreen.customerId

    fetch(
      urlAPI + `/employees/${employeeId}/addEmployeeToCustomer/${customerId}.json?storeId=1`,
      {
        method: 'POST',
        body: { customerId: customerId, employeeId: employeeId },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then(handleErrors)
      .then(response => response.json())
      .then(employeeServices => {
        employeeServices.map(employeeService =>
          dispatch(addEmployeeService(employeeService))
        )
      })
      .catch(error => {
        dispatch(addGlobalError(error.message))
      })
  }
}
