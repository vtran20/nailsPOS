import C from '../constants'
import fetch from 'isomorphic-fetch'
import { handleErrors, urlAPI } from '../utils'
import { removeEmployeeServiceFromEmployee } from './employees'
import { removeEmployeeServiceFromCustomerService } from './customerServices'

export const addEmployeeService = employeeService => {
  return {
    type: C.EMPLOYEE_SERVICE_ADD,
    payload: employeeService
  }
}

export const updateEmployeeService = employeeService => {
  return {
    type: C.EMPLOYEE_SERVICE_UPDATE,
    payload: employeeService
  }
}

export const removeEmployeeService = employeeServiceId => {
  return {
    type: C.EMPLOYEE_SERVICE_REMOVE,
    payload: employeeServiceId
  }
}

export const addEmployeeServiceError = message => {
  return {
    type: C.EMPLOYEE_SERVICE_ERROR_ADD,
    payload: message
  }
}

export const removeEmployeeServiceError = index => {
  return {
    type: C.EMPLOYEE_SERVICE_ERROR_REMOVE,
    payload: index
  }
}

export const clearEmployeeServiceError = () => {
  return {
    type: C.EMPLOYEE_SERVICE_ERROR_CLEAR
  }
}

export const fetchEmployeeServiceBegin = () => {
  return {
    type: C.EMPLOYEE_SERVICE_FETCHING,
    payload: true
  }
}

export const fetchEmployeeServiceError = error => {
  return {
    type: C.EMPLOYEE_SERVICE_ERROR_ADD,
    payload: error
  }
}

export const updateEmployeeServiceInfo = data  => (
  dispatch,
  getState
) => {
  const employeeService = getState().employeeServices.byId[data.id]
  if (employeeService) {
    const employeeServiceEdit = Object.assign ({}, employeeService, data)
    dispatch(updateEmployeeService(employeeServiceEdit))
  }
}

//Delete mean delete from database and remove from store as well
export const deleteEmployeeService = employeeService => (
  dispatch,
  getState
) => {
  fetch(
    urlAPI +
      `/employees/${employeeService.employeeId}/employeeServices/${
        employeeService.id
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
      dispatch(removeEmployeeServiceFromEmployee(employeeService))
      dispatch(removeEmployeeServiceFromCustomerService(employeeService))
      dispatch(removeEmployeeService(employeeService.id))
    })
    .catch(error => {
      dispatch(fetchEmployeeServiceError(error))
    })
}
