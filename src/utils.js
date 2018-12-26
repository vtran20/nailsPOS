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