import C from '../constants'
import fetch from 'isomorphic-fetch'
import { handleErrors, handleErrorMessages, urlAPI, getCurrentDateTime, getStartEndCurrentDate, getHeader } from '../utils'
import { addEmployeeService } from './employeeServices'
import { addGlobalError, createErrorLog, addGlobalMessages } from './index'
import { getCurrentStoreId } from '../selectors'
import moment from 'moment'

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

export const editEmployee = employee => {
  return {
    type: C.EMPLOYEE_EDIT,
    payload: employee
  }
}
export const editEmployeeClear = () => {
  return {
    type: C.EMPLOYEE_EDIT_CLEAR
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

export const addEmployeeToCustomer = (employeeId, customerServiceId) => (dispatch, getState) => {
  if (
    getState().posScreen && 
    getState().posScreen.customerId &&
    getState().posScreen.screen === 'CUSTOMER_DETAIL'
  ) {
    if (!getState().customers.byId[getState().posScreen.customerId].customerServices) {
      dispatch(addGlobalError('Please select services first'))
      return;
    }
    const customerId = getState().posScreen.customerId
    const url = customerServiceId
    ? urlAPI + `/employees/${employeeId}/addEmployeeToCustomer/${customerId}.json?customerServiceId=${customerServiceId}&storeId=${getCurrentStoreId(getState())}&${getStartEndCurrentDate()}`
    : urlAPI + `/employees/${employeeId}/addEmployeeToCustomer/${customerId}.json?storeId=${getCurrentStoreId(getState())}&${getStartEndCurrentDate()}`
    fetch(
      url,
      {
        method: 'POST',
        body: { customerId: customerId, employeeId: employeeId },
        headers: getHeader('POST')
      }
    )
      .then(handleErrors)
      .then(response => response.json())
      .then(employeeServices => {
        handleErrorMessages(employeeServices)
        employeeServices.map(employeeService =>
          dispatch(addEmployeeService(employeeService))
        )
      })
      .catch(error => {
        dispatch(createErrorLog(error.message))
      })
  }
}

export const createEmployee = employee => (dispatch, getState) => {
  fetch(urlAPI + `/employees.json?storeId=${getCurrentStoreId(getState())}`, {
    method: 'POST',
    body: JSON.stringify(employee),
    headers: getHeader('POST')
  })
  .then(handleErrors)
  .then(response => response.json())
  .then(data => {
    handleErrorMessages(data)
    dispatch(addEmployee(data.employee))
    if (data.messages) {
      dispatch(addGlobalMessages(data.messages.infos))
    }
  })
  .catch(error => {
    dispatch(createErrorLog(error.message))
  })
}

export const updatingEmployee = employee => (dispatch, getState) => {
  fetch(urlAPI + `/employees/${employee.id}.json?storeId=${getCurrentStoreId(getState())}`, {
    method: 'PUT',
    body: JSON.stringify(employee),
    headers: getHeader('PUT')
  })
  .then(handleErrors)
  .then(response => response.json())
  .then(data => {
    handleErrorMessages(data)
    dispatch(updateEmployee(data.employee))
    if (data.messages) {
      dispatch(addGlobalMessages(data.messages.infos))
    }
  })
  .catch(error => {
    dispatch(createErrorLog(error.message))
  })
}

//Delete mean delete from database and remove from store as well
export const deleteEmployee = employeeId => (
  dispatch,
  getState
) => {
  fetch(
    urlAPI +
      `/employees/${employeeId}.json?storeId=${getCurrentStoreId(getState())}`,
    {
      method: 'DELETE',
      headers: getHeader('DELETE')
    }
  )
    .then(handleErrors)
    .then(response => response.json())
    .then(data => {
      handleErrorMessages(data)
      dispatch(removeEmployee(employeeId))
      dispatch(addGlobalMessages(data.infos))
    })
    .catch(error => {
      dispatch(createErrorLog(error.message))
    })
}

