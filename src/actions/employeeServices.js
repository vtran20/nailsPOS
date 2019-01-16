import C from '../constants'
import fetch from 'isomorphic-fetch'
import { handleErrors, urlAPI } from '../utils'
import { removeEmployeeServiceFromEmployee } from './employees'
import { removeEmployeeServiceFromCustomerService } from './customerServices'
import {createErrorLog} from './index'
import { calculateCurrentPrices } from './payments'

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

export const fetchEmployeeServiceBegin = () => {
  return {
    type: C.EMPLOYEE_SERVICE_FETCHING,
    payload: true
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
    dispatch(calculateCurrentPrices())
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
      dispatch(calculateCurrentPrices())
    })
    .catch(error => {
      dispatch(createErrorLog(error.message))
    })
}
