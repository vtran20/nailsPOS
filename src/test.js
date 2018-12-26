import React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'
import sampleData from './initialState'
import storeFactory from './store'
import { addError, searchCustomers } from './actions/customers'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'
import { red, amber } from '@material-ui/core/colors'
import { CssBaseline } from '@material-ui/core'
import PhoneAutosuggest from './components/common/PhoneAutosuggest'

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

const initialState = localStorage['redux-store']
  ? JSON.parse(localStorage['redux-store'])
  : sampleData

const saveState = () =>
  (localStorage['redux-store'] = JSON.stringify(store.getState()))

const handleError = error => {
  store.dispatch(addError(error.message))
}

const store = storeFactory()
store.subscribe(saveState)
// store.subscribe(() => console.log(store.getState()))

window.React = React
window.store = store

window.addEventListener('error', handleError)

// store.dispatch(searchCustomers('', 'vuktx@yahoo.com'))

render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <PhoneAutosuggest />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
)
