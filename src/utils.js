export const urlAPI = 'http://localhost/nails'

const DEFAULT_CURRENCY = 'USD'
const DEFAULT_LOCALE = 'en-US'

export const handleErrors = response => {
  if (!response.ok) {
    console.log(response)
    throw Error(response.statusText)
  }
  return response
}

export const handleMessages = data => {
  console.log(data)
  if (data) {
    if (data.errors) {
      throw Error (data.errors[0])
    } else if (data.infos) {
      //TODO: add messages to global message.
      return data
    }
  }
  return data
}

export const cents2Dollars = (cents, locale, currency) => {
	var dollars = cents / 100;
	return dollars.toLocaleString(locale? locale : DEFAULT_LOCALE, {style:"currency", currency:currency? currency : DEFAULT_CURRENCY});
}

export const cents2Fixed2 = (cents) => {
	var dollars = cents / 100;
	return dollars.toFixed(2)
}

export const dollars2Cents = (dollars) => {
	var cents = dollars * 100;
	return parseInt(cents.toFixed(0))
}

//Get cost for services only
export const getServiceCost = (customer, customerServices, employeeServices )  => {
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
    		})
    	} 
    	//use servicePrice from employeeService if any
    	if (serviceTotal > 0) {
    		total = total + serviceTotal
    	} else {
	        total = total + customerServices[csId].price
    	}
      })
    }
    return total
}

export const getTotalPrice = (servicePrice, tipPrice, taxPrice )  => {
  let total = 0
  if (servicePrice) total += servicePrice
  if (tipPrice) total += tipPrice
  if (taxPrice) total += tipPrice
  return total
}

//Get array serviceIds of the current customer
export const getServiceIdsOfCustomer = (customerServiceIds, customerServices)  => {
  let serviceIds = []
    if (customerServiceIds && customerServices) {
      customerServiceIds.map(csId => {
        let customerService = customerServices[csId]
        if (customerService && customerService.serviceId) {
          serviceIds = [...serviceIds, customerService.serviceId]
        }
      })
    }
    return serviceIds
}

//Get array employeeIds of the current customer
export const getEmployeeIdsOfCustomer = (customerServiceIds, customerServices, employeeServices)  => {
  let employeeIds = []
    if (customerServiceIds && customerServices) {
      customerServiceIds.map(csId => {
        let customerService = customerServices[csId]
        if (customerService && customerService.employeeServices) {
          customerService.employeeServices.map (esId => {
            let employeeService = employeeServices[esId]
            if (employeeService && employeeService.employeeId) {
              employeeIds = [...employeeIds, employeeService.employeeId]
            }
          })
        }
      })
    }
  return employeeIds
}

//Return array of employees
export const getEmployeesArray = (employeeIds, employees)  => {
  let employeesArray = []
    if (employeeIds && employees) {
      employeeIds.map(employeeId => {
        let employee = employees[employeeId]
        if (employee) {
          employeesArray = [...employeesArray, employee]
        }
      })
    }
  return employeesArray
}

//Return array of appointment
export const getAppointmentsArray = (appointmentIds, appointments)  => {
  let appointmentsArray = []
    if (appointmentIds && appointments) {
      appointmentIds.map(appointmentId => {
        let appointment = appointments[appointmentId]
        if (appointment) {
          appointmentsArray = [...appointmentsArray, appointment]
        }
      })
    }
  return appointmentsArray
}

//This method is used for sorting appointments order by startDate.
export const compareAppointment = (a, b) => (a.start > b.start) ? 1 : ((b.start > a.start) ? -1 : 0)


