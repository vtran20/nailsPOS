import { createSelector } from 'reselect'
import Cookies from 'universal-cookie'


const getStoresById = (state) => state.stores.byId
// const getStoresAllIds = (state) => state.stores.allIds
const getStores = (state) => state.stores
const getCustomersById = (state) => state.customers.byId
const getCustomersAllIds = (state) => state.customers.allIds
const getEmployeesById = (state) => state.employees.byId
const getEmployeesAllIds = (state) => state.employees.allIds
const getAppointmentsById = (state) => state.appointments.byId
const getAppointmentsAllIds = (state) => state.appointments.allIds
const getServicesById = (state) => state.services.byId
const getServicesAllIds = (state) => state.services.allIds
const getCustomerServicesById = (state) => state.customerServices.byId
// const getCustomerServicesAllIds = (state) => state.customerServices.allIds
const getEmployeeServicesById = (state) => state.employeeServices.byId
// const getEmployeeServicesAllIds = (state) => state.employeeServices.allIds
const getPOSScreen = (state) => state.posScreen
const getCurrentCheckout = (state) => state.payments.currentCheckout

//Get current customer
export const getStore = createSelector(
  [ getStoresById, getStores ],
  (byId, stores) => stores && stores.currentStoreId? byId[stores.currentStoreId] : {}
)

export const getCurrentStoreId = createSelector(
  [ getStores ],
  (stores) =>  {
    if (stores && stores.currentStoreId) {
      return stores.currentStoreId
    } else {
      const cookies = new Cookies()
      return cookies.get('STORE_ID_COOKIE')
    }
})

//Get all current customers
export const getCustomers = createSelector(
  [ getCustomersById, getCustomersAllIds ],
  (byId, allIds) => allIds.map(id => byId[id])
)

//Get current customer
export const getCurrentCustomer = createSelector(
  [ getCustomersById, getPOSScreen ],
  (byId, posScreen) => posScreen && posScreen.customerId? byId[posScreen.customerId] : {}
)

//Get all current employees
export const getEmployees = createSelector(
  [ getEmployeesById, getEmployeesAllIds ],
  (byId, allIds) => allIds.map(id => byId[id])
)

//Get all current employees
export const getAppointments = createSelector(
  [ getAppointmentsById, getAppointmentsAllIds ],
  (byId, allIds) => allIds.map(id => byId[id])
)
//Get all current services
export const getServices = createSelector(
  [ getServicesById, getServicesAllIds ],
  (byId, allIds) => allIds.map(id => byId[id])
)

//Get all customer service of a current customer
export const getCustomerServicesOfCustomer = createSelector(
  [ getCustomersById, getPOSScreen, getCustomerServicesById ],
  (byId, posScreen, customerServiceById) => posScreen && posScreen.customerId && byId[posScreen.customerId].customerServices
  	? byId[posScreen.customerId].customerServices.map (customerServiceId => customerServiceById[customerServiceId]) 
  	: []
)

//Get all service Ids of a current customer
export const getServiceIdsOfCustomer = createSelector(
  [ getCustomersById, getPOSScreen, getCustomerServicesById ],
  (byId, posScreen, customerServiceById) => posScreen && posScreen.customerId && byId[posScreen.customerId].customerServices
  	? byId[posScreen.customerId].customerServices.map (customerServiceId => 
  		customerServiceById[customerServiceId]
  			? customerServiceById[customerServiceId].serviceId 
  			: []) 
  	: []
)

//Get all employee Ids of a current customer
export const getEmployeeIdsOfCustomer = createSelector(
  [ getCustomersById, getPOSScreen, getCustomerServicesById, getEmployeeServicesById ],
  (byId, posScreen, customerServiceById, employeeServiceById) => {
  	let employeeIds = []
  	if (posScreen && posScreen.customerId && byId[posScreen.customerId].customerServices) {
	  	byId[posScreen.customerId].customerServices.map (customerServiceId => {
	  		if (customerServiceById[customerServiceId] && customerServiceById[customerServiceId].employeeServices) {
  				customerServiceById[customerServiceId].employeeServices.map (employeeServiceId => {
  					if (employeeServiceById[employeeServiceId] && employeeServiceById[employeeServiceId].employeeId) {
              //Only add employeeId if not existing in employeeIds
              if(employeeIds.find(x => x === employeeServiceById[employeeServiceId].employeeId)) {
                //do nothing
              } else {
                employeeIds = [...employeeIds, employeeServiceById[employeeServiceId].employeeId]
              }
  					}
            return
  				})
  			}
        return
	  	})
  	}
  	return employeeIds
})


//Checking total tip on employees equal global tip
export const checkingTotalTip = createSelector(
  [ getCustomersById, getPOSScreen, getCustomerServicesById, getEmployeeServicesById, getCurrentCheckout ],
  (byId, posScreen, customerServices, employeeServices, currentCheckout) => {
    const customer = posScreen && posScreen.customerId && byId[posScreen.customerId]? byId[posScreen.customerId] : {}
      let totalTip = 0
      if (customer && customer.customerServices) {
        customer.customerServices.map(csId => {
          if (customerServices[csId].employeeServices) {
            customerServices[csId].employeeServices.map (esId => {
              const employeeService = employeeServices[esId]
              if (employeeService && employeeService.tipPrice > 0) {
                totalTip = totalTip + employeeService.tipPrice
              }
            })
          }
        })
      }
      const globalTotalTip = currentCheckout && currentCheckout.tipPrice? currentCheckout.tipPrice : 0
    return totalTip === globalTotalTip
})

//Get cost for services only
export const getServiceCost = createSelector(
  [ getCustomersById, getPOSScreen, getCustomerServicesById, getEmployeeServicesById ],
  (byId, posScreen, customerServices, employeeServices) => {
    const customer = posScreen && posScreen.customerId && byId[posScreen.customerId]? byId[posScreen.customerId] : {}
    let total = 0
      if (customer && customer.customerServices) {
        customer.customerServices.map(csId => {
          let serviceTotal = 0;
          if (customerServices[csId].employeeServices) {
            customerServices[csId].employeeServices.map (esId => {
              const employeeService = employeeServices[esId]
              if (employeeService && employeeService.servicePrice > 0) {
                serviceTotal = serviceTotal + employeeService.servicePrice
              }
              return
            })
          } 
          //use servicePrice from employeeService if any
          if (serviceTotal > 0) {
            total = total + serviceTotal
          } else {
              total = total + customerServices[csId].price
          }
          return
        })
      }
    return total    
})



//////////////////////////////////Don't use selector library////////////////////////////////////////////
export const getCustomerId = (phone, email, state) => {
  const byId = state.customers.byId
  const allIds = state.customers.allIds
  const customerId = null
  allIds.map(id => {
    if (byId[id]) {
      if (byId[id].email && email && byId[id].email.trim() === email.trim()) {
        customerId = id
      }
      if (byId[id].phone && phone && byId[id].phone.trim() === phone.trim()) {
        customerId = id
      }
    }
    return
  })
  return customerId
}







