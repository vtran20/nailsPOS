import React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'
import sampleData from './initialState'
import storeFactory from './store'
import { initialData } from './actions'
import {
  addCustomerError
} from './actions/customers'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'
import { red, amber } from '@material-ui/core/colors'
import App from './pages/App'
import CheckIn from './pages/CheckIn'
import Cookies from 'universal-cookie'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    primary: red,
    secondary: {
      main: amber.A400,
      light: amber[200],
      dark: amber[700]
    },
    type: 'dark'
  },
  spacing: {
    unit: 10
  }
})

// const initialState = localStorage['redux-store']
//   ? JSON.parse(localStorage['redux-store'])
//   : sampleData

// const saveState = () =>
//   (localStorage['redux-store'] = JSON.stringify(store.getState()))

const store = storeFactory()
// store.subscribe(saveState)

// const handleError = error => {
//   store.dispatch(addCustomerError(error.message))
// }
const cookies = new Cookies()
const storeIdFromCookie = cookies.get('STORE_ID_COOKIE')
store.dispatch(initialData(storeIdFromCookie))

window.store = store
// window.addEventListener('error', handleError)

// store.dispatch(
//   addCustomer({
//     id: 7,
//     firstName: '7777',
//     lastName: '88888BBB',
//     phone: '7342222222',
//     email: '2222@yahoo.com'
//   })
// )

render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
)
//store.subscribe(() => console.log(store.getState()))
