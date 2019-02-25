import React, { Component } from 'react'
import moment from 'moment'
import {
  TextField,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Select
} from '@material-ui/core'
import MaskedInput from 'react-text-mask'
import Cookies from 'universal-cookie'
export const urlAPI = 'http://localhost/nails'

const DEFAULT_CURRENCY = 'USD'
const DEFAULT_LOCALE = 'en-US'
const POS_DATETIME_FORMAT = `YYYY-MM-DDTHH:mm:ssZ`

export const getCurrentDateTime = () => moment().format(POS_DATETIME_FORMAT)
export const getStartEndCurrentDate = () => {
  return `startDate=${moment().startOf('day').format()}&endDate=${moment().endOf('day').format()}`
}

export const handleErrors = response => {
  if (!response.ok) {
    throw Error(response.statusText + ':' + response.url)
  }
  return response
}

export const handleErrorMessages = data => {
  if (data) {
    console.log(data.errors)
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

export const updateHours = (currentDate, hours) => {
  const dayOfWeek = currentDate.format('ddd')
  const dayTime = hours && hours[dayOfWeek]? hours[dayOfWeek] : undefined
  const hoursArr = dayTime? dayTime.split('-') : undefined
  return hoursArr
}

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

//Form fields
export const TextMaskCustom = (props) => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      // ref={inputRef}
      mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      placeholderChar={'\u2000'}
      showMask
    />
  );
}

export const renderTextField = ({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}) => (
  <TextField
    label={label}
    // placeholder={label}
    variant="outlined"
    margin="normal"
    error={touched && invalid}
    helperText={touched && error}
    fullWidth
    InputLabelProps={{
      shrink: true,
    }}    
    {...input}
    {...custom}
  />
)

export const renderPriceTextField = ({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}) => (
  <TextField
    label={label}
    // placeholder={label}
    variant="outlined"
    margin="normal"
    error={touched && invalid}
    helperText={touched && error}
    fullWidth
    InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}    
    {...input}
    {...custom}
  />
)

export const renderPhoneTextField = ({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}) => (
  <TextField
    label={label}
    // placeholder={label}
    variant="outlined"
    margin="normal"
    error={touched && invalid}
    helperText={touched && error}
    fullWidth
    InputLabelProps={{
      shrink: true,
    }}
    InputProps={{
      inputComponent: TextMaskCustom,
    }}
    {...input}
    {...custom}
  />
)


export const renderInput = field =>   // Define stateless component to render input and errors
  <div>
    <input {...field.input} type={field.type}/> 
    {field.meta.touched &&
     field.meta.error &&
     <span className="error">{field.meta.error}</span>}
  </div>

export const renderCheckbox = ({ input, label }) => (
  <div>
    <FormControlLabel
      control={
        <Checkbox
          checked={input.value ? true : false}
          onChange={input.onChange}
        />
      }
      label={label}
    />
  </div>
)

export const renderSelectField = ({ input, label, meta: { touched, invalid, error }, children, ...custom }) => (
  <TextField
      fullWidth
      id={label}
      select
      label={label}
      error={touched && invalid}
      helperText={touched && error}
      InputLabelProps={{
        shrink: true,
      }}
      {...input}
      {...custom}
      // className={classes.textField}
      //value={0}
      // onChange={handleChange('currency')}
      // SelectProps={{
      //   MenuProps: {
      //     className: classes.menu,
      //   },
      // }}
      // helperText="Please select your currency"
      margin="normal"
      variant="outlined"
    >
    {children}
  </TextField>
)

const cookies = new Cookies()
export const getHeader = method => {
  if ('GET' === method || 'POST' === method || 'PUT' === method || 'DELETE' === method) {
      const secureCookie = cookies.get('USER_SESSION_SECURE_COOKIE')
    return {
      'Content-Type': 'application/json',
      'app-id': secureCookie
    }
  }
}

//Get all group of services
export const getServicesByGroup = (byId, group) => (
  group && group.services
  ? group.services.map(id => byId[id])
  : []
)
