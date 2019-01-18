export const urlAPI = 'http://localhost/nails'

const DEFAULT_CURRENCY = 'USD'
const DEFAULT_LOCALE = 'en-US'

export const handleErrors = response => {
  if (!response.ok) {
    console.log(response)
    throw Error(response.statusText + ':' + response.url)
  }
  return response
}

export const handleErrorMessages = data => {
  if (data) {
    if (data.errors) {
      throw Error (data.errors[0])
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

// export const getTotalPrice = (servicePrice, tipPrice, taxPrice )  => {
//   let total = 0
//   if (servicePrice) total += servicePrice
//   if (tipPrice) total += tipPrice
//   if (taxPrice) total += tipPrice
//   return total
// }


//This method is used for sorting appointments order by startDate.
export const compareAppointment = (a, b) => (a.start > b.start) ? 1 : ((b.start > a.start) ? -1 : 0)


