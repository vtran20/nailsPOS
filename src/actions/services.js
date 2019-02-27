import C from '../constants'
import fetch from 'isomorphic-fetch'
import {addCustomerService} from './customerServices'
import {calculateCurrentPrices} from './payments'
import { handleErrors, handleErrorMessages, urlAPI, getCurrentDateTime, getHeader } from '../utils'
import { createErrorLog, addGlobalMessages } from './index'
import { getCurrentStoreId } from '../selectors'
import moment from 'moment'


export const addService = service => {
  return {
    type: C.SERVICE_ADD,
    payload: service
  }
}

export const updateService = service => {
  return {
    type: C.SERVICE_UPDATE,
    payload: service
  }
}
export const addServiceGroup = group => {
  return {
    type: C.SERVICE_GROUP_ADD,
    payload: group
  }
}

export const updateServiceGroup = group => {
  return {
    type: C.SERVICE_GROUP_UPDATE,
    payload: group
  }
}

export const changeServiceGroup = (service) => {
  return {
    type: C.SERVICE_GROUP_CHANGE,
    payload: service
  }
}

export const editService = service => {
  return {
    type: C.SERVICE_EDIT,
    payload: service
  }
}
export const editServiceClear = () => {
  return {
    type: C.SERVICE_EDIT_CLEAR
  }
}

export const removeService = serviceId => {
  return {
    type: C.SERVICE_REMOVE,
    payload: serviceId
  }
}
export const removeServiceGroup = groupId => {
  return {
    type: C.SERVICE_GROUP_REMOVE,
    payload: groupId
  }
}

export const fetchServiceBegin = () => {
  return {
    type: C.SERVICE_FETCHING,
    payload: true
  }
}

export const addServiceToCustomer = serviceId => (dispatch, getState) => {
  if (
    getState().posScreen && 
    getState().posScreen.customerId &&
    getState().posScreen.screen === 'CUSTOMER_DETAIL'
  ) {
    const customerId = getState().posScreen.customerId

    fetch(
      urlAPI + `/services/${serviceId}/addServiceToCustomer/${customerId}.json?storeId=${getCurrentStoreId(getState())}&currentDate=${getCurrentDateTime()}`,
      {
        method: 'POST',
        body: { customerId: customerId, serviceId: serviceId },
        headers: getHeader('POST'),
      credentials: 'include'
      }
    )
      .then(handleErrors)
      .then(response => response.json())
      .then(customerService => {
          handleErrorMessages(customerService)
          dispatch(addCustomerService(customerService))
          dispatch(calculateCurrentPrices())
        }
      )
      .catch(error => {
        dispatch(createErrorLog(error.message))
      })
  }
}

export const createService = service => (dispatch, getState) => {
  fetch(urlAPI + `/services.json?storeId=${getCurrentStoreId(getState())}`, {
    method: 'POST',
    body: JSON.stringify(service),
    headers: getHeader('POST'),
      credentials: 'include'
  })
  .then(handleErrors)
  .then(response => response.json())
  .then(data => {
    handleErrorMessages(data)
    dispatch(addService(data.service))
    if (data.messages) {
      dispatch(addGlobalMessages(data.messages.infos))
    }
  })
  .catch(error => {
    dispatch(createErrorLog(error.message))
  })
}

export const updatingService = (service, oldGroupId) => (dispatch, getState) => {
  fetch(urlAPI + `/services/${service.id}.json?storeId=${getCurrentStoreId(getState())}`, {
    method: 'PUT',
    body: JSON.stringify(service),
    headers: getHeader('PUT'),
      credentials: 'include'
  })
  .then(handleErrors)
  .then(response => response.json())
  .then(data => {
    handleErrorMessages(data)
    if (data.service && service.groupId !== oldGroupId) {
      const newService = {...data.service, oldGroupId: oldGroupId}
      dispatch(changeServiceGroup(newService))
    }
    dispatch(updateService(data.service))
    if (data.messages) {
      dispatch(addGlobalMessages(data.messages.infos))
    }
  })
  .catch(error => {
    dispatch(createErrorLog(error.message))
  })
}

//Delete mean delete from database and remove from store as well
export const deleteService = serviceId => (
  dispatch,
  getState
) => {
  fetch(
    urlAPI +
      `/services/${serviceId}.json`,
    {
      method: 'DELETE',
      headers: getHeader('DELETE'),
      credentials: 'include'
    }
  )
    .then(handleErrors)
    .then(response => response.json())
    .then(data => {
      handleErrorMessages(data)
      dispatch(removeService(serviceId))
      dispatch(addGlobalMessages(data.infos))
    })
    .catch(error => {
      dispatch(createErrorLog(error.message))
    })
}

