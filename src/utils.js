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
  if (cents) {
    var dollars = cents / 100;
    return dollars.toLocaleString(locale? locale : DEFAULT_LOCALE, {style:"currency", currency:currency? currency : DEFAULT_CURRENCY});
  } else {
    return 0
  }
}

export const cents2Fixed2 = (cents) => {
  if (cents) {
    var dollars = cents / 100;
    return dollars.toFixed(2)
  } else {
    return 0
  }  
}

export const dollars2Cents = (dollars) => {
  if (dollars) {
    var cents = dollars * 100;
    return parseInt(cents.toFixed(0))
  } else {
    return 0
  }  
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


//Validation
const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined
const maxLength15 = maxLength(15)
const minValue = min => value =>
  value && value < min ? `Must be at least ${min}` : undefined
const minValue13 = minValue(13)
export const required = value => {
  let removeSpecicalCharacter = value? value.replace(/\D+/g, '') : undefined
  return removeSpecicalCharacter ? undefined : 'Required'
}
export const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined
export const minLength2 = minLength(2)
export const number = value =>
  value && isNaN(Number(value)) ? 'Must be a number' : undefined
export const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined
export const alphaNumeric = value =>
  value && /[^a-zA-Z0-9 ]/i.test(value)
    ? 'Only alphanumeric characters'
    : undefined
export const phoneNumber = value =>
  value && !/^(0|[1-9][0-9]{9})$/i.test(value)
    ? 'Invalid phone number, must be 10 digits'
    : undefined

