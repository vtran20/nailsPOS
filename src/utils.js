export const urlAPI = 'http://localhost/nails'

const DEFAULT_CURRENCY = 'USD'
const DEFAULT_LOCALE = 'en-US'

export const handleErrors = response => {
  if (!response.ok) {
    console.log(JSON.stringify(response))
    throw Error(response.statusText)
  }
  return response
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
	return cents.toFixed(0)
}

export const getServiceCost = (customer, customerServices, employeeServices )  => {
  let total = 0
    if (customer && customer.customerServices) {
      customer.customerServices.map(csId => {
      	let serviceTotal = 0;
    	if (customerServices[csId].employeeServices) {
    		customerServices[csId].employeeServices.map (esId => {
    			const employeeService = employeeServices[esId]
    			if (employeeService && employeeService.servicePay > 0) {
    				serviceTotal = serviceTotal + employeeService.servicePay
    			}
    		})
    	} 
      console.log(serviceTotal)
    	//use servicePay from employeeService if any
    	if (serviceTotal > 0) {
    		total = total + serviceTotal
    	} else {
	        total = total + customerServices[csId].price
    	}
      })
    }
    return total
}
