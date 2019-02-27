import C from '../constants'
import fetch from 'isomorphic-fetch'
import { handleErrors, handleErrorMessages, urlAPI, getCurrentDateTime, getHeader } from '../utils'
import { createErrorLog } from './index'
import { getCurrentStoreId } from '../selectors'
import moment from 'moment'

export const addAppointment = appointment => {
  return {
    type: C.CUSTOMER_APPOINTMENT_ADD,
    payload: appointment
  }
}

export const updateAppointment = appointment => {
  return {
    type: C.CUSTOMER_APPOINTMENT_UPDATE,
    payload: appointment
  }
}

export const removeAppointment = appointmentId => {
  return {
    type: C.CUSTOMER_APPOINTMENT_REMOVE,
    payload: appointmentId
  }
}

export const fetchingAppointment = fetching => {
  return {
    type: C.CUSTOMER_APPOINTMENT_FETCHING,
    payload: fetching
  }
}

export const createAppointment = appointment => (dispatch, getState) => {
  // dispatch(fetchingAppointment(true))
  fetch(urlAPI + `/appointments.json?storeId=${getCurrentStoreId(getState())}`, {
    method: 'POST',
    body: JSON.stringify(appointment),
    headers: getHeader('POST'),
    credentials: 'include'
  })
    .then(handleErrors)
    .then(response => response.json())
    .then(data => {
      handleErrorMessages(data)
      if (data) {
        dispatch(addAppointment(data))
      }
      // dispatch(fetchingAppointment(false))
    })
    .catch(error => {
      dispatch(createErrorLog(error.message))
      // dispatch(fetchingAppointment(false))
    })
}

export const loadAppointment = (startDate, endDate) => (dispatch, getState) => {
  dispatch(fetchingAppointment(true))
 fetch(urlAPI + `/appointments.json?startDate=${startDate}&endDate=${endDate}&storeId=${getCurrentStoreId(getState())}`, {
    method: 'GET',
    headers: getHeader('GET'),
    credentials: 'include'
  })
     .then(handleErrors)
    .then(response => response.json())
    .then(data => {
      handleErrorMessages(data)
      if (data && data.length >= 0) {
        data.map (ele => dispatch(addAppointment(ele)))        
      }
      dispatch(fetchingAppointment(false))
    })
    .catch(error => {
      dispatch(createErrorLog(error.message))
      dispatch(fetchingAppointment(false))
    })
}

//Delete mean delete from database and remove from store as well
export const deleteAppointment = appointmentId => (
  dispatch,
  getState
) => {
  fetch(
    urlAPI +
      `/appointments/${appointmentId}.json?storeId=${getCurrentStoreId(getState())}&currentDate=${getCurrentDateTime()}`,
    {
      method: 'DELETE',
      headers: getHeader('DELETE'),
      credentials: 'include'
    }
  )
    .then(handleErrors)
    .then(response => {
      dispatch(removeAppointment(appointmentId))
    })
    .catch(error => {
      dispatch(createErrorLog(error.message))
    })
}
